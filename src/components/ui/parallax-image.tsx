"use client"

import * as React from "react"
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type ParallaxImageProps = {
  offset?: number
  direction?: 1 | -1
  className?: string
  children: React.ReactNode
}

export function ParallaxImage({
  offset = 32,
  direction = 1,
  className,
  children,
}: ParallaxImageProps) {
  const reduced = useReducedMotion()
  const ref = React.useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [offset * direction, -offset * direction]),
    { stiffness: 120, damping: 24, mass: 0.6 }
  )

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
    </motion.div>
  )
}
