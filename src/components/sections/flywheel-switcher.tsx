"use client"

import * as React from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"

import { ClipSurface } from "@/components/media/clip-frame"
import { useReducedMotion } from "@/components/motion"
import { DeviceFrame } from "@/components/ui/device-frame"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import type { FlywheelClip } from "@/content/flywheel"

type FlywheelSwitcherProps = {
  /** id prefix pairing each tab (`${idBase}-tab-${id}`) with its panel (`${idBase}-panel-${id}`). */
  idBase: string
  /** Accessible name for the tablist, e.g. "Capture surfaces". */
  label: string
  clips: FlywheelClip[]
}

/**
 * The Raycast-pattern clip switcher: one framed clip placeholder, a dock of
 * toggles beneath it, and a one-line caption for whichever screen is up.
 * Dock interaction mirrors the hero widget's ModeDock (roving tabindex,
 * arrow keys, layoutId pill).
 */
export function FlywheelSwitcher({ idBase, label, clips }: FlywheelSwitcherProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const reduced = useReducedMotion()
  const buttonsRef = React.useRef<Array<HTMLButtonElement | null>>([])
  const active = clips[activeIndex]

  const focusTab = React.useCallback((nextIndex: number) => {
    buttonsRef.current[nextIndex]?.focus()
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = clips.length - 1
    if (event.key === "ArrowRight") {
      event.preventDefault()
      const next = activeIndex === last ? 0 : activeIndex + 1
      setActiveIndex(next)
      focusTab(next)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      const next = activeIndex === 0 ? last : activeIndex - 1
      setActiveIndex(next)
      focusTab(next)
    } else if (event.key === "Home") {
      event.preventDefault()
      setActiveIndex(0)
      focusTab(0)
    } else if (event.key === "End") {
      event.preventDefault()
      setActiveIndex(last)
      focusTab(last)
    }
  }

  const caption = (
    <>
      <span className="font-medium text-[var(--fg)]">{active.caption.lead}</span>{" "}
      {active.caption.rest}
    </>
  )

  return (
    <div className="flex flex-col items-center gap-6">
      <DeviceFrame className="w-full bg-[var(--surface)]">
        <div className="relative aspect-[16/10] w-full">
          {clips.map((clip, index) => {
            const isActive = index === activeIndex
            return (
              <div
                key={clip.id}
                role="tabpanel"
                id={`${idBase}-panel-${clip.id}`}
                aria-labelledby={`${idBase}-tab-${clip.id}`}
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                )}
              >
                <ClipSurface
                  label={clip.label}
                  alt={clip.alt}
                  poster={clip.poster}
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
            )
          })}
        </div>
      </DeviceFrame>

      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className="flex items-center justify-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_82%,#000_18%)]/95 p-1.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
      >
        <LayoutGroup id={`${idBase}-dock`}>
          {clips.map((clip, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={clip.id}
                ref={(node) => {
                  buttonsRef.current[index] = node
                }}
                type="button"
                role="tab"
                id={`${idBase}-tab-${clip.id}`}
                aria-selected={isActive}
                aria-controls={`${idBase}-panel-${clip.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveIndex(index)}
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
                  <Icon name={clip.icon} size={14} />
                </span>

                <span className="relative font-medium">{clip.label}</span>
              </button>
            )
          })}
        </LayoutGroup>
      </div>

      <div className="flex min-h-14 w-full items-start justify-center">
        {reduced ? (
          <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
            {caption}
          </p>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-xl text-center text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base"
            >
              {caption}
            </motion.p>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
