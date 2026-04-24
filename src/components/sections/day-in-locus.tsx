"use client"

import * as React from "react"

import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { BreathingDot, SpringReveal } from "@/components/motion"
import { DeviceFrame } from "@/components/ui/device-frame"
import { StageRail } from "@/components/sections/day-in-locus-rail"
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
        <div className="mb-10 w-fit">
          <GoalBanner />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
          <StageRail stages={STAGES} />
          <StageNarrative />
        </div>
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

function StageNarrative() {
  return (
    <ol className="flex flex-col gap-20 md:gap-28">
      {STAGES.map((stage, i) => (
        <li
          key={stage.id}
          id={`stage-${stage.id}`}
          aria-label={`Stage ${i + 1} of ${STAGES.length}`}
          className="scroll-mt-28"
        >
          <SpringReveal className="flex flex-col gap-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)] lg:hidden">
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 62vw, 820px"
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
