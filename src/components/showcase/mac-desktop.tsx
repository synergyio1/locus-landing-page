import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

type MacDesktopProps = React.HTMLAttributes<HTMLDivElement>

/**
 * MacDesktop — the outer macOS shell the app window floats in (the Raycast
 * homepage pattern): a menu bar, a light wallpaper, and whatever is placed
 * inside. The window chrome itself — traffic lights, titlebar, shadow — is
 * baked into the captures, so this only draws what sits *around* a window.
 *
 * Every piece of chrome is `md:`-prefixed: below `md` the shell disappears and
 * the capture renders full-width on the page canvas with its own shadow. One
 * DOM, no duplicated tabs.
 */
export function MacDesktop({ className, children, ...props }: MacDesktopProps) {
  return (
    <div
      data-slot="mac-desktop"
      className={cn(
        "relative isolate overflow-hidden",
        "md:rounded-2xl md:border md:border-[var(--border)] md:bg-[linear-gradient(135deg,#DCE6F5_0%,#EEF3FA_48%,#D6E2F3_100%)]",
        "md:shadow-[0_40px_80px_-40px_rgb(11_26_51/0.28),inset_0_1px_0_rgb(255_255_255/0.7)]",
        className
      )}
      {...props}
    >
      {/* A soft Cobalt bloom in the wallpaper's lower-right, like light off the desk. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(55% 45% at 88% 100%, rgb(0 71 171 / 0.16), transparent 72%)",
        }}
      />
      <MacMenuBar />
      <div className="relative">{children}</div>
    </div>
  )
}

function MacMenuBar() {
  return (
    <div
      aria-hidden
      className="relative z-10 hidden h-7 items-center gap-4 border-b border-[rgb(11_26_51/0.06)] bg-white/55 px-4 text-[11px] text-[color-mix(in_oklab,var(--fg)_78%,transparent)] backdrop-blur-md md:flex"
    >
      <Icon name="apple" size={12} className="text-[var(--fg)]" />
      <span className="font-semibold text-[var(--fg)]">Locus</span>
      <span>File</span>
      <span>Edit</span>
      <span>View</span>
      <span className="hidden lg:inline">Window</span>
      <span className="hidden lg:inline">Help</span>
      {/* Static, matching the captures' date — a live clock would hydrate-mismatch. */}
      <span className="ml-auto font-mono text-[10.5px] tracking-tight text-[color-mix(in_oklab,var(--fg)_70%,transparent)]">
        Thu 27 Aug · 9:41
      </span>
    </div>
  )
}
