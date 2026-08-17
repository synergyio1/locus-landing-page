"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"
import { useFrameScrubber } from "./use-frame-scrubber"

/**
 * Deterministic scroll progress for a tall track: 0 when its top hits the top
 * of the viewport, 1 when its bottom hits the bottom. Computed with plain
 * geometry (rAF-throttled) rather than motion's `useScroll` auto-measurement,
 * which is unreliable for tall `position: sticky` targets and is the canonical
 * approach for image-sequence scrubbing.
 */
function useTrackProgress(
  ref: React.RefObject<HTMLElement | null>
): MotionValue<number> {
  const progress = useMotionValue(0)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    // Cache the track geometry; it only changes on resize. Reading layout
    // (getBoundingClientRect / offsetHeight) every scroll frame would force a
    // synchronous reflow — the per-frame path below reads only scrollY.
    let top = 0
    let travel = 1
    const measure = () => {
      const rect = el.getBoundingClientRect()
      top = rect.top + window.scrollY
      travel = Math.max(el.offsetHeight - window.innerHeight, 1)
    }

    let raf: number | null = null
    const update = () => {
      raf = null
      const p = (window.scrollY - top) / travel
      progress.set(p < 0 ? 0 : p > 1 ? 1 : p)
    }
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      update()
    }

    measure()
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    // Re-measure if content above the track changes the document height (late
    // images/fonts), which would otherwise leave `top` stale.
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => onResize())
        : null
    ro?.observe(document.body)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      ro?.disconnect()
      if (raf != null) cancelAnimationFrame(raf)
    }
  }, [ref, progress])

  return progress
}

type PinnedStageProps = {
  frameCount: number
  getFrameSrc: (index: number) => string
  /** First frame, shown as an eager <img> until the canvas paints. */
  posterSrc: string
  /** Height of the scroll track; the sticky stage travels (this − 100svh). */
  trackHeight?: string
  className?: string
  /** Overlay content; receives scroll progress in [0,1] to drive copy beats. */
  children?: (progress: MotionValue<number>) => React.ReactNode
  /** Accessible label id for the section. */
  labelledBy?: string
}

/**
 * PinnedStage — a tall scroll track with a viewport-pinned canvas that scrubs
 * a frame sequence as you scroll through it, plus a DOM overlay layer for copy.
 *
 * The frame engine is deferred: it only begins loading/decoding once the track
 * is within `margin` of the viewport (via useInView). Layout:
 *
 *   <section> (trackHeight, e.g. 320svh)   ← the scroll distance
 *     <div sticky h-100svh>                ← pinned while the track passes
 *       <img poster>  <canvas>  <overlay>
 */
export function PinnedStage({
  frameCount,
  getFrameSrc,
  posterSrc,
  trackHeight = "320svh",
  className,
  children,
  labelledBy,
}: PinnedStageProps) {
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  const inView = useInView(trackRef, { margin: "40% 0px 40% 0px" })

  const scrollYProgress = useTrackProgress(trackRef)

  const { ready } = useFrameScrubber({
    frameCount,
    getFrameSrc,
    progress: scrollYProgress,
    canvasRef,
    enabled: inView,
    // Hold the whole sequence decoded once in view, so scrubbing never stalls
    // on a mid-scroll decode. Fine for these ~100-frame stages; cap it if a
    // future stage ships thousands of frames.
    maxResident: frameCount,
  })

  // Keep the crisp high-res poster on top until the reader actually starts
  // scrolling. The softer scrubbed canvas only takes over once there's motion
  // to mask it — a premium at-rest still, then a seamless handoff.
  const [started, setStarted] = React.useState(false)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!started && v > 0.01) setStarted(true)
  })
  const hidePoster = started && ready

  // Focus pull: the veil breathes with the story — heaviest over the opening
  // (noise pressing down), briefly clean at the threshold, lighter and more
  // luminous from the payoff onward. Overlay-only; never touches the canvas.
  const veilOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 0.62, 0.75, 1],
    [1, 0.72, 0.9, 0.55, 0.55]
  )

  return (
    <section
      ref={trackRef}
      aria-labelledby={labelledBy}
      className={cn("relative bg-[var(--bg)]", className)}
      style={{ height: trackHeight }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
        {/* High-res poster sits above the canvas and holds the crisp entry
            frame until the first scroll; then it cross-fades to the scrub. */}
        <img
          src={posterSrc}
          alt=""
          aria-hidden
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
            hidePoster ? "opacity-0" : "opacity-100"
          )}
        />
        {/* Veil — darkens the frame into the page's navy; opacity is scrubbed
            with the story (focus pull) so acts read heavier or cleaner. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "color-mix(in oklab, var(--bg) 22%, transparent)",
            opacity: veilOpacity,
          }}
        />
        {/* Legibility scrim — keeps bottom-anchored copy readable over any
            frame brightness (bright or dark footage alike). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%]"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--bg) 92%, transparent) 0%, color-mix(in oklab, var(--bg) 62%, transparent) 32%, color-mix(in oklab, var(--bg) 24%, transparent) 62%, transparent 100%)",
          }}
        />
        {/* Overlay layer for copy beats. */}
        <div className="pointer-events-none absolute inset-0">
          {children?.(scrollYProgress)}
        </div>
      </div>
    </section>
  )
}
