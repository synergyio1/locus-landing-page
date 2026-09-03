"use client"

import * as React from "react"

import { useReducedMotion } from "@/components/motion/use-reduced-motion"
import { cn } from "@/lib/utils"

type InkUnderlineProps = {
  children: React.ReactNode
  className?: string
}

/** Hold after the phrase is in view before the pen touches the paper. */
const BASE_DELAY_MS = 500
/** When several phrases come into view together, start the next stroke this
 *  far after the previous one — sequential, like underlining as you read. */
const STAGGER_MS = 520

// One queue for the page: the moment the last scheduled stroke may be
// followed by another. Client-only state, touched from effects.
let queueUntil = 0

/**
 * A pen-stroke underline that draws itself in — left to right, continuing
 * across line wraps — the first time the phrase scrolls into view.
 *
 * Not wired anywhere since 2026-09-02: the manifesto stopped drawing its
 * ==marks== (Luis: "don't think they are cool"). Kept, with `.ink-underline`
 * in globals.css, in case the treatment comes back — delete both otherwise.
 *
 * The stroke is the element's own background: one gradient laid over the
 * *unbroken* inline box (box-decoration-break: slice, the default), whose
 * width animates 0 → 100%. Because the image is sized against the unbroken
 * box, line one fills before line two starts. Under reduced motion it renders
 * fully drawn. Semantically it's stress emphasis, so `<em>` (un-italicised).
 */
export function InkUnderline({ children, className }: InkUnderlineProps) {
  const reduced = useReducedMotion()
  const ref = React.useRef<HTMLElement | null>(null)
  const [drawn, setDrawn] = React.useState(false)
  const [delay, setDelay] = React.useState(BASE_DELAY_MS)

  React.useEffect(() => {
    if (reduced) {
      setDrawn(true)
      return
    }
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") {
      setDrawn(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        const now = performance.now()
        const start = Math.max(now + BASE_DELAY_MS, queueUntil)
        queueUntil = start + STAGGER_MS
        setDelay(Math.round(start - now))
        setDrawn(true)
        observer.disconnect()
      },
      // Fully in view and clear of the bottom fifth of the viewport, so the
      // stroke lands on text the reader has actually reached.
      { threshold: 1, rootMargin: "0px 0px -20% 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <em
      ref={ref}
      data-slot="ink-underline"
      data-drawn={drawn ? "true" : "false"}
      className={cn("ink-underline not-italic text-[var(--fg)]", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </em>
  )
}
