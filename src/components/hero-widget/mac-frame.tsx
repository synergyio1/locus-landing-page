import * as React from "react"

import { cn } from "@/lib/utils"

type MacFrameProps = React.HTMLAttributes<HTMLDivElement>

export function MacFrame({ className, children, ...props }: MacFrameProps) {
  return (
    <div
      data-slot="mac-frame"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_92%,#000_8%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_60px_120px_-36px_rgba(4,10,16,0.85),0_18px_48px_-24px_rgba(0,71,171,0.18)]",
        className
      )}
      {...props}
    >
      <MacMenuBar />
      {children}
    </div>
  )
}

function MacMenuBar() {
  return (
    <div
      aria-hidden
      className="flex items-center gap-5 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_85%,#000_15%)]/80 px-5 py-2 text-[11px] text-[var(--muted-foreground)] backdrop-blur-md"
    >
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_oklab,#ff5f57_70%,#000)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_oklab,#febc2e_70%,#000)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_oklab,#28c840_70%,#000)]" />
      </span>
      <span className="font-medium text-[var(--fg)]">Locus</span>
      <span className="hidden sm:inline">File</span>
      <span className="hidden sm:inline">Edit</span>
      <span className="hidden sm:inline">View</span>
      <span className="hidden md:inline">Window</span>
      <span className="hidden md:inline">Help</span>
      <span className="ml-auto font-mono tracking-tight text-[var(--muted-foreground)]">
        Tue · 9:41 AM
      </span>
    </div>
  )
}
