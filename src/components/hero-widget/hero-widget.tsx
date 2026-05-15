"use client"

import * as React from "react"

import { useReducedMotion } from "@/components/motion"
import { heroWidget } from "@/content/heroWidget"

import { CommandWindow } from "./command-window"
import { MacFrame } from "./mac-frame"
import { ModeDock } from "./mode-dock"
import { useAutoCycle } from "./use-auto-cycle"

const ID_BASE = "hero-widget"

export function HeroWidget() {
  const reduced = useReducedMotion()
  const [paused, setPaused] = React.useState(false)

  const { activeIndex, setActiveIndex } = useAutoCycle({
    length: heroWidget.modes.length,
    intervalMs: heroWidget.cycleIntervalMs,
    paused,
    reduced,
  })

  const activeMode = heroWidget.modes[activeIndex]

  const handlePause = React.useCallback(() => setPaused(true), [])
  const handleResume = React.useCallback(() => setPaused(false), [])

  return (
    <div
      data-slot="hero-widget"
      data-testid="hero-widget"
      aria-roledescription="Interactive product demo"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
      className="relative mx-auto w-full"
    >
      {/* Cobalt halo, anti-purple — subtle, behind the frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 60%, color-mix(in oklab, var(--accent) 26%, transparent) 0%, color-mix(in oklab, var(--accent) 8%, transparent) 40%, transparent 75%)",
          filter: "blur(60px)",
          transform: "translate3d(0, 6%, 0) scale(1.05)",
        }}
      />

      <MacFrame className="px-3 pt-3 pb-14 md:px-6 md:pt-6 md:pb-20">
        <div
          role="tabpanel"
          id={`${ID_BASE}-panel-${activeMode.id}`}
          aria-labelledby={`${ID_BASE}-tab-${activeMode.id}`}
          className="px-1 pt-3 md:px-2 md:pt-4"
        >
          <CommandWindow mode={activeMode} />
        </div>

        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-3 md:bottom-5 md:px-6">
          <ModeDock
            modes={heroWidget.modes}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
            idBase={ID_BASE}
          />
        </div>
      </MacFrame>

      <p
        aria-live="polite"
        className="sr-only"
      >
        {activeMode.label}: {activeMode.hint}
      </p>
    </div>
  )
}
