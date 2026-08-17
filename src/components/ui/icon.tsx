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
  | "tasks"
  | "habit"
  | "note"
  | "chat"
  | "routine"
  | "memory"

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
    case "tasks":
      return (
        <svg {...common}>
          <path d="M4 6l1.5 1.5 3-3" />
          <path d="M11.5 6H20" />
          <path d="M4 12.5L5.5 14l3-3" />
          <path d="M11.5 12.5H20" />
          <path d="M4.5 19h3" />
          <path d="M11.5 19H20" />
        </svg>
      )
    case "habit":
      return (
        <svg {...common}>
          <path d="M17 3.5l3 3-3 3" />
          <path d="M20 6.5H8.5A4.5 4.5 0 0 0 4 11v.5" />
          <path d="M7 20.5l-3-3 3-3" />
          <path d="M4 17.5h11.5A4.5 4.5 0 0 0 20 13v-.5" />
        </svg>
      )
    case "note":
      return (
        <svg {...common}>
          <path d="M6 3.5h8l5 5v12H6z" />
          <path d="M14 3.5v5h5" />
          <path d="M9.5 13h5" />
          <path d="M9.5 16.5h5" />
        </svg>
      )
    case "chat":
      return (
        <svg {...common}>
          <path d="M20 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
          <path d="M8.5 8.5h7" />
          <path d="M8.5 11.5h4.5" />
        </svg>
      )
    case "routine":
      return (
        <svg {...common}>
          <rect x="4" y="3.5" width="16" height="17" rx="2" />
          <path d="M8 8.5l3 3-3 3" />
          <path d="M13 14.5h3.5" />
        </svg>
      )
    case "memory":
      return (
        <svg {...common}>
          <circle cx="6" cy="5.5" r="2" />
          <circle cx="6" cy="18.5" r="2" />
          <circle cx="18.5" cy="12" r="2" />
          <path d="M8 5.5h4a2.5 2.5 0 0 1 2.5 2.5v1.5a2.5 2.5 0 0 0 2 2.45" />
          <path d="M8 18.5h4a2.5 2.5 0 0 0 2.5-2.5v-1.5a2.5 2.5 0 0 1 2-2.45" />
        </svg>
      )
  }
}
