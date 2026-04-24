"use client"

import * as React from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"

import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { DeviceFrame } from "@/components/ui/device-frame"
import { ai, type AiExampleState } from "@/content/ai"
import { cn } from "@/lib/utils"

const PILL_TONE: Record<AiExampleState, string> = {
  "on-track": "text-[var(--alive)]",
  unknown: "text-[var(--muted-foreground)]",
  "off-track": "text-[var(--warn)]",
}

const PILL_BG: Record<AiExampleState, string> = {
  "on-track":
    "bg-[color-mix(in_oklab,var(--alive)_16%,transparent)] ring-[color-mix(in_oklab,var(--alive)_45%,transparent)]",
  unknown:
    "bg-[var(--surface-raised)] ring-[var(--border)]",
  "off-track":
    "bg-[color-mix(in_oklab,var(--warn)_16%,transparent)] ring-[color-mix(in_oklab,var(--warn)_45%,transparent)]",
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
      <PageShell className="py-20 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-16">
          <SpringReveal className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {ai.eyebrow}
            </span>
            <h2
              id="ai-heading"
              className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
            >
              {ai.headline}
            </h2>
            <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              {ai.body}
            </p>

            <LayoutGroup id="ai-pill-group">
              <div
                role="tablist"
                aria-label="Activity classification examples"
                className="mt-3 flex flex-wrap gap-2"
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
                        "relative rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                        selected
                          ? PILL_TONE[e.state]
                          : "text-[var(--muted-foreground)] hover:text-[var(--fg)]"
                      )}
                    >
                      {selected ? (
                        <motion.span
                          layoutId="ai-pill"
                          transition={{
                            type: "spring",
                            stiffness: 360,
                            damping: 28,
                          }}
                          className={cn(
                            "absolute inset-0 rounded-full ring-1",
                            PILL_BG[e.state]
                          )}
                        />
                      ) : null}
                      <span className="relative">{e.label}</span>
                    </button>
                  )
                })}
              </div>
            </LayoutGroup>

            <div
              aria-live="polite"
              className="relative mt-2 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.state}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, position: "absolute" }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-1.5"
                >
                  <p
                    className={cn(
                      "font-mono text-sm",
                      PILL_TONE[active.state]
                    )}
                  >
                    <span className="text-[var(--muted-foreground)]">$ </span>
                    {active.example}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {active.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </SpringReveal>

          <SpringReveal delay={140} className="relative">
            <DeviceFrame>
              <AppScreenshot
                src={ai.screenshot.src}
                alt={ai.screenshot.alt}
                width={ai.screenshot.width}
                height={ai.screenshot.height}
                sizes="(max-width: 768px) 100vw, (max-width: 1400px) 52vw, 760px"
              />
            </DeviceFrame>
          </SpringReveal>
        </div>
      </PageShell>
    </section>
  )
}
