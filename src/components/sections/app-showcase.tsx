import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { ShowcaseStage } from "@/components/showcase/showcase-stage"
import { appShowcase } from "@/content/app-showcase"

/**
 * The `#showcase` section on `/` — the app, on screen, between the letter and
 * the price. It replaced the letter's "Locus, in three parts" block (cut
 * 2026-08-31): real screens instead of a description. The per-tab write-ups
 * sit inside the stage — a side panel on md+, an inline toggle below — so the
 * page stays short (Luis, 2026-08-31).
 */
export function AppShowcase() {
  return (
    <section
      id={appShowcase.id}
      aria-labelledby="showcase-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-24 md:py-36">
        <SpringReveal as="div" className="flex max-w-2xl flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-text)]">
            {appShowcase.eyebrow}
          </span>
          <h2
            id="showcase-heading"
            className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-4xl"
          >
            {appShowcase.title}
          </h2>
          <p className="max-w-[44ch] text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base">
            {appShowcase.intro}
          </p>
        </SpringReveal>

        <SpringReveal delay={120} as="div" className="mt-12 md:mt-16">
          <ShowcaseStage
            content={appShowcase}
            idBase="home-showcase"
            autoAdvance
            // 1100px desktop with the window held at 920px inside it (Luis,
            // 2026-09-01: "a bit wider, keeping the height") — the shell reads
            // as a desktop, the stage still fits a 100%-zoom laptop viewport.
            className="mx-auto max-w-[1100px]"
          />
        </SpringReveal>

        <SpringReveal
          delay={160}
          as="div"
          className="mx-auto mt-14 max-w-[64ch] border-t border-[var(--border)] pt-8 md:mt-20"
        >
          <p className="text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base">
            <span className="font-medium text-[var(--fg)]">{appShowcase.connect.heading}. </span>
            {appShowcase.connect.text}
          </p>
        </SpringReveal>
      </PageShell>
    </section>
  )
}
