import type { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import { VideoPlayer } from "@/components/ui/video-player"
import { appTour, type TourScreen } from "@/content/app-tour"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "The app — Locus",
  description:
    "A walk through Locus: nine screens in three families — execution, inputs, and the agent that reads both.",
}

const BODY = "text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base"
const LABEL =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-text)]"

/** Screens grouped into the run of consecutive rows that share a part. */
function groupByPart(screens: TourScreen[]): { part: string; screens: TourScreen[] }[] {
  const groups: { part: string; screens: TourScreen[] }[] = []
  for (const screen of screens) {
    const last = groups[groups.length - 1]
    if (last && last.part === screen.part) last.screens.push(screen)
    else groups.push({ part: screen.part, screens: [screen] })
  }
  return groups
}

export default function AppPage() {
  const groups = groupByPart(appTour.screens)

  return (
    <PageShell as="article" className="py-20 md:py-28">
      <SpringReveal className="flex max-w-2xl flex-col gap-4">
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          {appTour.eyebrow}
        </span>
        <h1 className="text-4xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-5xl">
          {appTour.title}
        </h1>
        <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {appTour.intro}
        </p>
      </SpringReveal>

      <SpringReveal delay={80} className="mt-12 md:mt-16">
        <VideoPlayer
          video={appTour.video}
          label={appTour.videoLabel}
          pending={appTour.videoPending}
        />
      </SpringReveal>

      <SpringReveal delay={120} className="mt-20 md:mt-28">
        <h2 className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-4xl">
          {appTour.screensIntro}
        </h2>
      </SpringReveal>

      <div className="mt-12 flex flex-col gap-14 md:mt-16 md:gap-20">
        {groups.map((group, gi) => (
          <SpringReveal
            key={group.part}
            delay={80 + gi * 40}
            className="grid gap-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
          >
            <h3 className={cn(LABEL, "md:pt-1")}>{group.part}</h3>

            <ul className="flex flex-col gap-8 border-t border-[var(--border)] pt-6 md:border-t-0 md:pt-0">
              {group.screens.map((screen) => (
                <li key={screen.name} className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h4 className="text-lg font-medium text-[var(--fg)]">
                      {screen.name}
                    </h4>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {screen.subtitle}
                    </span>
                  </div>
                  <p className={BODY}>{screen.text}</p>
                </li>
              ))}
            </ul>
          </SpringReveal>
        ))}
      </div>

      <SpringReveal
        delay={80}
        className="mt-20 flex flex-col gap-6 border-t border-[var(--border)] pt-8 md:mt-24"
      >
        <p className={cn(BODY, "max-w-[64ch]")}>{appTour.closer}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={appTour.cta.href}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            {appTour.cta.label}
          </Link>
          <Link
            href={appTour.secondaryCta.href}
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            {appTour.secondaryCta.label}
          </Link>
        </div>
      </SpringReveal>
    </PageShell>
  )
}
