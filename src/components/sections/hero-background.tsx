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
 *   6. Bottom hairline     — accent-tinted seam to the widget stage below.
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
          spreads up under the navbar with no dark seam; only the bottom
          fades into the widget stage. */}
      <div
        className="absolute inset-0 md:left-auto md:right-0 md:w-[72%] lg:w-[68%] xl:w-[62%]"
        style={{
          WebkitMaskImage:
            "linear-gradient(180deg, black 0%, black 86%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, black 0%, black 86%, transparent 100%)",
        }}
      >
        {reduced ? (
          <img
            src="/hero/glacier-walk-poster.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover object-center"
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
            className="absolute inset-0 size-full object-cover object-center"
          />
        )}
      </div>

      {/* Cobalt grade — sits over the video footprint only. Restrained
          tint that pulls the cool greys toward the brand accent without
          dimming the snow. Light touch so the 1080p source reads crisp. */}
      <div
        className="absolute inset-0 md:left-auto md:right-0 md:w-[72%] lg:w-[68%] xl:w-[62%]"
        style={{
          background:
            "color-mix(in oklab, var(--accent) 8%, transparent)",
          mixBlendMode: "overlay",
          opacity: 0.2,
        }}
      />

      {/* Desktop left-edge fade — a long, smooth taper so the snow spills
          gracefully into the text rail rather than terminating in a wall. */}
      <div
        className="absolute inset-y-0 right-0 hidden md:block md:w-[72%] lg:w-[68%] xl:w-[62%]"
        style={{
          background:
            "linear-gradient(to right, var(--bg) 0%, color-mix(in oklab, var(--bg) 86%, transparent) 12%, color-mix(in oklab, var(--bg) 55%, transparent) 30%, color-mix(in oklab, var(--bg) 22%, transparent) 52%, transparent 78%)",
        }}
      />

      {/* Scattered light — a soft warm-white halo that escapes the video
          and bleeds left into the text rail. Sits in screen-blend so it
          adds light without flattening the navy. The elegant move. */}
      <div
        className="absolute inset-y-0 right-0 hidden md:block md:w-[82%] lg:w-[80%] xl:w-[74%]"
        style={{
          background:
            "radial-gradient(ellipse 55% 80% at 75% 45%, color-mix(in oklab, white 12%, transparent) 0%, color-mix(in oklab, white 5%, transparent) 35%, transparent 70%)",
          mixBlendMode: "screen",
          filter: "blur(20px)",
          opacity: 0.55,
        }}
      />

      {/* Top-right bloom — a soft upward spread of snow-light that melts
          the upper edge of the video into the navy above the navbar.
          Kills the hard dark corner without re-introducing a fade band. */}
      <div
        className="absolute inset-x-0 top-0 hidden md:block h-[55%] md:right-0 md:left-auto md:w-[78%] lg:w-[74%] xl:w-[68%]"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 70% 0%, color-mix(in oklab, white 18%, transparent) 0%, color-mix(in oklab, white 8%, transparent) 30%, transparent 65%)",
          mixBlendMode: "screen",
          filter: "blur(28px)",
          opacity: 0.85,
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
          Scoped tighter and lower opacity now that the white halo bleeds in. */}
      <div
        className="chroma-grid absolute inset-y-0 left-0 hidden md:block md:w-[42%] lg:w-[40%] xl:w-[38%] opacity-[0.32]"
      />

      {/* Bottom hairline — accent-tinted seam against the widget stage. */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent-text) 30%, transparent) 50%, transparent 100%)",
        }}
      />
    </div>
  )
}
