import Link from "next/link"

import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { BreathingDot, SpringReveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import { hero } from "@/content/hero"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <PageShell as="section" className="pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
        <SpringReveal className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            <BreathingDot aria-hidden />
            macOS focus system
          </span>
          <h1 className="text-5xl font-semibold leading-none tracking-tighter text-[var(--fg)] md:text-7xl">
            {hero.headline}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
            {hero.subheadline}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href={hero.primaryCta.href}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </SpringReveal>

        <SpringReveal delay={120} className="relative">
          <AppScreenshot
            src={hero.screenshot.src}
            alt={hero.screenshot.alt}
            width={hero.screenshot.width}
            height={hero.screenshot.height}
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 58vw, 820px"
            priority
          />
        </SpringReveal>
      </div>
    </PageShell>
  )
}
