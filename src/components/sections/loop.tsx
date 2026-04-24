import * as React from "react"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { loop, type LoopVerb } from "@/content/loop"

export function Loop() {
  return (
    <section
      id={loop.id}
      aria-labelledby="loop-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-28">
        <SpringReveal className="flex flex-col items-start gap-10 md:items-center md:text-center">
          <h2
            id="loop-heading"
            className="max-w-3xl text-2xl font-medium leading-snug tracking-tight text-[var(--fg)] md:text-3xl"
          >
            {loop.sentence}
          </h2>
          <ul className="flex w-full flex-wrap items-center gap-x-8 gap-y-4 md:justify-center md:gap-x-12">
            {loop.verbs.map((verb, index) => (
              <React.Fragment key={verb.label}>
                <li className="flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  <VerbIcon name={verb.icon} />
                  <span className="text-[var(--fg)]">{verb.label}</span>
                </li>
                {index < loop.verbs.length - 1 ? (
                  <li
                    aria-hidden
                    className="hidden text-[var(--muted-foreground)]/60 md:block"
                  >
                    →
                  </li>
                ) : null}
              </React.Fragment>
            ))}
          </ul>
          <p className="max-w-2xl text-base italic text-[var(--muted-foreground)]">
            {loop.subline}
          </p>
        </SpringReveal>
      </PageShell>
    </section>
  )
}

function VerbIcon({ name }: { name: LoopVerb["icon"] }) {
  const common = {
    "aria-hidden": true as const,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-4 text-[var(--accent)]",
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
  }
}
