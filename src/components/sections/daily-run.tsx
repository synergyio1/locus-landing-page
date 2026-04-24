import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { dailyRun } from "@/content/dailyRun"

export function DailyRun() {
  const [primary, secondary] = dailyRun.panels
  return (
    <section
      id={dailyRun.id}
      aria-labelledby="daily-run-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-28">
        <SpringReveal className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            {dailyRun.eyebrow}
          </span>
          <h2
            id="daily-run-heading"
            className="text-3xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-4xl"
          >
            {dailyRun.headline}
          </h2>
          <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {dailyRun.body}
          </p>
        </SpringReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] md:items-start md:gap-10">
          <SpringReveal delay={100} className="flex flex-col gap-3">
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

          <SpringReveal delay={180} className="flex flex-col gap-3 md:mt-16">
            <AppScreenshot
              src={secondary.screenshot.src}
              alt={secondary.screenshot.alt}
              width={secondary.screenshot.width}
              height={secondary.screenshot.height}
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 34vw, 440px"
              className="rounded-lg border border-[var(--border)] shadow-xl shadow-black/25"
            />
            <p className="text-sm text-[var(--muted-foreground)]">
              {secondary.caption}
            </p>
          </SpringReveal>
        </div>
      </PageShell>
    </section>
  )
}
