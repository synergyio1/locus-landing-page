import type { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import {
  architecture,
  STATUS_LABELS,
  type ArchitectureDecision,
} from "@/content/architecture"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Architecture decisions — Locus",
  description:
    "The six calls that shaped Locus: what was on the table, what we chose, why, and what it costs you.",
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
})

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return DATE_FORMATTER.format(new Date(Date.UTC(y, m - 1, d)))
}

/**
 * Clearance for anchor jumps. Deeper than the letter's scroll-mt-24: the
 * target here is a display-size h2, and the header's progressive glass fades
 * 4rem past the bar — at 24 the title lands inside the blur.
 */
const HEADING_ANCHOR = "scroll-mt-32"
const BODY = "text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base"
const LABEL =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]"

/**
 * The long form of the manifesto's decisions list (2026-08-20).
 *
 * Same reading rhythm as the letter — one measure, plain sentences — but
 * structured, because each entry answers the same four questions in the same
 * order: what was on the table, what we chose, why, and what it costs. The
 * numbered index up top mirrors the letter's mini-TOC and makes the page's
 * shape visible before anyone commits to it.
 *
 * Content — including the order and the one-liners — comes from
 * `content/architecture.ts`, which reads them off `manifesto.decisions`, so
 * the tab and the letter cannot drift apart.
 */
export default function ArchitecturePage() {
  return (
    <PageShell as="article" className="py-20 md:py-28">
      <SpringReveal className="flex max-w-2xl flex-col gap-4">
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          {architecture.eyebrow}
        </span>
        <h1 className="text-4xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-5xl">
          {architecture.title}
        </h1>
        <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {architecture.intro}
        </p>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          {architecture.note}
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          Last updated{" "}
          <time dateTime={architecture.lastUpdated}>
            {formatDate(architecture.lastUpdated)}
          </time>
          .
        </p>
      </SpringReveal>

      <SpringReveal delay={80} as="nav" aria-label={architecture.indexLabel}>
        <span aria-hidden className={cn(LABEL, "mt-14 block md:mt-16")}>
          {architecture.indexLabel}
        </span>
        <ol className="mt-4 grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {architecture.decisions.map((decision) => (
            <li key={decision.id}>
              <a
                href={`#${decision.id}`}
                className="group grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 py-1 text-[15px] leading-snug"
              >
                <span
                  aria-hidden
                  className="font-mono text-[10px] tracking-[0.18em] text-[var(--accent-text)]"
                >
                  {String(decision.index).padStart(2, "0")}
                </span>
                <span className="text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--fg)]">
                  {decision.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </SpringReveal>

      <ol className="mt-16 flex flex-col gap-16 md:mt-20 md:gap-24">
        {architecture.decisions.map((decision, i) => (
          <Decision key={decision.id} decision={decision} delay={80 + i * 40} />
        ))}
      </ol>

      <SpringReveal
        delay={80}
        className="mt-20 border-t border-[var(--border)] pt-8 md:mt-24"
      >
        <p className={BODY}>
          {architecture.backLink.text}{" "}
          <Link
            href={architecture.backLink.href}
            className="text-[var(--accent-text)] underline decoration-[color-mix(in_oklab,var(--accent)_45%,transparent)] underline-offset-4 transition-colors hover:decoration-[var(--accent-text)]"
          >
            {architecture.backLink.linkLabel}
          </Link>
          .
        </p>
      </SpringReveal>
    </PageShell>
  )
}

function Decision({
  decision,
  delay,
}: {
  decision: ArchitectureDecision
  delay: number
}) {
  const next = decision.status === "next"
  return (
    <SpringReveal
      as="li"
      id={decision.id}
      delay={delay}
      className={cn(
        HEADING_ANCHOR,
        "grid gap-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
      )}
    >
      <header className="flex flex-col items-start gap-3 md:pt-2">
        <span
          aria-hidden
          className="font-mono text-sm tracking-[0.18em] text-[var(--accent-text)]"
        >
          {String(decision.index).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
            next
              ? "border-[color-mix(in_oklab,var(--accent)_35%,transparent)] text-[var(--accent-text)]"
              : "border-[var(--border)] text-[var(--muted-foreground)]"
          )}
        >
          {STATUS_LABELS[decision.status]}
        </span>
      </header>

      <div className="flex flex-col gap-8 border-t border-[var(--border)] pt-6 md:border-t-0 md:pt-0">
        <div className="flex max-w-[64ch] flex-col gap-3">
          <h2 className="text-2xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-3xl">
            {decision.title}
          </h2>
          <p className="text-base leading-relaxed text-[var(--fg)] md:text-lg">
            {decision.summary}
          </p>
        </div>

        <Field label="The question" className="max-w-[64ch]">
          <p className={BODY}>{decision.question}</p>
        </Field>

        <Field label="What we chose" className="max-w-[64ch]">
          <p className={cn(BODY, "text-[var(--fg)]")}>{decision.choice}</p>
        </Field>

        <Field label="Why" className="max-w-[64ch]">
          <ul className="flex flex-col gap-3">
            {decision.reasons.map((reason) => (
              <li key={reason} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[0.6em] size-1 shrink-0 rounded-full bg-[var(--accent-text)]"
                />
                <span className={BODY}>{reason}</span>
              </li>
            ))}
          </ul>
        </Field>

        <Field label="What it costs" className="max-w-[64ch]">
          <p className={BODY}>{decision.tradeoff}</p>
        </Field>
      </div>
    </SpringReveal>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("flex flex-col gap-2", className)}>
      <h3 className={LABEL}>{label}</h3>
      {children}
    </section>
  )
}
