"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { SpringReveal } from "./spring-reveal"
import { useReducedMotion } from "./use-reduced-motion"

type StaggerGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  stagger?: number
  startDelay?: number
  duration?: number
}

export function StaggerGroup({
  stagger = 80,
  startDelay = 0,
  duration = 520,
  className,
  children,
  ...props
}: StaggerGroupProps) {
  const reduced = useReducedMotion()
  const items = React.Children.toArray(children)

  return (
    <div
      data-slot="stagger-group"
      data-reduced-motion={reduced ? "true" : "false"}
      className={cn(className)}
      {...props}
    >
      {items.map((child, index) => (
        <SpringReveal
          key={index}
          delay={reduced ? 0 : startDelay + index * stagger}
          duration={duration}
        >
          {child}
        </SpringReveal>
      ))}
    </div>
  )
}
