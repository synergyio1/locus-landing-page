"use client"

import { motion, useTransform, type MotionValue } from "motion/react"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal, useReducedMotion } from "@/components/motion"
import { PinnedStage } from "@/components/motion/pinned-stage"

/**
 * Transformation — the scroll-scrubbed "crossing the portal" showpiece.
 *
 * As the reader scrolls, a pinned canvas scrubs through a frame sequence: a
 * figure buried under modern-day noise walks toward the Locus portal, crosses
 * it, and emerges in full command. Copy beats fade in over the three acts.
 *
 * Frames under /public/transformation/frames are the generated portal-crossing
 * sequence (grey wizard → threshold → white flash → command), extracted at
 * 8fps from the three Seedance clips stitched with 1.1s cross-dissolves at the
 * junctions (source: transformation-source/v2-hd/clips/full_dissolve2.mp4).
 * Act boundaries in scroll progress: junction 1 ≈ 0.35, junction 2 (white
 * flash) ≈ 0.65 — beat ranges below are tuned to those.
 * To refresh the footage, replace the files and update FRAME_COUNT; nothing
 * else here needs to change.
 */

const FRAME_COUNT = 104

const frameSrc = (index: number) =>
  `/transformation/frames/frame-${String(index + 1).padStart(4, "0")}.webp`

// Crisp full-res still for the at-rest entry (the scrub frames are softer, but
// motion hides that). AFTER_SRC anchors the reduced-motion fallback.
const POSTER_SRC = "/transformation/poster.webp"
const AFTER_SRC = frameSrc(FRAME_COUNT - 1)

type BeatDef = {
  /** [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] in scroll progress. */
  range: [number, number, number, number]
  kicker: string
  title: string
  body: string
  /** Persist at full opacity once faded in — the closing beat never fades out. */
  persist?: boolean
}

// Ranges map to the footage's three acts: approach (clip A, ~0–0.33),
// crossing + white flash (clip B, ~0.33–0.66), emergence (clip C, ~0.66–1.0).
// Copy clears out over the flash (~0.60–0.74) so the burst reads uninterrupted.
const BEATS: BeatDef[] = [
  {
    // Negative first stop → already at full opacity the instant the stage pins
    // (progress clamps at 0), so the headline greets the reader on entry.
    range: [-0.5, 0.0, 0.22, 0.3],
    kicker: "You, right now",
    title: "Everything, all at once.",
    body: "Your meetings, your inbox, your pings, your half-finished work — the modern day buries you before it even begins.",
  },
  {
    // Enters only after junction 1 (~0.35), once the portal IS the shot —
    // never ahead of the footage. Question form: the portal moment sells
    // possibility, not explanation (copy pass reviewed w/ codex 2026-07-07).
    range: [0.38, 0.46, 0.56, 0.62],
    kicker: "The threshold",
    title: "What if you had the full picture?",
    body: "Your tasks, your habits, your plans — and what actually happened. One system on your Mac that makes the whole day legible.",
  },
  {
    // Persists: the payoff line holds through the end of the pin, so the
    // section never shows a bare final frame. Kicker + title deliberately
    // mirror beat 1 ("You, right now" / "Everything, all at once.").
    range: [0.74, 0.82, 1, 1],
    kicker: "You, in control",
    title: "Everything, in its place.",
    body: "The noise resolves into structure: what matters, what actually moved, and what tomorrow is for.",
    persist: true,
  },
]

// Soft drop shadows keep the copy readable over any frame brightness —
// including the near-white flash — without a heavy full-frame scrim.
const TITLE_SHADOW = "0 2px 24px rgba(4, 10, 16, 0.7), 0 1px 3px rgba(4, 10, 16, 0.55)"
const BODY_SHADOW = "0 1px 16px rgba(4, 10, 16, 0.75), 0 1px 2px rgba(4, 10, 16, 0.6)"

