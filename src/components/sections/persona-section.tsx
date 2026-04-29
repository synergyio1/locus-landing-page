"use client"

import * as React from "react"
import { LayoutGroup, motion } from "motion/react"

import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import {
  personaSection,
  type PersonaTab,
  type PersonaTabId,
} from "@/content/personaSection"
import { cn } from "@/lib/utils"

/**
 * PERSONAS-02 — tabbed "Locus in your work" section. The hero stays
 * cross-audience; this section invites visitors to switch tabs and see
 * Locus rendered against a designer's / developer's / founder's / PM's
 * working life. Layout handles 1 → 4 tabs cleanly so the section ships
 * with one tab at v1 and grows as PERSONAS-03/04 land.
 */
export function PersonaSection() {
  const [activeId, setActiveId] = React.useState<PersonaTabId>(
    personaSection.defaultTab
  )
  const active =
    personaSection.tabs.find((t) => t.id === activeId) ?? personaSection.tabs[0]

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
        </SpringReveal>

        <SpringReveal delay={80} className="mt-10">
          <PersonaTablist
            tabs={personaSection.tabs}
            activeId={active.id}
            onChange={setActiveId}
          />
        </SpringReveal>

        <SpringReveal delay={140} className="mt-12">
          <PersonaPanel tab={active} />
        </SpringReveal>
      </PageShell>
    </section>
  )
}

function PersonaTablist({
  tabs,
  activeId,
  onChange,
}: {
  tabs: PersonaTab[]
  activeId: PersonaTabId
  onChange: (id: PersonaTabId) => void
}) {
  return (
    <LayoutGroup id="persona-tabs">
      <div
        role="tablist"
        aria-label="Personas"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab) => {
          const active = tab.id === activeId
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`persona-panel-${tab.id}`}
              id={`persona-tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                active
                  ? "text-[var(--fg)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--fg)]"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="persona-tab-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full border border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[var(--accent-subtle)]"
                />
              ) : null}
              <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] text-[0.7rem] font-semibold tracking-tight text-[var(--fg)]">
                {tab.initials}
              </span>
              <span className="relative flex flex-col items-start gap-0 leading-tight">
                <span className="font-medium">{tab.name}</span>
                <span className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {tab.role}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

function PersonaPanel({ tab }: { tab: PersonaTab }) {
  return (
    <div
      role="tabpanel"
      id={`persona-panel-${tab.id}`}
      aria-labelledby={`persona-tab-${tab.id}`}
      className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
    >
      <PersonaShot
        screenshot={tab.anchor}
        priority
        cropAspect="16/10"
        emphasis
      />
      <div className="flex flex-col gap-6">
        <PersonaShot
          screenshot={tab.supporting}
          cropAspect="16/10"
        />
        <PersonaCallout tab={tab} />
      </div>
    </div>
  )
}

function PersonaShot({
  screenshot,
  cropAspect,
  emphasis = false,
  priority = false,
}: {
  screenshot: PersonaTab["anchor"]
  cropAspect?: string
  emphasis?: boolean
  priority?: boolean
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_56px_-32px_rgba(0,0,0,0.45)]",
        emphasis && "lg:row-span-2"
      )}
    >
      <AppScreenshot
        src={screenshot.src}
        alt={screenshot.alt}
        width={screenshot.width}
        height={screenshot.height}
        sizes="(max-width: 768px) 100vw, (max-width: 1400px) 60vw, 720px"
        priority={priority}
        cropAspect={cropAspect}
        cropPosition="top"
      />
    </div>
  )
}

function PersonaCallout({ tab }: { tab: PersonaTab }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-sm leading-relaxed text-[var(--fg)]">{tab.blurb}</p>
      <ul className="flex flex-wrap gap-2">
        {tab.tools.map((tool) => (
          <li
            key={tool}
            className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)]"
          >
            {tool}
          </li>
        ))}
      </ul>
    </div>
  )
}
