import * as React from "react"

import { cn } from "@/lib/utils"

type LogoProps = Omit<React.SVGAttributes<SVGSVGElement>, "width" | "height"> & {
  size?: number
  variant?: "cobalt" | "monotone"
  title?: string
}

export function Logo({
  size = 20,
  variant = "cobalt",
  title,
  className,
  ...props
}: LogoProps) {
  const color = variant === "cobalt" ? "var(--accent)" : "currentColor"
  const labelled = Boolean(title)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      role={labelled ? "img" : "presentation"}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      data-slot="logo"
      className={cn("shrink-0", className)}
      {...props}
    >
      {labelled ? <title>{title}</title> : null}
      {/* Nested-arch "portal" mark — distilled from the app icon; the core dot is the locus. */}
      <g stroke={color} strokeLinecap="round" fill="none">
        <path
          d="M182 800 L182 480 A330 330 0 0 1 842 480 L842 800"
          strokeWidth="42"
          opacity="0.22"
          fill="none"
        />
        <path
          d="M297 800 L297 480 A215 215 0 0 1 727 480 L727 800"
          strokeWidth="52"
          opacity="0.55"
          fill="none"
        />
        <path
          d="M412 800 L412 480 A100 100 0 0 1 612 480 L612 800"
          strokeWidth="64"
          fill="none"
        />
      </g>
      <circle cx="512" cy="646" r="50" fill={color} />
    </svg>
  )
}
