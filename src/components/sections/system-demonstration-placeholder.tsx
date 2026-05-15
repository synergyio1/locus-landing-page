import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"

const DEMO_MODES = [
  {
    label: "Session Tracking",
    copy: "Declare the work you mean to do, then let Locus compare the active window with that intent while the session runs.",
  },
  {
    label: "Day Visibility",
    copy: "When meetings, messages, errands, and surprise calls bend the plan, the day still leaves a readable trail.",
  },
  {
    label: "Review Loop",
    copy: "The messy Tuesday becomes a digest, a few honest questions, and a sharper shape for tomorrow.",
  },
] as const

export function SystemDemonstrationPlaceholder() {
  return (
    <section
      id="day-in-locus"
      aria-labelledby="day-in-locus-heading"
      className="relative border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-32">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] md:items-start md:gap-16">
          <SpringReveal className="flex flex-col gap-5 md:sticky md:top-28">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              A day in Locus
            </span>
            <h2
              id="day-in-locus-heading"
              className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
            >
              One chaotic day, held by one system.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              The main demo follows the same mixed day from first intent to
              Friday review: work goals, personal goals, Slack escalations,
              inbox spillover, and life admin in the same readable loop.
            </p>
          </SpringReveal>

          <SpringReveal delay={100} as="div">
            <ol className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {DEMO_MODES.map((mode, index) => (
                <li
                  key={mode.label}
                  className="grid gap-4 py-7 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8 md:py-9"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-text)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-medium tracking-tight text-[var(--fg)]">
                      {mode.label}
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
                      {mode.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </SpringReveal>
        </div>
      </PageShell>
    </section>
  )
}
