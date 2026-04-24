"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type MagneticButtonProps = {
  href?: string
  radius?: number
  strength?: number
  className?: string
  children: React.ReactNode
  "aria-label"?: string
}

const SPRING = { stiffness: 220, damping: 20, mass: 0.5 }

export function MagneticButton({
  href,
  radius = 90,
  strength = 0.35,
  className,
  children,
  ...rest
}: MagneticButtonProps) {
  const reduced = useReducedMotion()
  const ref = React.useRef<HTMLSpanElement | null>(null)

  const tx = useSpring(useMotionValue(0), SPRING)
  const ty = useSpring(useMotionValue(0), SPRING)

  const handleMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (reduced) return
      const node = ref.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist > radius) {
        tx.set(0)
        ty.set(0)
        return
      }
      tx.set(dx * strength)
      ty.set(dy * strength)
    },
    [reduced, radius, strength, tx, ty]
  )

  const handleLeave = React.useCallback(() => {
    tx.set(0)
    ty.set(0)
  }, [tx, ty])

  const Wrapper: React.ElementType = href ? Link : "span"
  const wrapperProps = href ? { href } : {}

  return (
    <motion.span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={reduced ? undefined : { x: tx, y: ty }}
      className="inline-flex"
    >
      <Wrapper
        {...wrapperProps}
        {...rest}
        className={cn("inline-flex", className)}
      >
        {children}
      </Wrapper>
    </motion.span>
  )
}
