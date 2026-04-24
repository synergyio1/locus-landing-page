"use client"

import * as React from "react"
import Image from "next/image"
import { LayoutGroup, motion } from "motion/react"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import {
  featureTour,
  type FeatureTourTabId,
} from "@/content/featureTour"
import { cn } from "@/lib/utils"

const PILL_STYLE: React.CSSProperties = {
  borderColor: "color-mix(in oklab, var(--accent) 45%, transparent)",
  backgroundColor: "color-mix(in oklab, var(--accent) 6%, transparent)",
  boxShadow:
    "inset 0 1px 0 color-mix(in oklab, var(--accent) 35%, transparent)",
}

const PILL_STYLE_MOBILE: React.CSSProperties = {
  borderColor: "color-mix(in oklab, var(--accent) 45%, transparent)",
  backgroundColor: "color-mix(in oklab, var(--accent) 6%, transparent)",
}

const TAB_SPRING = { type: "spring" as const, stiffness: 380, damping: 32 }

export function FeatureTour() {
  const [active, setActive] = React.useState<FeatureTourTabId>("plan")
  const tablistRef = React.useRef<HTMLDivElement | null>(null)

  const tabs = featureTour.tabs

  function focusTab(id: FeatureTourTabId) {
    const node = tablistRef.current?.querySelector<HTMLButtonElement>(
      `[data-tab-id="${id}"]`
    )
    node?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const idx = tabs.findIndex((t) => t.id === active)
    if (idx < 0) return

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight": {
        event.preventDefault()
        const next = tabs[(idx + 1) % tabs.length]
        setActive(next.id)
        focusTab(next.id)
        break
      }
      case "ArrowUp":
      case "ArrowLeft": {
        event.preventDefault()
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length]
        setActive(prev.id)
        focusTab(prev.id)
        break
      }
      case "Home": {
        event.preventDefault()
        setActive(tabs[0].id)
        focusTab(tabs[0].id)
        break
      }
      case "End": {
        event.preventDefault()
        const last = tabs[tabs.length - 1]
        setActive(last.id)
        focusTab(last.id)
        break
      }
    }
  }

  return (
    <section
      id={featureTour.id}
      aria-labelledby="feature-tour-heading"
      className="relative border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-32">
        <div className="grid items-start gap-12 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:gap-16">
          <SpringReveal className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {featureTour.eyebrow}
            </span>
            <h2
              id="feature-tour-heading"
              className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
            >
              {featureTour.headline}
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              {featureTour.body}
            </p>

            <LayoutGroup id="feature-tour">
              <div
                ref={tablistRef}
                role="tablist"
                aria-label="Feature tour"
                aria-orientation="vertical"
                onKeyDown={onKeyDown}
                className="mt-2 hidden flex-col gap-2 md:flex"
              >
                {tabs.map((tab) => {
                  const selected = tab.id === active
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      data-tab-id={tab.id}
                      id={`feature-tour-tab-${tab.id}`}
                      aria-selected={selected}
                      aria-controls={`feature-tour-panel-${tab.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActive(tab.id)}
                      className={cn(
                        "relative w-full rounded-xl p-5 text-left transition-colors",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                        !selected && "hover:bg-[var(--surface-raised)]/40"
                      )}
                    >
                      {selected ? (
                        <motion.span
                          aria-hidden
                          layoutId="feature-tour-pill"
                          transition={TAB_SPRING}
                          style={PILL_STYLE}
                          className="absolute inset-0 -z-10 rounded-xl border"
                        />
                      ) : null}
                      <span className="relative block font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                        {tab.step}
                      </span>
                      <span className="relative mt-2 block text-lg font-medium leading-snug tracking-tight text-[var(--fg)]">
                        {tab.label}
                      </span>
                      <span className="relative mt-2 block text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {tab.description}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div
                role="tablist"
                aria-label="Feature tour"
                aria-orientation="horizontal"
                className="-mx-6 mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto px-6 pb-2 md:hidden"
              >
                {tabs.map((tab) => {
                  const selected = tab.id === active
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`feature-tour-panel-${tab.id}`}
                      onClick={() => setActive(tab.id)}
                      className={cn(
                        "relative shrink-0 snap-start rounded-full px-4 py-2 text-sm transition-colors",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                        selected
                          ? "text-[var(--fg)]"
                          : "text-[var(--muted-foreground)] hover:text-[var(--fg)]"
                      )}
                    >
                      {selected ? (
                        <motion.span
                          aria-hidden
                          layoutId="feature-tour-pill-mobile"
                          transition={TAB_SPRING}
                          style={PILL_STYLE_MOBILE}
                          className="absolute inset-0 rounded-full border"
                        />
                      ) : null}
                      <span className="relative">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </LayoutGroup>
          </SpringReveal>

          <SpringReveal delay={120} className="relative">
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
                "relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--border)]",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_60px_120px_-36px_rgba(4,10,16,0.85),0_18px_48px_-24px_rgba(74,143,232,0.22)]"
              )}
            >
              {tabs.map((tab) => {
                const selected = tab.id === active
                return (
                  <motion.div
                    key={tab.id}
                    role="tabpanel"
                    id={`feature-tour-panel-${tab.id}`}
                    aria-labelledby={`feature-tour-tab-${tab.id}`}
                    aria-hidden={!selected}
                    initial={false}
                    animate={{
                      opacity: selected ? 1 : 0,
                      scale: selected ? 1 : 1.015,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      "absolute inset-0",
                      !selected && "pointer-events-none"
                    )}
                  >
                    <Image
                      src={tab.screenshot.src}
                      alt={tab.screenshot.alt}
                      fill
                      quality={90}
                      priority={tab.id === "plan"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 58vw, 800px"
                      className="select-none object-cover"
                    />
                  </motion.div>
                )
              })}
            </div>
          </SpringReveal>
        </div>
      </PageShell>
    </section>
  )
}
