"use client"

import * as React from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"

import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { BreathingDot, SpringReveal, useReducedMotion } from "@/components/motion"
import { DeviceFrame } from "@/components/ui/device-frame"
import { dayInLocus, type DayInLocusStage } from "@/content/dayInLocus"
import { cn } from "@/lib/utils"

const STAGES = dayInLocus.stages

// The 2880×1800 window screenshots dominate the right column otherwise;
// 1896×1296 component cards render at their natural aspect.
const STAGE_CROP: Record<DayInLocusStage["id"], string | undefined> = {
  plan: "16/10",
  focus: "16/10",
  catch: undefined,
  close: undefined,
}

export function DayInLocus() {
  const reduced = useReducedMotion()

  return (
    <section
      id={dayInLocus.id}
      aria-labelledby="day-heading"
      className="relative border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="pt-20 pb-8 md:pt-32 md:pb-10">
        <SpringReveal className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {dayInLocus.eyebrow}
          </span>
          <h2
            id="day-heading"
            className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
          >
            {dayInLocus.headline}
          </h2>
          <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {dayInLocus.body}
          </p>
        </SpringReveal>
      </PageShell>

      <PageShell className="pb-20 md:pb-32">
        <div className="mb-8 w-fit">
          <GoalBanner />
        </div>

        {reduced ? <StackedStages /> : <SelectableStages />}
      </PageShell>
    </section>
  )
}

function GoalBanner() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--accent-subtle)] px-4 py-1.5 text-sm text-[var(--fg)] backdrop-blur-sm">
      <BreathingDot aria-hidden size={6} color="var(--accent-text)" />
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--accent-text)]">
        Today&rsquo;s goal
      </span>
      <span className="text-[var(--fg)]">{dayInLocus.goalAnchor}</span>
    </div>
  )
}

function StackedStages() {
  return (
    <ol className="flex flex-col gap-16 md:gap-24">
      {STAGES.map((stage, i) => (
        <li key={stage.id} aria-label={`Stage ${i + 1} of ${STAGES.length}`}>
          <SpringReveal className="flex flex-col gap-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              {stage.time} · {stage.label}
            </span>
            <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--fg)] md:text-3xl">
              {stage.title}
            </h3>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)]">
              {stage.caption}
            </p>
            {stage.monitor ? <MonitorCard monitor={stage.monitor} /> : null}
            <DeviceFrame className="mt-2">
              {stage.placeholder ? (
                <StagePlaceholder />
              ) : (
                <AppScreenshot
                  src={stage.screenshot.src}
                  alt={stage.screenshot.alt}
                  width={stage.screenshot.width}
                  height={stage.screenshot.height}
                  sizes="(max-width: 768px) 100vw, 820px"
                  cropAspect={STAGE_CROP[stage.id]}
                  cropPosition="top"
                />
              )}
            </DeviceFrame>
          </SpringReveal>
        </li>
      ))}
    </ol>
  )
}

