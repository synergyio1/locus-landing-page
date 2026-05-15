"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { useReducedMotion } from "@/components/motion"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import type {
  HeroWidgetMode,
  HeroWidgetResultRow,
} from "@/content/heroWidget"

import { PreviewPanel } from "./preview-panel"

type CommandWindowProps = {
  mode: HeroWidgetMode
}

export function CommandWindow({ mode }: CommandWindowProps) {
  const reduced = useReducedMotion()

  return (
    <div
      data-slot="command-window"
      className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_88%,#000_12%)]/95 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl"
    >
      <CommandHeader mode={mode} reduced={reduced} />

      <div className="grid grid-cols-1 md:grid-cols-[38%_62%]">
        <div className="border-b border-[var(--border)] md:border-b-0 md:border-r">
          <ResultList mode={mode} reduced={reduced} />
        </div>
        <PreviewPanel mode={mode} />
      </div>

      <CommandFooter mode={mode} />
    </div>
  )
}

function CommandHeader({
  mode,
  reduced,
}: {
  mode: HeroWidgetMode
  reduced: boolean
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
      <span
        aria-hidden
        className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent-subtle)] text-[var(--accent-text,var(--fg))]"
      >
        <Icon name="bolt" size={14} />
      </span>

      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          {mode.eyebrow}
        </span>
        {reduced ? (
          <span className="truncate text-sm font-medium text-[var(--fg)] md:text-base">
            {mode.query}
          </span>
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={mode.id}
              initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="truncate text-sm font-medium text-[var(--fg)] md:text-base"
            >
              {mode.query}
            </motion.span>
          </AnimatePresence>
        )}
      </div>

      <span className="ml-auto hidden shrink-0 rounded-md border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_80%,#000_20%)] px-2.5 py-1 text-[11px] text-[var(--muted-foreground)] sm:inline">
        {mode.scope}
      </span>
    </div>
  )
}

function ResultList({
  mode,
  reduced,
}: {
  mode: HeroWidgetMode
  reduced: boolean
}) {
  return (
    <div className="flex flex-col gap-1 p-3">
      <div className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        Today
      </div>
      <ul className="flex flex-col gap-1">
        {mode.resultRows.map((row, index) =>
          reduced ? (
            <li key={`${mode.id}-${index}`}>
              <ResultRow row={row} />
            </li>
          ) : (
            <motion.li
              key={`${mode.id}-${index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.28,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ResultRow row={row} />
            </motion.li>
          )
        )}
      </ul>
    </div>
  )
}

function ResultRow({ row }: { row: HeroWidgetResultRow }) {
  const accentColor =
    row.accent === "alive"
      ? "var(--alive)"
      : row.accent === "warn"
        ? "var(--warn)"
        : "color-mix(in oklab, var(--fg) 35%, transparent)"

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
        row.active
          ? "border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--accent-subtle)]"
          : "border-transparent hover:bg-[color-mix(in_oklab,var(--fg)_5%,transparent)]"
      )}
    >
      <span
        aria-hidden
        className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm text-[var(--fg)]">{row.title}</span>
        <span className="truncate text-xs text-[var(--muted-foreground)]">
          {row.subtitle}
        </span>
      </div>
    </div>
  )
}

function CommandFooter({ mode }: { mode: HeroWidgetMode }) {
  return (
    <div className="flex items-center gap-3 border-t border-[var(--border)] px-4 py-2.5 text-xs">
      <span className="text-[var(--muted-foreground)]">{mode.footerLabel}</span>
      <span className="ml-auto flex items-center gap-2 text-[var(--fg)]">
        <span className="font-medium">{mode.footerAction}</span>
        <kbd className="rounded border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_75%,#000_25%)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)]">
          {mode.footerKbd}
        </kbd>
      </span>
    </div>
  )
}
