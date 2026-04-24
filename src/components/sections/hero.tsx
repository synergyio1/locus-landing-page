import Link from "next/link"

import { AppScreenshot } from "@/components/media/app-screenshot"
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
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh] bg-[radial-gradient(ellipse_80%_60%_at_60%_0%,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_70%)]"
      />

      <PageShell className="relative flex min-h-[88dvh] flex-col justify-center pt-24 pb-20 md:pt-28 md:pb-24">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:gap-16">
          <SpringReveal className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              <BreathingDot aria-hidden />
              <span>macOS focus system</span>
              <span
                aria-hidden
                className="hidden h-px w-14 bg-gradient-to-r from-[var(--muted-foreground)]/60 to-transparent md:inline-block"
              />
            </span>
            <h1
              id="hero-heading"
              className="text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-[var(--fg)] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] xl:text-[4.75rem]"
            >
              {hero.headline}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
              {hero.subheadline}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
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

          <SpringReveal delay={120} className="relative">
            {/* Halo glow — replaces the baked-in backdrop we cropped from the PNG */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse 95% 78% at 55% 45%, color-mix(in oklab, var(--accent) 30%, transparent) 0%, color-mix(in oklab, var(--accent) 10%, transparent) 35%, transparent 70%)",
                filter: "blur(52px)",
                transform: "translate3d(0, 4%, 0) scale(1.08)",
              }}
            />
            {/* Ambient rim light — top-right, simulates off-screen window light */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(circle at 82% 12%, rgba(255,255,255,0.09), transparent 45%)",
                filter: "blur(24px)",
              }}
            />

            <div
              className={cn(
                "relative overflow-hidden rounded-xl border border-[var(--border)]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_60px_120px_-36px_rgba(4,10,16,0.85),0_18px_48px_-24px_rgba(74,143,232,0.22)]"
              )}
            >
              <AppScreenshot
                src={hero.screenshot.src}
                alt={hero.screenshot.alt}
                width={hero.screenshot.width}
                height={hero.screenshot.height}
                sizes="(max-width: 768px) 100vw, (max-width: 1400px) 62vw, (max-width: 1800px) 820px, 1100px"
                priority
              />
            </div>
          </SpringReveal>
        </div>
      </PageShell>
    </section>
  )
}
