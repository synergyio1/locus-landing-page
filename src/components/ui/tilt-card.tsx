"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type TiltCardProps = {
  max?: number
  glare?: boolean
  className?: string
  children: React.ReactNode
}

const SPRING = { stiffness: 140, damping: 18, mass: 0.6 }

export function TiltCard({ max = 6, glare = false, className, children }: TiltCardProps) {
  const reduced = useReducedMotion()
  const ref = React.useRef<HTMLDivElement | null>(null)

  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), SPRING)
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), SPRING)
  const glareX = useTransform(x, [0, 1], ["0%", "100%"])
  const glareY = useTransform(y, [0, 1], ["0%", "100%"])

  const handleMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced) return
      const node = ref.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      x.set((e.clientX - rect.left) / rect.width)
      y.set((e.clientY - rect.top) / rect.height)
    },
    [reduced, x, y]
  )

  const handleLeave = React.useCallback(() => {
    x.set(0.5)
    y.set(0.5)
  }, [x, y])

  if (reduced) {
    return <div className={cn("relative", className)}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1200,
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {glare ? (
        <motion.div
          aria-hidden
          style={{
            background: `radial-gradient(320px circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.12), transparent 55%)`,
          }}
          className="pointer-events-none absolute inset-0 mix-blend-plus-lighter"
        />
      ) : null}
    </motion.div>
  )
}