function Beat({
  beat,
  progress,
}: {
  beat: BeatDef
  progress: MotionValue<number>
}) {
  const [a, b, c, d] = beat.range
  // Persistent beats fade in once and hold; the rest fade back out.
  const opacityStops = beat.persist ? [a, b] : [a, b, c, d]
  const opacityValues = beat.persist ? [0, 1] : [0, 1, 1, 0]
  const yValues = beat.persist ? [24, 0] : [24, 0, 0, -24]
  const opacity = useTransform(progress, opacityStops, opacityValues)
  const y = useTransform(progress, opacityStops, yValues)

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-[12svh] flex justify-center px-6 md:bottom-[16svh]"
    >
      {/* Band — a full-width darkened stripe behind the copy zone, melting
          into the footage above and below. Plain gradient fill; never
          backdrop-filter (the repainting canvas under it would drop the
          compositor to ~10fps). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -inset-y-10 md:-inset-y-12"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--bg) 82%, transparent) 30%, color-mix(in oklab, var(--bg) 82%, transparent) 70%, transparent 100%)",
        }}
      />
      <div className="relative max-w-2xl text-center">
        <span
          className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-text)] md:text-base"
          style={{ textShadow: BODY_SHADOW }}
        >
          <span
            aria-hidden
            className="h-px w-6 bg-[var(--accent-text)] opacity-70"
          />
          {beat.kicker}
          <span
            aria-hidden
            className="h-px w-6 bg-[var(--accent-text)] opacity-70"
          />
        </span>
        <h3
          className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-6xl"
          style={{ textShadow: TITLE_SHADOW }}
        >
          {beat.title}
        </h3>
        <p
          className="mx-auto mt-4 max-w-xl text-balance text-lg leading-relaxed text-[var(--fg)] opacity-90 md:text-xl"
          style={{ textShadow: BODY_SHADOW }}
        >
          {beat.body}
        </p>
      </div>
    </motion.div>
  )
}

function ReducedFallback() {
  return (
    <PageShell className="py-24 md:py-36">
      <div className="flex flex-col gap-5">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Crossing over
        </span>
        <h2
          id="transformation-heading"
          className="max-w-2xl text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
        >
          From buried under it, to in command of it.
        </h2>
      </div>

      <div className="mt-10 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)]">
        <img
          src={AFTER_SRC}
          alt="The calm after — everything under control."
          className="h-auto w-full object-cover"
          decoding="async"
        />
      </div>

      <ol className="mt-12 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {BEATS.map((beat, index) => (
          <li
            key={beat.title}
            className="grid gap-4 py-7 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8 md:py-9"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-text)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-medium tracking-tight text-[var(--fg)]">
                {beat.title}
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
                {beat.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </PageShell>
  )
}

export function Transformation() {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <section
        id="transformation"
        aria-labelledby="transformation-heading"
        className="relative border-t border-[var(--border)] bg-[var(--bg)]"
      >
        <SpringReveal>
          <ReducedFallback />
        </SpringReveal>
      </section>
    )
  }

  return (
    <div id="transformation" className="relative">
      {/* sr-only heading keeps the scrubbed showpiece labelled for AT/SEO. */}
      <h2 id="transformation-heading" className="sr-only">
        Crossing the portal — from buried under modern work to in full command
        with Locus.
      </h2>
      <PinnedStage
        labelledBy="transformation-heading"
        frameCount={FRAME_COUNT}
        getFrameSrc={frameSrc}
        posterSrc={POSTER_SRC}
        trackHeight="340svh"
      >
        {(progress) => (
          <>
            {BEATS.map((beat) => (
              <Beat key={beat.title} beat={beat} progress={progress} />
            ))}
          </>
        )}
      </PinnedStage>
      {/* Entry dissolve — anchored to the TRACK top (not the pinned stage),
          so the storm emerges from the same navy the hero dissolves into,
          then the veil scrolls away as the reader moves into the pin. Plain
          gradient, no backdrop-filter (that would drop the canvas to ~10fps). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[32svh]"
        style={{
          background:
            "linear-gradient(to bottom, var(--bg) 0%, color-mix(in oklab, var(--bg) 80%, transparent) 28%, color-mix(in oklab, var(--bg) 46%, transparent) 58%, color-mix(in oklab, var(--bg) 16%, transparent) 82%, transparent 100%)",
        }}
      />
    </div>
  )
}
