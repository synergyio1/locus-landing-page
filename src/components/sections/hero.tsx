import Link from "next/link"

import { HeroWidget } from "@/components/hero-widget"
import { PageShell } from "@/components/layout/page-shell"
import { BreathingDot, SpringReveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { hero } from "@/content/hero"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden
        className="chroma-grid pointer-events-none absolute inset-0 -z-10 opacity-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_70%)]"
      />

      <PageShell className="relative flex min-h-[88dvh] flex-col justify-center pt-24 pb-20 md:pt-28 md:pb-24">
        <SpringReveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            <BreathingDot aria-hidden />
            <span>AI-native execution OS</span>
          </span>
          <h1
            id="hero-heading"
            className="text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-[var(--fg)] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem]"
          >
            {hero.headline}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {hero.subheadline}
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
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

        <SpringReveal delay={140} className="relative mt-12 md:mt-16">
          <HeroWidget />
        </SpringReveal>
      </PageShell>
    </section>
  )
}
