"use client"

import * as React from "react"
import { motion, useTransform, type MotionValue } from "motion/react"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal, useReducedMotion } from "@/components/motion"
import { PinnedStage } from "@/components/motion/pinned-stage"

/**
 * ArmorReactor — the scroll-scrubbed "armor & reactor" showpiece.
 *
 * As the reader scrolls, a pinned canvas scrubs generated hangar footage: an
 * exploded exosuit assembles around an empty chest socket, the reader's AI
 * harness docks in as the reactor, and the whole suit powers on. The section
 * carries the plug-and-play positioning: Locus is the armor (sensors,
 * structure, memory); the intelligence is the user's own harness, connected
 * through their subscription or API key, so their data stays on their side.
 *
 * Frames under /public/armor/frames are the generated hangar sequence
 * (exploded standby → assembly → core approach → dock, ignition, pull-back),
 * extracted at 4fps from three stitched Kling 3.0 clips keyframed on four
 * approved stills. To refresh the footage, replace the files and update
 * FRAME_COUNT; nothing else here needs to change.
 */

const FRAME_COUNT = 121

const frameSrc = (index: number) =>
  `/armor/frames/frame-${String(index + 1).padStart(4, "0")}.webp`

const POSTER_SRC = "/armor/poster.webp"
const AFTER_SRC = frameSrc(FRAME_COUNT - 1)

const HARNESSES = ["Claude Code", "Codex", "opencode"] as const

type BeatDef = {
  /** [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] in scroll progress. */
  range: [number, number, number, number]
  kicker: string
  title: string
  body: string
}

// Ranges map to the footage's acts: assembly (~0–0.33), push-in toward the
// empty socket (~0.33–0.66), dock + ignition (~0.66–1.0). Copy clears out over
// the ignition flash (~0.84–0.93) so the burst reads uninterrupted.
const BEATS: BeatDef[] = [
  {
    // Negative first stop → already at full opacity the instant the stage pins.
    range: [-0.5, 0.0, 0.24, 0.31],
    kicker: "The armor",
    title: "Locus is the armor.",
    body: "Sentinel, focus, plans, reviews — a full exoskeleton for your day. Every plate is a system that holds when motivation doesn't.",
  },
  {
    // Ends before ~0.43, where the socket's anticipation glow kicks in — the
    // "no brain yet" line must sit over the dark, empty socket.
    range: [0.34, 0.39, 0.45, 0.51],
    kicker: "The socket",
    title: "It doesn't ship a brain.",
    body: "The core slot is open on purpose. Locus is everything around the intelligence — the sensors, the structure, the memory — not the intelligence itself.",
  },
  {
    range: [0.64, 0.7, 0.78, 0.84],
    kicker: "The reactor",
    title: "Plug in the brain you trust.",
    body: "Claude Code, Codex, opencode — your AI docks as the reactor, on your subscription or your API key. Your data stays on your Mac.",
  },
  {
    range: [0.93, 0.97, 1.5, 2],
    kicker: "Online",
    title: "Modularity is the advantage.",
    body: "Models leapfrog each other every month. Armor built to take any reactor never goes obsolete.",
  },
]

function Beat({
  beat,
  progress,
  bottomClass = "bottom-[14svh] md:bottom-[18svh]",
}: {
  beat: BeatDef
  progress: MotionValue<number>
  bottomClass?: string
}) {
  const [a, b, c, d] = beat.range
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0])
  const y = useTransform(progress, [a, b, c, d], [24, 0, 0, -24])

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-x-0 ${bottomClass} flex justify-center px-6`}
    >
      <div className="max-w-xl text-center">
        <span className="text-xs uppercase tracking-[0.22em] text-[var(--accent-text)]">
          {beat.kicker}
        </span>
        <h3 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl">
          {beat.title}
        </h3>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {beat.body}
        </p>
      </div>
    </motion.div>
  )
}

function HarnessChips({
  harness,
  onSelect,
  className,
}: {
  harness: string
  onSelect: (name: string) => void
  className?: string
}) {
  return (
    <div className={className} role="group" aria-label="Choose your harness">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {HARNESSES.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={harness === name}
            onClick={() => onSelect(name)}
            className={
              harness === name
                ? "rounded-full border border-[var(--accent-text)] bg-[var(--accent-subtle)] px-4 py-2 font-mono text-xs tracking-wide text-[var(--fg)] shadow-[0_0_18px_rgb(0_71_171_/_0.35)]"
                : "rounded-full border border-[var(--border)] bg-[var(--surface)]/85 px-4 py-2 font-mono text-xs tracking-wide text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent-text)]/50 hover:text-[var(--fg)]"
            }
          >
            {name}
          </button>
        ))}
      </div>
      <motion.p
        key={harness}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]"
      >
        Reactor: {harness} — your subscription, your key, your data
      </motion.p>
    </div>
  )
}

/** Switcher overlay: fades in with the final beat, interactive once visible. */
function SwitcherOverlay({ progress }: { progress: MotionValue<number> }) {
  const [harness, setHarness] = React.useState<string>(HARNESSES[0])
  const opacity = useTransform(progress, [0.94, 0.99], [0, 1])
  const pointerEvents = useTransform(progress, (v) =>
    v > 0.96 ? "auto" : "none"
  )

  return (
    <motion.div
      style={{ opacity, pointerEvents }}
      className="absolute inset-x-0 bottom-[4svh] flex justify-center px-6"
    >
      <HarnessChips harness={harness} onSelect={setHarness} />
    </motion.div>
  )
}

function ReducedFallback() {
  const [harness, setHarness] = React.useState<string>(HARNESSES[0])

  return (
    <PageShell className="py-24 md:py-36">
      <div className="flex flex-col gap-5">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          The armor &amp; the reactor
        </span>
        <h2
          id="armor-reactor-heading"
          className="max-w-2xl text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
        >
          Locus is the armor. Your AI is the reactor.
        </h2>
      </div>

      <div className="mt-10 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)]">
        <img
          src={AFTER_SRC}
          alt="The suit fully powered — its core docked and every seam lit."
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

      <HarnessChips harness={harness} onSelect={setHarness} className="mt-10" />
    </PageShell>
  )
}

export function ArmorReactor() {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <section
        id="armor-reactor"
        aria-labelledby="armor-reactor-heading"
        className="relative border-t border-[var(--border)] bg-[var(--bg)]"
      >
        <SpringReveal>
          <ReducedFallback />
        </SpringReveal>
      </section>
    )
  }

  return (
    <div id="armor-reactor" className="border-t border-[var(--border)]">
      {/* sr-only heading keeps the scrubbed showpiece labelled for AT/SEO. */}
      <h2 id="armor-reactor-heading" className="sr-only">
        The armor and the reactor — Locus is the armor; your own AI harness
        docks in as the reactor and powers it on.
      </h2>
      <PinnedStage
        labelledBy="armor-reactor-heading"
        frameCount={FRAME_COUNT}
        getFrameSrc={frameSrc}
        posterSrc={POSTER_SRC}
        trackHeight="380svh"
      >
        {(progress) => (
          <>
            {BEATS.map((beat) => (
              <Beat key={beat.title} beat={beat} progress={progress} />
            ))}
            <SwitcherOverlay progress={progress} />
          </>
        )}
      </PinnedStage>
    </div>
  )
}
