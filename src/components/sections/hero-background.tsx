"use client"

import * as React from "react"

import { useReducedMotion } from "@/components/motion"

/**
 * HeroBackground — cinematic portrait video anchored to the right rail
 * on desktop, full-bleed on mobile (where the viewport is already vertical).
 *
 * The video is decorative. It is muted, looped, and `aria-hidden`. Under
 * `prefers-reduced-motion: reduce` it is replaced by its still poster.
 *
 * Layer stack (back to front):
 *   1. Base canvas         — page navy, always present.
 *   2. Video / poster      — the asset, masked into the right rail (md+)
 *                            or full-bleed (mobile), `object-cover`.
 *   3. Cobalt grade        — thin accent-tinted overlay over the video so
 *                            its cool greys read on-brand.
 *   4. Edge fades          — gradients that melt the video into the navy
 *                            (left edge on desktop; top + bottom always).
 *   5. Chroma grid (left)  — 88px hairline lattice, masked into the text
 *                            rail only; keeps that side from going inert.
 *
 * The bottom edge dissolves into the page navy (no hairline): the next
 * section (Transformation) fades in from the same navy, so the two scenes
 * hand off through a shared dark band instead of a hard cut.
 */
export function HeroBackground() {
  const reduced = useReducedMotion()
  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  // Pause the loop when the tab is hidden — saves battery, cuts GPU work.
  React.useEffect(() => {
    if (reduced) return
    const video = videoRef.current
    if (!video) return
    const onVisibility = () => {
      if (document.hidden) video.pause()
      else void video.play().catch(() => {})
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [reduced])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[var(--bg)]"
    >
      {/* Video / poster — the asset. Top edge runs full-bleed so the snow
          spreads up under the navbar with no seam; the bottom takes a
          long eased dissolve into the canvas. The fade stays gentle through
          ~88% so the penguin (walking near the bottom of frame) keeps its
          presence, then commits to full transparency at the edge. */}
      <div
        className="absolute inset-0 md:left-auto md:right-0 md:w-[72%] lg:w-[68%] xl:w-[62%]"
        style={{
          WebkitMaskImage:
            "linear-gradient(180deg, black 0%, black 76%, rgba(0,0,0,0.92) 84%, rgba(0,0,0,0.7) 90%, rgba(0,0,0,0.35) 95%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, black 0%, black 76%, rgba(0,0,0,0.92) 84%, rgba(0,0,0,0.7) 90%, rgba(0,0,0,0.35) 95%, transparent 100%)",
        }}
      >
        {reduced ? (
          <img
            src="/hero/glacier-walk-poster.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover object-center [filter:contrast(1.05)_saturate(0.9)]"
            decoding="async"
          />
        ) : (
          <video
            ref={videoRef}
            src="/hero/glacier-walk.mp4"
            poster="/hero/glacier-walk-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 size-full object-cover object-center [filter:contrast(1.05)_saturate(0.9)]"
          />
        )}
        {/* Dark overlay (Luis, 2026-08-17): plain black at partial opacity so
            the bright footage reads as a dimmed scene against the light
            canvas — no tint. Lives inside the masked container so it follows
            the video's own alpha and never darkens the canvas dissolve. */}
        <div
          className="absolute inset-0"
          style={{ background: "rgb(0 0 0 / 0.45)" }}
        />
      </div>

      {/* Desktop left-edge fade — a long, smooth taper so the snow spills
          gracefully into the text rail rather than terminating in a wall. */}
      <div
        className="absolute inset-y-0 right-0 hidden md:block md:w-[72%] lg:w-[68%] xl:w-[62%]"
        style={{
          background:
            "linear-gradient(to right, var(--bg) 0%, color-mix(in oklab, var(--bg) 86%, transparent) 12%, color-mix(in oklab, var(--bg) 55%, transparent) 30%, color-mix(in oklab, var(--bg) 22%, transparent) 52%, transparent 78%)",
        }}
      />

      {/* Mobile darkening — the full-bleed portrait sits behind the text on
          small screens; this keeps the lower half (where the CTAs live)
          on near-canvas so the headline reads cleanly. */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--bg) 30%, transparent) 0%, color-mix(in oklab, var(--bg) 55%, transparent) 45%, color-mix(in oklab, var(--bg) 88%, transparent) 100%)",
        }}
      />

      {/* Text-rail ambient grid — quiet hairline lattice in the LEFT half
          on desktop so the text side isn't visually inert next to the video.
          Kept quiet so the graded video stays the single point of interest. */}
      <div
        className="chroma-grid absolute inset-y-0 left-0 hidden md:block md:w-[42%] lg:w-[40%] xl:w-[38%] opacity-[0.32]"
      />
    </div>
  )
}
