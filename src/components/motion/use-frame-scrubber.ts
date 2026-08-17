"use client"

import * as React from "react"
import { useMotionValueEvent, type MotionValue } from "motion/react"

/**
 * useFrameScrubber — paints a scroll-driven image sequence onto a <canvas>.
 *
 * A `MotionValue<number>` in [0,1] (typically `scrollYProgress` from a pinned
 * stage) selects a frame; the nearest loaded frame is drawn with object-fit:
 * cover at device-pixel resolution. This is the reliable version of "scrub a
 * video with scroll" — it avoids the backward-seek jank of `video.currentTime`
 * by pre-decoding discrete frames.
 *
 * Loading strategy (borrowed from the OPTIKKA/Apple-style playbook):
 *  - nearest-first, biased toward the scroll direction, so the frames you are
 *    about to reveal load before the ones behind you;
 *  - a bounded resident window (`maxResident`) evicts the frames farthest from
 *    the playhead so decoded-bitmap memory stays flat on long sequences —
 *    evicted frames re-decode instantly from the browser's HTTP cache;
 *  - draws are coalesced to one per animation frame.
 *
 * The hook does nothing until `enabled` is true, so the caller can defer all
 * network + decode work until the section is near the viewport.
 */

const NONE = 0
const LOADING = 1
const LOADED = 2

export type FrameScrubberOptions = {
  frameCount: number
  /** Maps a 0-based frame index to its source URL. */
  getFrameSrc: (index: number) => string
  /** Scroll progress in [0,1] that selects the frame. */
  progress: MotionValue<number>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  /** Gate all work (network, decode, draw) until the section is in view. */
  enabled?: boolean
  /** Max simultaneous image requests. */
  concurrency?: number
  /**
   * Upper bound on decoded frames kept in memory around the playhead. Set this
   * at or above frameCount to hold the whole sequence decoded — scrubbing then
   * does zero decode work and stays fluid at any scroll speed. Lower it only
   * for sequences too large to fit in memory (~3–4 MB per 1200px frame).
   */
  maxResident?: number
  /** Fired once, when the first frame has actually been painted. */
  onReady?: () => void
}

