"use client"

import * as React from "react"

import { useReducedMotion } from "@/components/motion/use-reduced-motion"
import { cn } from "@/lib/utils"

export type ManifestoTocItem = { id: string; label: string }

/**
 * A heading counts as reached once it crosses this line of the viewport
 * (fraction of its height from the top) — high enough that the highlight
 * lands while the section is what you're actually reading.
 */
const SPY_LINE = 0.35

/**
 * The letter's mini table of contents, for the sticky rail beside it. Shows
 * the reader the shape and end of the letter before they commit; scroll-spy
 * keeps the line they're in lit, and each row jumps to its heading.
 */
export function ManifestoToc({
  items,
  className,
}: {
  items: ManifestoTocItem[]
  className?: string
}) {
  const reduced = useReducedMotion()
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * SPY_LINE
      let current: string | null = null
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= line) current = item.id
      }
      setActiveId(current)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [items])

  return (
    <nav
      aria-label="In this letter"
      data-slot="manifesto-toc"
      className={cn("flex flex-col gap-3", className)}
    >
      <span
        aria-hidden
        className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]"
      >
        In this letter
      </span>
      <ol className="flex flex-col gap-2">
        {items.map((item, i) => {
          const active = item.id === activeId
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "true" : undefined}
                onClick={(event) => {
                  const el = document.getElementById(item.id)
                  if (!el) return
                  event.preventDefault()
                  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
                  history.replaceState(null, "", `#${item.id}`)
                }}
                className={cn(
                  "group grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 rounded-sm text-[13px] leading-snug",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "font-mono text-[10px] tracking-[0.18em] transition-colors duration-200",
                    active
                      ? "text-[var(--accent-text)]"
                      : "text-[color-mix(in_oklab,var(--muted-foreground)_70%,transparent)]"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "transition-colors duration-200",
                    active
                      ? "font-medium text-[var(--fg)]"
                      : "text-[var(--muted-foreground)] group-hover:text-[var(--fg)]"
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
