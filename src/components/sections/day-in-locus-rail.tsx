"use client"

import * as React from "react"
import { motion } from "motion/react"

import { useReducedMotion } from "@/components/motion"
import { cn } from "@/lib/utils"

export type RailStage = { id: string; time: string; label: string }

type Transition =
  | { duration: 0 }
  | { type: "spring"; stiffness: number; damping: number }

export function StageRail({ stages }: { stages: readonly RailStage[] }) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const reduced = useReducedMotion()

  React.useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return
    const elements = stages
      .map((s) => document.getElementById(`stage-${s.id}`))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting)
        if (intersecting.length === 0) return
        const topmost = intersecting.reduce((best, current) =>
          current.boundingClientRect.top < best.boundingClientRect.top ? current : best
        )
        const index = stages.findIndex((s) => `stage-${s.id}` === topmost.target.id)
        if (index >= 0) setActiveIndex(index)
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [stages])

  const transition: Transition = reduced
    ? { duration: 0 }
    : { type: "spring", stiffness: 320, damping: 26 }

  return (
    <nav
      aria-label="A day in Locus — jump to stage"
      className="sticky top-24 hidden self-start lg:block"
    >
      <span className="mb-4 block font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        The day
      </span>
      <ol className="flex flex-col">
        {stages.map((stage, i) => {
          const isActive = i === activeIndex
          const isPassed = i < activeIndex
          const isLast = i === stages.length - 1
          return (
            <li key={stage.id} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <motion.span
                  aria-hidden
                  className={cn(
                    "mt-[6px] size-[13px] shrink-0 rounded-full border transition-colors",
                    isActive
                      ? "border-[var(--accent)] bg-[var(--accent)]"
                      : isPassed
                        ? "border-[color-mix(in_oklab,var(--accent)_70%,transparent)] bg-[color-mix(in_oklab,var(--accent)_70%,transparent)]"
                        : "border-[var(--border)] bg-[var(--bg)]"
                  )}
                  initial={false}
                  animate={{ scale: isActive ? 1.18 : 1 }}
                  transition={transition}
                />
                {!isLast && (
                  <div className="relative mt-1 min-h-[52px] w-px flex-1 bg-[var(--border)]">
                    <motion.span
                      aria-hidden
                      className="absolute inset-x-0 top-0 bottom-0 origin-top bg-[var(--accent)]"
                      initial={false}
                      animate={{ scaleY: isPassed ? 1 : 0 }}
                      transition={transition}
                    />
                  </div>
                )}
              </div>
              <a
                href={`#stage-${stage.id}`}
                className={cn(
                  "group -ml-1 flex flex-col gap-0.5 rounded-md px-1 pb-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-text)]",
                  isLast && "pb-0"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[0.68rem] uppercase tracking-[0.22em] transition-colors",
                    isActive
                      ? "text-[var(--accent-text)]"
                      : "text-[var(--muted-foreground)]"
                  )}
                >
                  {stage.time}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-[var(--fg)]"
                      : "text-[var(--muted-foreground)] group-hover:text-[var(--fg)]"
                  )}
                >
                  {stage.label}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
