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
 *   1. Base canvas         — page canvas (`--bg`), always present.
 *   2. Video / poster      — the asset, masked into the right rail (md+)
 *                            or full-bleed (mobile), `object-cover`, with a
 *                            light contrast lift so rock stays deep and snow
 *                            stays bright.
 *   3. Dim veil            — thin plain-black overlay (no tint) that seats
 *                            the snow a step below canvas white.
 *   4. Edge fades          — canvas gradients: a left-edge taper under the
 *                            text rail on desktop; a text-block scrim on
 *                            mobile that releases below the CTAs; a bottom
 *                            dissolve always.
 *   5. Chroma grid (left)  — 88px hairline lattice, masked into the text
 *                            rail only; keeps that side from going inert.
 *
 * Legibility contract: on md+ the copy sits on canvas (the fade holds under
 * its overhang); below md it sits on the footage, so the mobile scrim must
 * reach ≥84% canvas across the text block — see the mobile-ink note in
 * `hero.tsx`. Below md the footage is also 125% tall, top-anchored, so the
 * penguin (66% of the frame) walks at ~82% of the viewport, under the copy.
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
            className="absolute inset-0 size-full max-md:h-[125%] object-cover object-center [filter:contrast(1.12)_saturate(0.94)]"
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
            className="absolute inset-0 size-full max-md:h-[125%] object-cover object-center [filter:contrast(1.12)_saturate(0.94)]"
          />
        )}
        {/* Dim (Luis, 2026-08-17; retuned same day): a thin plain-black veil
            so the snow sits a step below the canvas white instead of merging
            with it — no tint. Kept light on purpose: at 0.45 the whole scene
            collapsed into a mid-grey fog (snow ≈134, rock ≈112 on a 238
            canvas) and lost its contrast; the tonal range now comes from the
            footage itself via the contrast filter above. Lives inside the
            masked container so it follows the video's own alpha and never
            darkens the canvas dissolve. */}
        <div
          className="absolute inset-0"
          style={{ background: "rgb(0 0 0 / 0.16)" }}
        />
      </div>

      {/* Desktop left-edge fade — a smooth taper so the snow spills into the
          text rail rather than terminating in a wall. Holds near-opaque under
          the headline's overhang (~first quarter of the footprint), then
          clears by ~64% so the right third of the footage — peak, ridge,
          penguin — reads unveiled. (Was 78%: the wash reached almost to the
          right edge and, stacked on the dim, turned the mountain to haze.) */}
      <div
        className="absolute inset-y-0 right-0 hidden md:block md:w-[72%] lg:w-[68%] xl:w-[62%]"
        style={{
          background:
            "linear-gradient(to right, var(--bg) 0%, color-mix(in oklab, var(--bg) 92%, transparent) 10%, color-mix(in oklab, var(--bg) 66%, transparent) 24%, color-mix(in oklab, var(--bg) 32%, transparent) 40%, color-mix(in oklab, var(--bg) 10%, transparent) 54%, transparent 64%)",
        }}
      />

      {/* Mobile scrim — the full-bleed portrait sits behind the text on small
          screens. The copy is top-aligned (eyebrow ≈112px → CTAs ≈466px on
          every phone, see `hero.tsx`), so the stops are in px to track that
          block rather than the viewport: a light hold behind the glass nav
          (storm sky), ≥84% canvas from the headline through the CTAs so navy
          ink lands on a light ground instead of storm cloud / dark rock,
          then a release to near-clear so the penguin — walking at ~82% of
          the viewport thanks to the 125% footage height — is unveiled on
          the snow floor with its trail dissolving into the next section.
          Over the uniform floor the release reads as snow-glare thinning,
          not a band. */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--bg) 55%, transparent) 0px, color-mix(in oklab, var(--bg) 70%, transparent) 96px, color-mix(in oklab, var(--bg) 84%, transparent) 140px, color-mix(in oklab, var(--bg) 88%, transparent) 300px, color-mix(in oklab, var(--bg) 86%, transparent) 470px, color-mix(in oklab, var(--bg) 30%, transparent) 530px, color-mix(in oklab, var(--bg) 12%, transparent) 600px, color-mix(in oklab, var(--bg) 10%, transparent) 100%)",
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
