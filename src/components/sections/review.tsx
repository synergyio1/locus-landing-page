import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { review } from "@/content/review"

export function Review() {
  const [primary, secondary] = review.panels
  return (
    <section
      id={review.id}
      aria-labelledby="review-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-16">
          <SpringReveal delay={100} className="flex flex-col gap-3 md:order-2">
            <AppScreenshot
              src={primary.screenshot.src}
              alt={primary.screenshot.alt}
              width={primary.screenshot.width}
              height={primary.screenshot.height}
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 58vw, 820px"
              className="rounded-lg border border-[var(--border)] shadow-2xl shadow-black/30"
            />
            <p className="text-sm text-[var(--muted-foreground)]">
              {primary.caption}
            </p>
          </SpringReveal>

          <SpringReveal className="flex flex-col gap-4 md:order-1">
            <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              {review.eyebrow}
            </span>
            <h2
              id="review-heading"
              className="text-3xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-4xl"
            >
              {review.headline}
            </h2>
            <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              {review.body}
            </p>
          </SpringReveal>
        </div>

        <SpringReveal
          delay={180}
          className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 md:mt-20"
        >
          <AppScreenshot
            src={secondary.screenshot.src}
            alt={secondary.screenshot.alt}
            width={secondary.screenshot.width}
            height={secondary.screenshot.height}
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 46vw, 640px"
            className="rounded-lg border border-[var(--border)] shadow-xl shadow-black/25"
          />
          <p className="text-sm text-[var(--muted-foreground)]">
            {secondary.caption}
          </p>
        </SpringReveal>
      </PageShell>
    </section>
  )
}
