import * as React from "react"

import { cn } from "@/lib/utils"

export type IconName =
  | "plan"
  | "focus"
  | "track"
  | "review"
  | "shield"
  | "sparkle"
  | "apple"
  | "moon"
  | "bolt"
  | "download"
  | "arrow-right"
  | "plus"

type IconProps = React.SVGAttributes<SVGSVGElement> & {
  name: IconName
  size?: number
}

export function Icon({ name, size = 16, className, ...props }: IconProps) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: size,
    height: size,
    "aria-hidden": true,
    className: cn("shrink-0", className),
    ...props,
  }

  switch (name) {
    case "plan":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M4 10h16" />
          <path d="M8.5 14.5l2 2 4-4" />
        </svg>
      )
    case "focus":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case "track":
      return (
        <svg {...common}>
          <path d="M4 18V6" />
          <path d="M4 18h16" />
          <path d="M8 14v-3" />
          <path d="M13 14V9" />
          <path d="M18 14V7" />
        </svg>
      )
    case "review":
      return (
        <svg {...common}>
          <path d="M20 12a8 8 0 1 1-2.343-5.657" />
          <path d="M20 4v4h-4" />
          <path d="M12 8v4l2.5 2.5" />
        </svg>
      )
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 4v4" />
          <path d="M12 16v4" />
          <path d="M4 12h4" />
          <path d="M16 12h4" />
          <path d="M7 7l2.5 2.5" />
          <path d="M14.5 14.5L17 17" />
          <path d="M7 17l2.5-2.5" />
          <path d="M14.5 9.5L17 7" />
        </svg>
      )
    case "apple":
      return (
        <svg {...common}>
          <path d="M15.5 3.5c0 1.5-1.2 2.8-2.6 2.8-.1-1.4 1.2-2.9 2.6-2.8z" />
          <path d="M17 12.5c0-2.2 1.7-3.2 1.8-3.3-1-1.5-2.5-1.7-3-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.2 2.6 2.2 1 0 1.4-.7 2.7-.7 1.2 0 1.5.7 2.6.7 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1-.1-2.1-.8-2.1-3.2z" />
        </svg>
      )
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
      )
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />
        </svg>
      )
    case "download":
      return (
        <svg {...common}>
          <path d="M12 4v11" />
          <path d="M7 11l5 5 5-5" />
          <path d="M5 20h14" />
        </svg>
      )
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      )
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      )
  }
}
