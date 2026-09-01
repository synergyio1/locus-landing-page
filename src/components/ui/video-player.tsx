"use client"

import * as React from "react"

import type { TourVideo } from "@/content/app-tour"
import { cn } from "@/lib/utils"

/**
 * VideoPlayer — the walkthrough on /app.
 *
 * Deliberately NOT the hero treatment. `hero-background.tsx` is decorative
 * scenery: muted, looping, autoplaying, `aria-hidden`. This is content the
 * visitor chose to watch, so it behaves like content:
 *
 *  · Nothing plays until it's clicked. It has narration; autoplay would be
 *    rude, and a muted autoplay would waste the narration.
 *  · The aspect box is reserved from the asset's own dimensions, so the page
 *    below it never jumps when the metadata arrives.
 *  · Once started, the native controls take over — a hand-rolled scrubber
 *    would be worse at keyboard, captions and picture-in-picture than the
 *    one the OS already ships.
 *  · Pauses when the tab is hidden, like the hero does.
 *
 * The page renders this only once a recording exists (`appTour.video`); until
 * then the showcase above it carries the imagery, so there is no held frame.
 */

const FRAME =
  "relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"

export function VideoPlayer({
  video,
  label,
  className,
}: {
  video: TourVideo
  label: string
  className?: string
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const [started, setStarted] = React.useState(false)

  // Same battery/GPU courtesy as the hero: a backgrounded tab shouldn't decode.
  React.useEffect(() => {
    if (!started) return
    const el = videoRef.current
    if (!el) return
    const onVisibility = () => {
      if (document.hidden) el.pause()
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [started])

  const start = () => {
    setStarted(true)
    // The click is the gesture that unlocks playback; if the browser still
    // refuses, the native controls are already visible as the fallback.
    void videoRef.current?.play().catch(() => {})
  }

  return (
    <div
      className={cn(FRAME, className)}
      style={{ aspectRatio: `${video.width} / ${video.height}` }}
    >
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        preload="metadata"
        playsInline
        controls={started}
        onPlay={() => setStarted(true)}
        className="absolute inset-0 size-full bg-[var(--fg)] object-cover"
      >
        {video.captions ? (
          <track
            kind="captions"
            src={video.captions}
            srcLang="en"
            label="English"
            default
          />
        ) : null}
      </video>

      {started ? null : (
        <button
          type="button"
          onClick={start}
          aria-label={`Play: ${label}`}
          className="group absolute inset-0 grid place-items-center bg-[color-mix(in_oklab,var(--fg)_18%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--fg)_10%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--accent)]"
        >
          <span className="flex items-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-4 fill-current"
            >
              <path d="M8 5.14v13.72a.5.5 0 0 0 .76.43l11.14-6.86a.5.5 0 0 0 0-.86L8.76 4.71A.5.5 0 0 0 8 5.14Z" />
            </svg>
            {label}
          </span>
        </button>
      )}
    </div>
  )
}
