import * as React from "react"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { Icon, type IconName } from "@/components/ui/icon"
import { loop, type LoopVerb } from "@/content/loop"

export function Loop() {
  return (
    <section
      id={loop.id}
      aria-labelledby="loop-heading"
      className="relative border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-24 md:py-32">
        <SpringReveal className="flex flex-col items-start gap-10 md:items-center md:text-center">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            The daily loop
          </span>
          <h2
            id="loop-heading"
            className="max-w-3xl text-balance text-2xl font-medium leading-snug tracking-tight text-[var(--fg)] md:text-4xl"
          >
            {loop.sentence}
          </h2>

          <ol
            aria-label="Daily loop verbs"
            className="grid w-full grid-cols-2 gap-y-8 md:flex md:items-center md:justify-center md:gap-x-6"
          >
            {loop.verbs.map((verb, index) => (
              <React.Fragment key={verb.label}>
                <VerbCell verb={verb} index={index} />
                {index < loop.verbs.length - 1 ? (
                  <li
                    aria-hidden
                    className="hidden md:block"
                    style={{
                      animation: "spring-reveal 520ms cubic-bezier(0.22,1,0.36,1) both",
                      animationDelay: `${index * 140 + 70}ms`,
                    }}
                  >
                    <Connector />
                  </li>
                ) : null}
              </React.Fragment>
            ))}
          </ol>

          <p className="max-w-2xl text-base italic text-[var(--muted-foreground)]">
            {loop.subline}
          </p>
        </SpringReveal>
      </PageShell>
    </section>
  )
}

function VerbCell({ verb, index }: { verb: LoopVerb; index: number }) {
  return (
    <li
      className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)]"
      style={{
        animation: "spring-reveal 520ms cubic-bezier(0.22,1,0.36,1) both",
        animationDelay: `${index * 140}ms`,
      }}
    >
      <span
        aria-hidden
        className="inline-flex size-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] transition-colors group-hover:border-[color-mix(in_oklab,var(--accent)_55%,transparent)]"
      >
        <Icon name={verb.icon as IconName} size={14} />
      </span>
      <span className="text-[var(--fg)]">{verb.label}</span>
    </li>
  )
}

function Connector() {
  return (
    <svg
      viewBox="0 0 40 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      className="h-2 w-10 text-[var(--muted-foreground)]/60"
      aria-hidden
    >
      <path
        d="M2 5h34"
        strokeDasharray="2 3"
        style={{
          strokeDasharray: "60",
          strokeDashoffset: "0",
          animation: "draw-line 800ms cubic-bezier(0.22,1,0.36,1) both",
        }}
      />
      <path d="M32 2l4 3-4 3" />
    </svg>
  )
}