export function useFrameScrubber({
  frameCount,
  getFrameSrc,
  progress,
  canvasRef,
  enabled = true,
  concurrency = 8,
  maxResident = 96,
  onReady,
}: FrameScrubberOptions): { ready: boolean } {
  const [ready, setReady] = React.useState(false)

  // Frames are held as decoded HTMLImageElements. Deliberately NOT
  // ImageBitmaps: holding the whole sequence as bitmaps pins ~300MB+ of GPU
  // textures and degrades compositing page-wide; decoded <img>s live in the
  // browser's discardable cache and scrub at 60fps.
  const imagesRef = React.useRef<(HTMLImageElement | null)[] | null>(null)
  const statusRef = React.useRef<Uint8Array | null>(null)
  const residentRef = React.useRef<number[]>([])
  const currentRef = React.useRef(0)
  const directionRef = React.useRef(1)
  const inFlightRef = React.useRef(0)
  const pendingDrawRef = React.useRef<number | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const readyFiredRef = React.useRef(false)
  const enabledRef = React.useRef(enabled)
  const disposedRef = React.useRef(false)
  const getFrameSrcRef = React.useRef(getFrameSrc)
  const onReadyRef = React.useRef(onReady)

  // Keep latest callbacks addressable from the stable closures below without
  // re-subscribing — synced after commit, never mutated during render.
  React.useEffect(() => {
    getFrameSrcRef.current = getFrameSrc
    onReadyRef.current = onReady
  })

  // Allocate per-frame bookkeeping once the count is known (after commit).
  // Declared before the work effects so the arrays exist by the time any of
  // them run on mount.
  React.useEffect(() => {
    statusRef.current = new Uint8Array(frameCount)
    imagesRef.current = new Array(frameCount).fill(null)
    residentRef.current = []
    readyFiredRef.current = false
    currentRef.current = 0
    setReady(false)
  }, [frameCount])

  const drawCover = React.useCallback(
    (img: HTMLImageElement) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const cw = canvas.width
      const ch = canvas.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      if (!cw || !ch || !iw || !ih) return
      const scale = Math.max(cw / iw, ch / ih)
      const dw = iw * scale
      const dh = ih * scale
      const dx = (cw - dw) / 2
      const dy = (ch - dh) / 2
      // No clearRect: object-cover geometry always fills the canvas, so the
      // draw fully overwrites the previous frame — skipping the clear saves a
      // full-canvas op every scrub frame.
      ctx.drawImage(img, dx, dy, dw, dh)
    },
    [canvasRef]
  )

  const paint = React.useCallback(
    (index: number) => {
      const status = statusRef.current
      const images = imagesRef.current
      if (!status || !images) return
      let img: HTMLImageElement | null =
        status[index] === LOADED ? images[index] : null

      // No exact frame yet — draw the nearest loaded neighbour so the stage
      // never flashes blank while frames stream in.
      if (!img) {
        for (let r = 1; r < frameCount; r++) {
          const lo = index - r
          const hi = index + r
          if (lo >= 0 && status[lo] === LOADED) {
            img = images[lo]
            break
          }
          if (hi < frameCount && status[hi] === LOADED) {
            img = images[hi]
            break
          }
        }
      }
      if (!img) return
      drawCover(img)
      if (!readyFiredRef.current) {
        readyFiredRef.current = true
        setReady(true)
        onReadyRef.current?.()
      }
    },
    [drawCover, frameCount]
  )

  const scheduleDraw = React.useCallback(
    (index: number) => {
      pendingDrawRef.current = index
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const next = pendingDrawRef.current
        pendingDrawRef.current = null
        if (next != null) paint(next)
      })
    },
    [paint]
  )

  const evictIfNeeded = React.useCallback(() => {
    const resident = residentRef.current
    if (resident.length <= maxResident) return
    const status = statusRef.current
    const images = imagesRef.current
    if (!status || !images) return
    const current = currentRef.current
    // Keep the frames closest to the playhead; drop the farthest.
    resident.sort(
      (a, b) => Math.abs(a - current) - Math.abs(b - current)
    )
    while (resident.length > maxResident) {
      const victim = resident.pop()
      if (victim == null) break
      const img = images[victim]
      if (img) img.src = ""
      images[victim] = null
      status[victim] = NONE
    }
  }, [maxResident])

  const pumpRef = React.useRef<() => void>(() => {})

  const load = React.useCallback(
    (index: number) => {
      const status = statusRef.current
      const images = imagesRef.current
      if (!status || !images || status[index] !== NONE) return
      status[index] = LOADING
      inFlightRef.current += 1
      const img = new Image()
      img.decoding = "async"
      images[index] = img
      const settle = () => {
        inFlightRef.current -= 1
        // Loads can settle after unmount — don't restart the pump then.
        if (!disposedRef.current) pumpRef.current()
      }
      img.onload = () => {
        // Decode-ahead: force the frame to decoded state before it's needed so
        // scrub draws never stall on a synchronous decode. Deliberately NOT
        // createImageBitmap: bitmaps pin the whole sequence (~300MB+) as GPU
        // textures and pressure the compositor page-wide; decoded <img>
        // elements live in Chrome's discardable cache and scrub at 60fps.
        const finish = () => {
          if (status[index] !== LOADING) {
            settle()
            return
          }
          status[index] = LOADED
          residentRef.current.push(index)
          evictIfNeeded()
          if (index === currentRef.current) scheduleDraw(index)
          settle()
        }
        const decoded = img.decode?.()
        if (decoded && typeof decoded.then === "function") {
          decoded.then(finish, finish)
        } else {
          finish()
        }
      }
      img.onerror = () => {
        status[index] = NONE
        images[index] = null
        settle()
      }
      img.src = getFrameSrcRef.current(index)
    },
    [evictIfNeeded, scheduleDraw]
  )

  const pickNext = React.useCallback((): number | null => {
    const status = statusRef.current
    if (!status) return null
    const c = currentRef.current
    const dir = directionRef.current >= 0 ? 1 : -1
    if (status[c] === NONE) return c
    for (let r = 1; r < frameCount; r++) {
      const ahead = c + r * dir
      const behind = c - r * dir
      if (ahead >= 0 && ahead < frameCount && status[ahead] === NONE) return ahead
      if (behind >= 0 && behind < frameCount && status[behind] === NONE) return behind
    }
    return null
  }, [frameCount])

  const pump = React.useCallback(() => {
    if (!enabledRef.current) return
    while (inFlightRef.current < concurrency) {
      const next = pickNext()
      if (next == null) break
      load(next)
    }
  }, [concurrency, load, pickNext])

  // `load`'s settle callback re-pumps via this ref, breaking the load↔pump
  // cycle without re-creating either closure. Synced after commit.
  React.useEffect(() => {
    pumpRef.current = pump
  }, [pump])

  const toIndex = React.useCallback(
    (value: number) => {
      const clamped = value < 0 ? 0 : value > 1 ? 1 : value
      const idx = Math.round(clamped * (frameCount - 1))
      return idx < 0 ? 0 : idx > frameCount - 1 ? frameCount - 1 : idx
    },
    [frameCount]
  )

  // Scroll → frame index. The progress MotionValue is updated from inside the
  // scroll handler's own rAF, so this fires once per frame; paint synchronously
  // here (rather than deferring another rAF) to keep draw and scroll on the
  // same frame — that's what unlocks 60fps scrubbing instead of half-rate.
  useMotionValueEvent(progress, "change", (value) => {
    if (!enabledRef.current) return
    const idx = toIndex(value)
    if (idx === currentRef.current) return
    directionRef.current = idx >= currentRef.current ? 1 : -1
    currentRef.current = idx
    paint(idx)
    pump()
  })

  // Start / stop work when the section enters or leaves the deferral zone.
  React.useEffect(() => {
    enabledRef.current = enabled
    if (!enabled) return
    currentRef.current = toIndex(progress.get())
    scheduleDraw(currentRef.current)
    pump()
  }, [enabled, progress, pump, scheduleDraw, toIndex])

  // Keep the canvas backing store at device-pixel resolution and repaint.
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof ResizeObserver === "undefined") return
    const resize = () => {
      // Cap at 1.5: the source frames are ~1280px wide, so a higher backing-
      // store resolution only enlarges the per-frame fill cost without adding
      // any real detail. Keeps the scrub fluid on large/hi-dpi displays.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (w === 0 || h === 0) return
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      paint(currentRef.current)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [canvasRef, paint])

  // Teardown.
  React.useEffect(() => {
    disposedRef.current = false
    return () => {
      disposedRef.current = true
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      const images = imagesRef.current
      if (!images) return
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        if (img) img.src = ""
        images[i] = null
      }
    }
  }, [])

  return { ready }
}
