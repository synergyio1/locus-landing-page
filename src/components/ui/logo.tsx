import * as React from "react"

import {
  LOCUS_MARK_PATH,
  LOCUS_MARK_PATH_SMALL,
  LOCUS_MARK_VIEWBOX,
} from "@/lib/locus-mark"
import { cn } from "@/lib/utils"

type LogoProps = Omit<React.SVGAttributes<SVGSVGElement>, "width" | "height"> & {
  size?: number
  variant?: "cobalt" | "monotone"
  title?: string
}

/**
 * The Locus mark: a solid disc (the locus) with one tapered slot carved out of it —
 * a hairline that swells into a compounding curve as it leaves the circle.
 * Drawn as ONE closed path (no mask), so it renders identically in the browser,
 * in `next/og`, and in any SVG tool. Source of truth: `public/brand/locus/build_mark.py`.
 *
 * Optical sizing: at ≤ 32px the slot would collapse in the raster, so we swap to a
 * variant with a slightly wider slot (same silhouette, tuned for nav/footer sizes).
 */
const OPTICAL_SMALL_MAX = 32
export function Logo({
  size = 22,
  variant = "cobalt",
  title,
  className,
  ...props
}: LogoProps) {
  const color = variant === "cobalt" ? "var(--accent)" : "currentColor"
  const labelled = Boolean(title)
  const d = size <= OPTICAL_SMALL_MAX ? LOCUS_MARK_PATH_SMALL : LOCUS_MARK_PATH
  return (
    <svg
      width={size}
      height={size}
      viewBox={LOCUS_MARK_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      role={labelled ? "img" : "presentation"}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      data-slot="logo"
      className={cn("shrink-0", className)}
      {...props}
    >
      {labelled ? <title>{title}</title> : null}
      <path d={d} fill={color} />
    </svg>
  )
}
