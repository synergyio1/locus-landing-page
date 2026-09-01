import type { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { ShowcaseStage } from "@/components/showcase/showcase-stage"
import { buttonVariants } from "@/components/ui/button"
import { VideoPlayer } from "@/components/ui/video-player"
import { appShowcase } from "@/content/app-showcase"
import { appTour } from "@/content/app-tour"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "The app — Locus",
  description:
    "A walk through Locus: six tabs and a chat in the title bar — all of it on your Mac.",
}

const BODY = "text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base"
const LABEL =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-text)]"

/**
 * /app — the showcase, on its own page. The per-tab write-ups live inside the
 * stage (the caption's "More about …" toggle), so this page is deliberately
 * short: header, stage, how the tabs connect, the walkthrough once it exists,
 * and the download.
 */
export default function AppPage() {
  const { connect } = appShowcase

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
        <ShowcaseStage
          content={appShowcase}
          idBase="app-showcase"
          eager
          className="mx-auto max-w-[1100px]"
        />
      </SpringReveal>

      <SpringReveal
        delay={80}
        className="mx-auto mt-16 flex max-w-[64ch] flex-col gap-3 border-t border-[var(--border)] pt-8 md:mt-24"
      >
        <h2 className="text-lg font-semibold tracking-tight text-[var(--fg)] md:text-xl">
          {connect.heading}
        </h2>
        <p className={BODY}>{connect.text}</p>
      </SpringReveal>

      {appTour.video ? (
        <SpringReveal delay={80} className="mt-16 flex flex-col gap-4 md:mt-24">
          <span className={LABEL}>{appTour.videoLabel}</span>
          <VideoPlayer video={appTour.video} label={appTour.videoLabel} />
        </SpringReveal>
      ) : null}

      <SpringReveal
        delay={80}
        className="mx-auto mt-16 flex max-w-[64ch] flex-col gap-6 border-t border-[var(--border)] pt-8 md:mt-24"
      >
        <p className={BODY}>{appTour.closer}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={appTour.cta.href}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            {appTour.cta.label}
          </Link>
          {appTour.secondaryCta ? (
            <Link
              href={appTour.secondaryCta.href}
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              {appTour.secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </SpringReveal>
    </PageShell>
  )
}
