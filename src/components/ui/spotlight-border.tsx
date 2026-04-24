"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type SpotlightBorderProps = React.HTMLAttributes<HTMLDivElement> & {
  radius?: number
  tint?: "accent" | "neutral"
}

export function SpotlightBorder({
  className,
  style,
  radius = 260,
  tint = "accent",
  children,
  ...props
}: SpotlightBorderProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)

  const handleMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty("--spot-x", `${e.clientX - rect.left}px`)
    node.style.setProperty("--spot-y", `${e.clientY - rect.top}px`)
    node.style.setProperty("--spot-opacity", "1")
  }, [])

  const handleLeave = React.useCallback(() => {
    const node = ref.current
    if (!node) return
    node.style.setProperty("--spot-opacity", "0")
  }, [])

  const color =
    tint === "accent"
      ? "color-mix(in oklab, var(--accent) 38%, transparent)"
      : "rgba(255, 255, 255, 0.14)"

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      data-slot="spotlight-border"
      className={cn("relative isolate", className)}
      style={{
        ...style,
        ["--spot-radius" as string]: `${radius}px`,
        ["--spot-color" as string]: color,
      }}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--spot-opacity,0)] transition-opacity duration-200"
        style={{
          background:
            "radial-gradient(var(--spot-radius) circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--spot-color), transparent 60%)",
        }}
      />
      {children}
    </div>
  )
}
