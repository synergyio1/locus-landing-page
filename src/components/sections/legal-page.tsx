import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import type { LegalContent } from "@/content/privacy"

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

export function LegalPage({ content }: { content: LegalContent }) {
  return (
    <PageShell as="article" className="py-20 md:py-28">
      {content.draft ? (
        <div
          role="note"
          data-slot="legal-draft-banner"
          className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm text-[var(--muted-foreground)] md:mb-14"
        >
          <span className="font-medium text-[var(--fg)]">Draft</span>
          <span aria-hidden> — </span>
          not yet legally reviewed. Placeholder copy while the final policy is
          being drafted.
        </div>
      ) : null}

      <SpringReveal className="flex max-w-2xl flex-col gap-4">
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Legal
        </span>
        <h1 className="text-4xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-5xl">
          {content.title}
        </h1>
        <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {content.intro}
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          Last updated{" "}
          <time dateTime={content.lastUpdated}>
            {formatDate(content.lastUpdated)}
          </time>
          .
        </p>
      </SpringReveal>

      <div className="mt-16 flex flex-col gap-12 md:gap-16">
        {content.sections.map((section, i) => (
          <SpringReveal
            key={section.heading}
            as="section"
            delay={80 + i * 60}
            className="grid gap-4 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
          >
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--accent)] md:pt-1">
              {section.heading}
            </h2>
            <p className="max-w-2xl border-t border-[var(--border)] pt-4 text-base leading-relaxed text-[var(--fg)] md:border-t-0 md:pt-0 md:text-lg">
              {section.body}
            </p>
          </SpringReveal>
        ))}
      </div>
    </PageShell>
  )
}
