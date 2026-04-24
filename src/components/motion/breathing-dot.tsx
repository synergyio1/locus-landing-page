"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "./use-reduced-motion"

type BreathingDotProps = React.HTMLAttributes<HTMLSpanElement> & {
  color?: string
  size?: number
  label?: string
}

export function BreathingDot({
  color = "var(--alive)",
  size = 8,
  label,
  className,
  style,
  ...props
}: BreathingDotProps) {
  const reduced = useReducedMotion()

  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      data-slot="breathing-dot"
      data-reduced-motion={reduced ? "true" : "false"}
      className={cn("inline-block rounded-full align-middle", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 0 0 ${color}`,
        animation: reduced ? "none" : "breathe 2.4s ease-in-out infinite",
        ...style,
      }}
      {...props}
    />
  )
}
