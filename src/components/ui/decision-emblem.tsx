import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * One bespoke emblem per design decision — the deck's "suits" (Luis,
 * 2026-09-02: the stroke icons read generic, "make something bold"). Solid
 * Cobalt silhouettes with a second, 22%-tint layer; a `var(--surface)` cut
 * where a mark needs a highlight, so it reads as carved out of the card.
 * Drawn on a 48-unit grid, meant to sit large (56px) as the card's pip.
 */
export type DecisionEmblemName =
  | "armor"
  | "dial"
  | "files"
  | "modules"
  | "portrait"
  | "device"

type DecisionEmblemProps = React.SVGAttributes<SVGSVGElement> & {
  name: DecisionEmblemName
  size?: number
}

export function DecisionEmblem({
  name,
  size = 56,
  className,
  ...props
}: DecisionEmblemProps) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "currentColor",
    width: size,
    height: size,
    "aria-hidden": true,
    className: cn("shrink-0", className),
    ...props,
  }

  switch (name) {
    // The armor, not the brain: a shell with a borrowed core showing through.
    case "armor":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="9" opacity=".22" />
          <path
            fillRule="evenodd"
            d="M24 3l19 7v14c0 10.5-8 18.5-19 21.5C13 42.5 5 34.5 5 24V10l19-7zm0 13a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
          />
        </svg>
      )
    // Choose your model: a knob turned to one of five stops.
    case "dial":
      return (
        <svg {...common}>
          <circle cx="7.5" cy="19.5" r="2.6" opacity=".22" />
          <circle cx="14.5" cy="12.5" r="2.6" opacity=".22" />
          <circle cx="24" cy="10" r="2.6" opacity=".22" />
          <circle cx="33.5" cy="12.5" r="2.6" />
          <circle cx="40.5" cy="19.5" r="2.6" opacity=".22" />
          <circle cx="24" cy="29" r="13" />
          <circle cx="28" cy="22" r="2.4" fill="var(--surface)" opacity=".9" />
        </svg>
      )
    // Protocols are files: a fanned stack of sheets, the front one written on.
    case "files":
      return (
        <svg {...common}>
          <rect
            x="5"
            y="13"
            width="18"
            height="24"
            rx="3"
            opacity=".22"
            transform="rotate(-14 14 25)"
          />
          <rect
            x="12"
            y="11"
            width="18"
            height="24"
            rx="3"
            opacity=".45"
            transform="rotate(-7 21 23)"
          />
          <rect x="21" y="10" width="20" height="26" rx="3" />
          <rect x="26" y="17" width="10" height="2.5" rx="1.25" fill="var(--surface)" opacity=".85" />
          <rect x="26" y="23" width="10" height="2.5" rx="1.25" fill="var(--surface)" opacity=".85" />
          <rect x="26" y="29" width="6" height="2.5" rx="1.25" fill="var(--surface)" opacity=".85" />
        </svg>
      )
    // Plug in your own tools: three modules in place, a fourth being snapped in.
    case "modules":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="15" height="15" rx="4" />
          <rect x="27" y="6" width="15" height="15" rx="4" />
          <rect x="6" y="27" width="15" height="15" rx="4" />
          <g transform="rotate(8 34.5 34.5)">
            <rect x="27" y="27" width="15" height="15" rx="4" opacity=".22" />
            <rect x="33" y="30.5" width="3" height="8" rx="1.5" />
            <rect x="30.5" y="33" width="8" height="3" rx="1.5" />
          </g>
        </svg>
      )
    // It gets to know you: a portrait, with the picture filling in ring by ring.
    case "portrait":
      return (
        <svg {...common}>
          <circle cx="18" cy="20" r="7.5" />
          <path d="M5 44c0-10 6-15 13-15s13 5 13 15z" />
          <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M26.36 10.04A13 13 0 0 1 30.56 23.36" />
            <path d="M29.57 6.21A18 18 0 0 1 35.39 24.66" opacity=".55" />
            <path d="M32.78 2.38A23 23 0 0 1 40.22 25.95" opacity=".25" />
          </g>
        </svg>
      )
    // Your day lives on your Mac: a laptop with the day on its screen.
    case "device":
      return (
        <svg {...common}>
          <rect x="8" y="7" width="32" height="23" rx="3.5" />
          <rect x="3" y="33" width="42" height="6" rx="3" />
          <rect x="19" y="33" width="10" height="2" rx="1" fill="var(--surface)" opacity=".7" />
          <circle cx="24" cy="18.5" r="6" fill="var(--surface)" opacity=".9" />
        </svg>
      )
  }
}
