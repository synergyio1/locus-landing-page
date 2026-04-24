import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { faq } from "@/content/faq"

export function Faq() {
  return (
    <section
      id={faq.id}
      aria-labelledby="faq-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <SpringReveal className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              {faq.eyebrow}
            </span>
            <h2
              id="faq-heading"
              className="text-3xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-4xl"
            >
              {faq.headline}
            </h2>
          </SpringReveal>

          <SpringReveal delay={100} as="div">
            <ul className="flex flex-col divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {faq.items.map((item) => (
                <li key={item.id}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-[var(--fg)] md:text-lg [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <span
                        aria-hidden
                        className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition-transform group-open:rotate-45"
                      >
                        <svg
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          className="size-3"
                          aria-hidden
                        >
                          <path d="M6 2v8" />
                          <path d="M2 6h8" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
                      {item.answer}
                    </p>
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
