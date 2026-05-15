"use client"

import { MacFrame } from "./mac-frame"

export function HeroWidget() {
  return (
    <div
      data-slot="hero-widget"
      data-testid="hero-widget"
      aria-roledescription="Interactive product demo"
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

      <MacFrame>
        <div
          className="flex w-full items-center justify-center"
          style={{ aspectRatio: "16 / 10" }}
        >
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Preview
            </span>
            <span className="text-base text-[var(--fg)] md:text-lg">
              Screenshot coming soon
            </span>
          </div>
        </div>
      </MacFrame>
    </div>
  )
}
