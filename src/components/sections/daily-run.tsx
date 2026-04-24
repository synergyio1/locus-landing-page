import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { DailyRunStack } from "@/components/ui/daily-run-stack"
import { DeviceFrame } from "@/components/ui/device-frame"
import { dailyRun } from "@/content/dailyRun"

export function DailyRun() {
  const [primary, secondary] = dailyRun.panels
  return (
    <section
      id={dailyRun.id}
      aria-labelledby="daily-run-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-32">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:items-start md:gap-16">
          <div className="md:sticky md:top-[12vh]">
            <SpringReveal className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {dailyRun.eyebrow}
              </span>
              <h2
                id="daily-run-heading"
                className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
              >
                {dailyRun.headline}
              </h2>
              <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
                {dailyRun.body}
              </p>
            </SpringReveal>
          </div>

          <DailyRunStack
            primary={
              <div className="flex flex-col gap-3">
                <DeviceFrame>
                  <AppScreenshot
                    src={primary.screenshot.src}
                    alt={primary.screenshot.alt}
                    width={primary.screenshot.width}
                    height={primary.screenshot.height}
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 54vw, 760px"
                  />
                </DeviceFrame>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {primary.caption}
                </p>
              </div>
            }
            secondary={
              <div className="ml-auto flex max-w-sm flex-col gap-3">
                <DeviceFrame>
                  <AppScreenshot
                    src={secondary.screenshot.src}
                    alt={secondary.screenshot.alt}
                    width={secondary.screenshot.width}
                    height={secondary.screenshot.height}
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 32vw, 420px"
                  />
                </DeviceFrame>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {secondary.caption}
                </p>
              </div>
            }
          />
        </div>
      </PageShell>
    </section>
  )
}
