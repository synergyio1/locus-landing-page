"use client"

import * as React from "react"
import posthog from "posthog-js"

const enabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)

/**
 * Fires `section_viewed` { section } once per page load when a section crosses
 * the middle band of the viewport. The band (rather than an intersection
 * ratio) makes this work for sections taller than the viewport — the
 * manifesto would never reach a 50% ratio of itself.
 */
export function SectionTracking({ sectionIds }: { sectionIds: string[] }) {
  React.useEffect(() => {
    if (!enabled) return

    const seen = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = (entry.target as HTMLElement).id
          if (seen.has(id)) continue
          seen.add(id)
          posthog.capture("section_viewed", { section: id })
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [sectionIds])

  return null
}

const DEPTH_MARKS = [25, 50, 75, 100] as const

/**
 * Fires `section_read_depth` { section, depth } once per mark as the reader
 * scrolls through the target section — "are they actually reading the
 * manifesto" as data. Depth is how much of the section has passed the bottom
 * of the viewport; 100 means its end came into view.
 */
export function ReadDepthTracking({ targetId }: { targetId: string }) {
  React.useEffect(() => {
    if (!enabled) return
    const el = document.getElementById(targetId)
    if (!el) return

    const fired = new Set<number>()
    let scheduled = false

    function measure() {
      scheduled = false
      const rect = el!.getBoundingClientRect()
      if (rect.height === 0) return
      const progress =
        Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height)) *
        100
      for (const mark of DEPTH_MARKS) {
        if (progress >= mark && !fired.has(mark)) {
          fired.add(mark)
          posthog.capture("section_read_depth", {
            section: targetId,
            depth: mark,
          })
        }
      }
      if (fired.size === DEPTH_MARKS.length) {
        window.removeEventListener("scroll", onScroll)
      }
    }

    function onScroll() {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(measure)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    measure()
    return () => window.removeEventListener("scroll", onScroll)
  }, [targetId])

  return null
}
