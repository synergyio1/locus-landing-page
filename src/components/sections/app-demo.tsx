import { HeroWidget } from "@/components/hero-widget"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"

/**
 * AppDemo — the first look at the product itself.
 *
 * Sits right after the Transformation so the narrative lands as
 * problem → crossing → "and this is what's on the other side". The widget
 * used to live inside the Hero; it moved here so the hero headline flows
 * straight into the problem instead of interrupting with the app frame.
 */
export function AppDemo() {
  return (
    <section
      id="app-demo"
      aria-labelledby="app-demo-heading"
      className="relative border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-24 md:py-36">
        <SpringReveal className="flex flex-col gap-5">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            On the other side
          </span>
          <h2
            id="app-demo-heading"
            className="max-w-2xl text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
          >
            This is Locus.
          </h2>
        </SpringReveal>
        <SpringReveal delay={80} className="mt-12 md:mt-16">
          <HeroWidget />
        </SpringReveal>
      </PageShell>
    </section>
  )
}
