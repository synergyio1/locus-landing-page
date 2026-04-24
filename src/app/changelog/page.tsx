import type { Metadata } from "next"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { changelog, type ChangelogEntry } from "@/content/changelog"

export const metadata: Metadata = {
  title: "Changelog — Locus",
  description: "What's new in Locus, version by version.",
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

export default function ChangelogPage() {
  return (
    <PageShell as="article" className="py-20 md:py-28">
      <SpringReveal className="flex max-w-2xl flex-col gap-4">
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Changelog
        </span>
        <h1 className="text-4xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-5xl">
          What&rsquo;s new in Locus
        </h1>
        <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          A hand-written log of every release. Newest first.
        </p>
      </SpringReveal>

      <ol className="mt-16 flex flex-col gap-16 md:gap-20">
        {changelog.map((entry, i) => (
          <SpringReveal
            key={entry.version}
            as="li"
            delay={80 + i * 60}
            className="grid gap-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
          >
            <header className="flex flex-col gap-1 md:pt-1">
              <span className="font-mono text-sm text-[var(--accent-text)]">
                {entry.version}
              </span>
              <time
                dateTime={entry.date}
                className="text-sm text-[var(--muted-foreground)]"
              >
                {formatDate(entry.date)}
              </time>
            </header>

            <div className="flex flex-col gap-6 border-t border-[var(--border)] pt-6 md:border-t-0 md:pt-0">
              {entry.summary ? (
                <p className="text-base leading-relaxed text-[var(--fg)] md:text-lg">
                  {entry.summary}
                </p>
              ) : null}
              <Group label="Added" items={entry.added} />
              <Group label="Improved" items={entry.improved} />
              <Group label="Fixed" items={entry.fixed} />
            </div>
          </SpringReveal>
        ))}
      </ol>
    </PageShell>
  )
}

function Group({ label, items }: { label: string; items: ChangelogEntry["added"] }) {
  if (items.length === 0) return null
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
        {label}
      </h2>
      <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-[var(--fg)] md:text-base">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              aria-hidden
              className="mt-2 size-1 shrink-0 rounded-full bg-[var(--muted-foreground)]"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
