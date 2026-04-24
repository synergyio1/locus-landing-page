"use client"

import * as React from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"

type DailyRunStackProps = {
  primary: React.ReactNode
  secondary: React.ReactNode
}

export function DailyRunStack({ primary, secondary }: DailyRunStackProps) {
  const reduced = useReducedMotion()
  const ref = React.useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  })

  const primaryScale = useTransform(scrollYProgress, [0.35, 0.85], [1, 0.94])
  const primaryOpacity = useTransform(scrollYProgress, [0.35, 0.75], [1, 0.55])
  const secondaryOpacity = useTransform(scrollYProgress, [0.25, 0.55], [0, 1])
  const secondaryY = useTransform(scrollYProgress, [0.25, 0.6], [36, 0])

  if (reduced) {
    return (
      <div ref={ref} className="flex flex-col gap-6">
        <div>{primary}</div>
        <div>{secondary}</div>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative flex flex-col gap-8">
      <motion.div
        style={{ scale: primaryScale, opacity: primaryOpacity }}
        className="will-change-transform"
      >
        {primary}
      </motion.div>
      <motion.div
        style={{ opacity: secondaryOpacity, y: secondaryY }}
        className="will-change-transform"
      >
        {secondary}
      </motion.div>
    </div>
  )
}
