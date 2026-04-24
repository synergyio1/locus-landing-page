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
      <circle
        cx="512"
        cy="512"
        r="401"
        stroke={color}
        strokeWidth="34"
        fill="none"
        opacity="0.22"
      />
      <circle
        cx="512"
        cy="512"
        r="290"
        stroke={color}
        strokeWidth="60"
        fill="none"
        opacity="0.55"
      />
      <circle
        cx="512"
        cy="512"
        r="170"
        stroke={color}
        strokeWidth="85"
        fill="none"
      />
      <circle cx="512" cy="512" r="60" fill={color} />
    </svg>
  )
}
