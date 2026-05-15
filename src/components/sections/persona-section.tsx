import * as React from "react"

import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { personaSection, type PersonaScreen } from "@/content/personaSection"

/**
 * "A week in Sara's Locus" — single-persona feature tour. One relatable
 * persona walked across the main app surfaces (Execution → Tasks →
 * Commitments → Review). Each screen is the real running app rendered
 * against Sara's seeded SwiftData store via `MarketingSnapshotTests`.
 */
export function PersonaSection() {
  return (
    <section
      id={personaSection.id}
      aria-labelledby="persona-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-32">
        <SpringReveal className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {personaSection.eyebrow}
          </span>
          <h2
            id="persona-heading"
            className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
          >
            {personaSection.headline}
          </h2>
          <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {personaSection.body}
          </p>
          <PersonaChip />
        </SpringReveal>

        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {personaSection.screens.map((screen, index) => (
            <SpringReveal
              key={screen.id}
              delay={index === 0 ? 80 : 60}
              className="contents"
            >
              <PersonaScreenRow screen={screen} priority={index === 0} />
            </SpringReveal>
          ))}
        </div>
      </PageShell>
    </section>
  )
}

function PersonaChip() {
  const { persona } = personaSection
  return (
    <div className="mt-2 inline-flex max-w-fit items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] text-[0.7rem] font-semibold tracking-tight text-[var(--fg)]">
        {persona.initials}
      </span>
      <span className="flex flex-col items-start gap-0 leading-tight">
        <span className="text-sm font-medium text-[var(--fg)]">
          {persona.name}
        </span>
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          {persona.role}
        </span>
      </span>
    </div>
  )
}

function PersonaScreenRow({
  screen,
  priority,
}: {
  screen: PersonaScreen
  priority: boolean
}) {
  return (
    <div
      id={screen.id}
      className="flex flex-col gap-6 md:gap-10"
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          {screen.tag}
        </span>
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--fg)] md:text-3xl">
          {screen.headline}
        </h3>
        <p className="text-base leading-relaxed text-[var(--muted-foreground)]">
          {screen.body}
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_56px_-32px_rgba(0,0,0,0.45)]">
        <AppScreenshot
          src={screen.screenshot.src}
          alt={screen.screenshot.alt}
          width={screen.screenshot.width}
          height={screen.screenshot.height}
          sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1200px"
          priority={priority}
        />
      </div>
    </div>
  )
}
