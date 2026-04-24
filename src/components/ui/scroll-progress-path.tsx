"use client"

import * as React from "react"
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react"

export function ScrollProgressPath() {
  const reduced = useReducedMotion()
  const [mounted, setMounted] = React.useState(false)
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.4 })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || reduced) return null

  return (
    <motion.div
      aria-hidden
      data-slot="scroll-progress"
      style={{ scaleY, transformOrigin: "0% 0%" }}
      className="pointer-events-none fixed left-0 top-0 z-40 h-screen w-px bg-gradient-to-b from-[var(--accent)] via-[color-mix(in_oklab,var(--accent)_60%,transparent)] to-transparent"
    />
  )
}
