"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { useReducedMotion } from "@/components/motion"
import { cn } from "@/lib/utils"
import type { HeroWidgetMode } from "@/content/heroWidget"

type PreviewPanelProps = {
  mode: HeroWidgetMode
}

export function PreviewPanel({ mode }: PreviewPanelProps) {
  const reduced = useReducedMotion()

  return (
    <div
      data-slot="preview-panel"
      className="flex h-full flex-col gap-0 bg-[color-mix(in_oklab,var(--bg)_94%,#000_6%)]"
    >
      <div className="relative overflow-hidden border-b border-[var(--border)]">
        {reduced ? (
          <PreviewTile mode={mode} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <PreviewTile mode={mode} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="flex-1 p-5">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Information
        </div>

        {reduced ? (
          <MetaList mode={mode} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <MetaList mode={mode} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

function PreviewTile({ mode: _mode }: { mode: HeroWidgetMode }) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center bg-[color-mix(in_oklab,var(--bg)_88%,#000_12%)]"
      )}
      style={{ aspectRatio: "16 / 10" }}
    >
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
          Preview
        </span>
        <span className="text-sm text-[var(--fg)] md:text-base">
          Screenshot coming soon
        </span>
      </div>
    </div>
  )
}

function MetaList({ mode }: { mode: HeroWidgetMode }) {
  return (
    <dl className="space-y-2.5">
      {mode.meta.map(([key, value]) => (
        <div
          key={key}
          className="flex items-baseline gap-4 border-b border-[var(--border)] pb-2 last:border-b-0 last:pb-0"
        >
          <dt className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            {key}
          </dt>
          <dd className="ml-auto text-right text-sm text-[var(--fg)]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
