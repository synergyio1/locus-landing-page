"use client"

import * as React from "react"

import { useReducedMotion } from "@/components/motion/use-reduced-motion"
import { cn } from "@/lib/utils"

type RotatingWordProps = {
  /** Phrases to cycle through; the first is the resting state. */
  words: readonly string[]
  /** Time each phrase holds, in ms. */
  interval?: number
  className?: string
}

const SWAP_MS = 260

/**
 * Cycles a phrase in place. Every phrase is rendered invisibly in the same
 * grid cell so the box is always as tall/wide as the longest one — swapping
 * words never reflows the copy below. Screen readers get the resting phrase
 * only; the rotation is decorative. Under reduced motion it renders static.
 */
export function RotatingWord({
  words,
  interval = 2400,
  className,
}: RotatingWordProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = React.useState(0)
  const [leaving, setLeaving] = React.useState(false)

  React.useEffect(() => {
    if (reduced || words.length < 2) return
    let swap: number | undefined
    const tick = window.setInterval(() => {
      setLeaving(true)
      swap = window.setTimeout(() => {
        setIndex((i) => (i + 1) % words.length)
        setLeaving(false)
      }, SWAP_MS)
    }, interval)
    return () => {
      window.clearInterval(tick)
      if (swap !== undefined) window.clearTimeout(swap)
    }
  }, [reduced, words.length, interval])

  const current = reduced ? words[0] : words[index]

  return (
    <span className={cn("inline-grid", className)}>
      <span className="sr-only">{words[0]}</span>
      {words.map((word) => (
        <span
          key={word}
          aria-hidden
          className="invisible col-start-1 row-start-1"
        >
          {word}
        </span>
      ))}
      <span
        aria-hidden
        data-slot="rotating-word"
        className={cn(
          "col-start-1 row-start-1 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
          leaving && !reduced
            ? "-translate-y-1 opacity-0"
            : "translate-y-0 opacity-100"
        )}
      >
        {current}
      </span>
    </span>
  )
}
