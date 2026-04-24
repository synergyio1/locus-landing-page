import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { Icon } from "@/components/ui/icon"
import { faq } from "@/content/faq"

export function Faq() {
  return (
    <section
      id={faq.id}
      aria-labelledby="faq-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-32">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-16">
          <SpringReveal className="flex flex-col gap-4 md:border-l md:border-[color-mix(in_oklab,var(--accent)_35%,transparent)] md:pl-6">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {faq.eyebrow}
            </span>
            <h2
              id="faq-heading"
              className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
            >
              {faq.headline}
            </h2>
          </SpringReveal>

          <SpringReveal delay={100} as="div">
            <ul className="flex flex-col divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {faq.items.map((item) => (
                <li key={item.id}>
                  <details className="group py-5 transition-colors open:bg-[color-mix(in_oklab,var(--accent)_4%,transparent)]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-[var(--fg)] md:text-lg [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <span
                        aria-hidden
                        className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition-[transform,color,background] group-open:rotate-45 group-open:border-[color-mix(in_oklab,var(--accent)_50%,transparent)] group-open:bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] group-open:text-[var(--accent-text)]"
                      >
                        <Icon name="plus" size={12} />
                      </span>
                    </summary>
                    <div className="faq-collapse">
                      <div className="overflow-hidden">
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </SpringReveal>
        </div>
      </PageShell>
    </section>
  )
}