function SelectableStages() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [focusedIndex, setFocusedIndex] = React.useState(0)
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const select = React.useCallback((next: number) => {
    setActiveIndex(next)
    setFocusedIndex(next)
    tabRefs.current[next]?.focus()
  }, [])

  const handleKey = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    i: number
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault()
      select((i + 1) % STAGES.length)
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault()
      select((i - 1 + STAGES.length) % STAGES.length)
    } else if (event.key === "Home") {
      event.preventDefault()
      select(0)
    } else if (event.key === "End") {
      event.preventDefault()
      select(STAGES.length - 1)
    }
  }

  const active = STAGES[activeIndex]

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <LayoutGroup id="day-in-locus-tabs">
        <div
          role="tablist"
          aria-label="A day in Locus stages"
          className="-mx-6 flex flex-row gap-1 overflow-x-auto border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] px-6 py-2 backdrop-blur-md snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-2 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none lg:snap-none"
        >
          {STAGES.map((stage, i) => {
            const selected = i === activeIndex
            return (
              <button
                key={stage.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`day-tab-${stage.id}`}
                aria-selected={selected}
                aria-controls={`day-panel-${stage.id}`}
                tabIndex={i === focusedIndex ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(event) => handleKey(event, i)}
                className="relative flex shrink-0 snap-start flex-col items-start gap-1 rounded-lg px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-text)] lg:w-full lg:shrink"
              >
                {selected ? (
                  <motion.span
                    layoutId="day-tab-pill"
                    aria-hidden
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    className="absolute inset-0 -z-10 rounded-lg border border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[var(--accent-subtle)] shadow-[inset_0_1px_0_color-mix(in_oklab,var(--accent)_35%,transparent)]"
                  />
                ) : null}
                <span
                  className={cn(
                    "font-mono text-[0.7rem] uppercase tracking-[0.22em] transition-colors",
                    selected
                      ? "text-[var(--accent-text)]"
                      : "text-[var(--muted-foreground)]"
                  )}
                >
                  {stage.time}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    selected
                      ? "text-[var(--fg)]"
                      : "text-[var(--muted-foreground)]"
                  )}
                >
                  {stage.label}
                </span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      <div
        role="tabpanel"
        id={`day-panel-${active.id}`}
        aria-labelledby={`day-tab-${active.id}`}
        tabIndex={0}
        className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-text)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <StagePanel key={active.id} stage={active} />
        </AnimatePresence>
      </div>
    </div>
  )
}

function StagePanel({ stage }: { stage: DayInLocusStage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.995 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
    >
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        {stage.time} · {stage.label}
      </span>
      <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--fg)] md:text-3xl">
        {stage.title}
      </h3>
      <p className="max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)]">
        {stage.caption}
      </p>
      {stage.monitor ? <MonitorCard monitor={stage.monitor} /> : null}
      <DeviceFrame className="mt-2">
        {stage.placeholder ? (
          <StagePlaceholder />
        ) : (
          <AppScreenshot
            src={stage.screenshot.src}
            alt={stage.screenshot.alt}
            width={stage.screenshot.width}
            height={stage.screenshot.height}
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1320px"
            cropAspect={STAGE_CROP[stage.id]}
            cropPosition="top"
          />
        )}
      </DeviceFrame>
    </motion.div>
  )
}

function StagePlaceholder() {
  return (
    <div
      aria-hidden
      className="flex aspect-[16/10] w-full items-center justify-center bg-[color-mix(in_oklab,var(--fg)_4%,var(--bg))]"
    >
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        Screenshot coming soon
      </span>
    </div>
  )
}

function MonitorCard({
  monitor,
}: {
  monitor: NonNullable<DayInLocusStage["monitor"]>
}) {
  const onTrack = monitor.verdict === "on-track"
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 text-sm",
        onTrack
          ? "border-[color-mix(in_oklab,var(--alive)_40%,transparent)] bg-[color-mix(in_oklab,var(--alive)_8%,transparent)]"
          : "border-[color-mix(in_oklab,var(--warn)_40%,transparent)] bg-[color-mix(in_oklab,var(--warn)_8%,transparent)]"
      )}
    >
      <div className="flex items-center gap-2">
        <BreathingDot
          aria-hidden
          size={6}
          color={onTrack ? "var(--alive)" : "var(--warn)"}
        />
        <span
          className={cn(
            "font-mono text-[0.7rem] uppercase tracking-[0.2em]",
            onTrack ? "text-[var(--alive)]" : "text-[var(--warn)]"
          )}
        >
          Monitor · {onTrack ? "on-track" : "off-track"}
        </span>
      </div>
      <div className="font-mono text-xs text-[var(--fg)]">
        {monitor.window}
      </div>
      <p className="text-[var(--muted-foreground)]">{monitor.detail}</p>
    </div>
  )
}
