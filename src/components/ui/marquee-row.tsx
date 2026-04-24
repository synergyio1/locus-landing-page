import * as React from "react"

import { cn } from "@/lib/utils"

type MarqueeRowProps = {
  items: React.ReactNode[]
  duration?: number
  className?: string
  itemClassName?: string
}

export function MarqueeRow({
  items,
  duration = 38,
  className,
  itemClassName,
}: MarqueeRowProps) {
  const doubled = [...items, ...items]
  return (
    <div
      data-slot="marquee-row"
      className={cn(
        "group relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
    >
      <div
        className="flex w-max min-w-full shrink-0 items-center gap-12 pr-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animation: `marquee-x ${duration}s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className={cn(
              "inline-flex shrink-0 items-center gap-3 whitespace-nowrap",
              itemClassName
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
