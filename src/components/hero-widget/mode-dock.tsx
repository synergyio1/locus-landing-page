"use client"

import * as React from "react"
import { LayoutGroup, motion } from "motion/react"

import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import type { HeroWidgetMode } from "@/content/heroWidget"

type ModeDockProps = {
  modes: HeroWidgetMode[]
  activeIndex: number
  onChange: (next: number) => void
  /**
   * id prefix so the tabs can be `aria-controls` paired with panels.
   * Each tab id is `${idBase}-tab-${mode.id}`; the corresponding panel id
   * must be `${idBase}-panel-${mode.id}` (HeroWidget supplies the panel id).
   */
  idBase: string
}

export function ModeDock({ modes, activeIndex, onChange, idBase }: ModeDockProps) {
  const buttonsRef = React.useRef<Array<HTMLButtonElement | null>>([])

  const focusTab = React.useCallback((nextIndex: number) => {
    const node = buttonsRef.current[nextIndex]
    if (node) {
      node.focus()
    }
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = modes.length - 1
    if (event.key === "ArrowRight") {
      event.preventDefault()
      const next = activeIndex === last ? 0 : activeIndex + 1
      onChange(next)
      focusTab(next)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      const next = activeIndex === 0 ? last : activeIndex - 1
      onChange(next)
      focusTab(next)
    } else if (event.key === "Home") {
      event.preventDefault()
      onChange(0)
      focusTab(0)
    } else if (event.key === "End") {
      event.preventDefault()
      onChange(last)
      focusTab(last)
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Locus widget modes"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className="flex items-center justify-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_82%,#000_18%)]/95 p-1.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
    >
      <LayoutGroup id={`${idBase}-dock`}>
        {modes.map((mode, index) => {
          const isActive = activeIndex === index
          return (
            <button
              key={mode.id}
              ref={(node) => {
                buttonsRef.current[index] = node
              }}
              type="button"
              role="tab"
              id={`${idBase}-tab-${mode.id}`}
              aria-selected={isActive}
              aria-controls={`${idBase}-panel-${mode.id}`}
              aria-label={`${mode.label} — ${mode.hint}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(index)}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                isActive
                  ? "text-[var(--fg)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--fg)]"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId={`${idBase}-active-pill`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  aria-hidden
                  className="absolute inset-0 rounded-xl border border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[var(--accent-subtle)]"
                />
              ) : null}

              <span
                aria-hidden
                className={cn(
                  "relative grid h-7 w-7 place-items-center rounded-md border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_70%,#000_30%)] transition-colors",
                  isActive &&
                    "border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[var(--accent-subtle)] text-[var(--accent-text)]"
                )}
              >
                <Icon name={mode.icon} size={14} />
              </span>

              <span className="relative hidden font-medium md:inline">
                {mode.label}
              </span>
            </button>
          )
        })}
      </LayoutGroup>
    </div>
  )
}
