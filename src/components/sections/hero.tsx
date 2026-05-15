import Link from "next/link"

import { HeroWidget } from "@/components/hero-widget"
import { PageShell } from "@/components/layout/page-shell"
import { BreathingDot, SpringReveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { hero } from "@/content/hero"
import { cn } from "@/lib/utils"

import { HeroBackground } from "./hero-background"

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate"
    >
      {/* Stage one — viewport-filling headline with animated Cobalt backdrop. */}
      <div className="relative flex min-h-[100dvh] items-center overflow-hidden">
        <HeroBackground />

        <PageShell className="relative pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-10">
            <SpringReveal className="md:col-span-7 lg:col-span-6 flex flex-col items-start gap-6">
              <span className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                <BreathingDot aria-hidden />
                <span>AI-native execution OS</span>
              </span>
              <h1
                id="hero-heading"
                className="text-balance text-left text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--fg)] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[4.75rem]"
              >
                {hero.headline}
              </h1>
              <p className="max-w-xl text-pretty text-left text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base lg:text-[17px]">
                {hero.subheadline}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <MagneticButton href={hero.primaryCta.href}>
                  <span
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                    )}
                  >
                    {hero.primaryCta.label}
                  </span>
                </MagneticButton>
                <Link
                  href={hero.secondaryCta.href}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  {hero.secondaryCta.label}
                </Link>
              </div>
            </SpringReveal>
          </div>
        </PageShell>

        {/* Bottom-left mono cue — anchors the asymmetric layout per the
            DESIGN.md "01 / 03" pattern. Pure type, no fill. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 md:bottom-8">
          <PageShell className="flex items-end justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]/55">
              01 &mdash; Stage
            </span>
            <span className="hidden md:inline font-mono text-[10.5px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]/55">
              Scroll for the day &darr;
            </span>
          </PageShell>
        </div>
      </div>

      {/* Stage two — the interactive widget. Sits below the fold so the
          headline reads as the lead, and scrolling rewards with the demo. */}
      <div className="relative bg-[var(--bg)]">
        <PageShell className="pt-16 pb-24 md:pt-24 md:pb-32">
          <SpringReveal delay={80}>
            <HeroWidget />
          </SpringReveal>
        </PageShell>
      </div>
    </section>
  )
}
