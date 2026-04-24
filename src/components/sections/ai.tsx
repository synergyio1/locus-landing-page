"use client"

import * as React from "react"

import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { ai, type AiExampleState } from "@/content/ai"
import { cn } from "@/lib/utils"

const PILL_TONE: Record<AiExampleState, string> = {
  "on-track":
    "border-[color-mix(in_oklab,var(--alive)_55%,transparent)] bg-[color-mix(in_oklab,var(--alive)_14%,transparent)] text-[var(--alive)]",
  unknown:
    "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]",
  "off-track":
    "border-[color-mix(in_oklab,var(--warn)_55%,transparent)] bg-[color-mix(in_oklab,var(--warn)_14%,transparent)] text-[var(--warn)]",
}

export function Ai() {
  const [activeState, setActiveState] =
    React.useState<AiExampleState>("on-track")
  const active =
    ai.examples.find((e) => e.state === activeState) ?? ai.examples[0]

  return (
    <section
      id={ai.id}
      aria-labelledby="ai-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
          <SpringReveal className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              {ai.eyebrow}
            </span>
            <h2
              id="ai-heading"
              className="text-3xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-4xl"
            >
              {ai.headline}
            </h2>
            <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              {ai.body}
            </p>

            <div
              role="tablist"
              aria-label="Activity classification examples"
              className="mt-2 flex flex-wrap gap-2"
            >
              {ai.examples.map((e) => {
                const selected = e.state === activeState
                return (
                  <button
                    key={e.state}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveState(e.state)}
                    onFocus={() => setActiveState(e.state)}
                    onClick={() => setActiveState(e.state)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                      PILL_TONE[e.state],
                      selected ? "opacity-100" : "opacity-55 hover:opacity-100"
                    )}
                  >
                    {e.label}
                  </button>
                )
              })}
            </div>

            <div
              aria-live="polite"
              data-state={active.state}
              className="flex flex-col gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="font-mono text-sm text-[var(--fg)]">
                {active.example}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {active.description}
              </p>
            </div>
          </SpringReveal>

          <SpringReveal delay={120} className="relative">
            <AppScreenshot
              src={ai.screenshot.src}
              alt={ai.screenshot.alt}
              width={ai.screenshot.width}
              height={ai.screenshot.height}
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 58vw, 820px"
              className="rounded-lg border border-[var(--border)] shadow-2xl shadow-black/30"
            />
          </SpringReveal>
        </div>
      </PageShell>
    </section>
  )
}
