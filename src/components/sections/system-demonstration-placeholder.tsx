import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"

const DEMO_MODES = [
  {
    label: "The intent",
    copy: "Every session starts with the work you mean to do. Locus turns that line into the spine of your day — and the active window into a quiet check against it.",
  },
  {
    label: "The drift",
    copy: "Meetings, messages, errands, surprise calls. The day bends. Locus stays with you, catches the moments you fall off, and offers the smallest possible nudge back.",
  },
  {
    label: "The receipts",
    copy: "The week lays itself out flat: what moved, what didn't, what next week is for. The honesty you'd get from a coach — without the calendar invite.",
  },
  {
    label: "The agent",
    copy: "Underneath it all, an AI you can actually trust. Every behavior it has is a plain file you can read and edit, everything it learns about you lives in a wiki on your Mac, and anything it does on its own comes with one-click Undo.",
  },
] as const

export function SystemDemonstrationPlaceholder() {
  return (
    <section
      id="day-in-locus"
      aria-labelledby="day-in-locus-heading"
      className="relative border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-24 md:py-36">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] md:items-start md:gap-16">
          <SpringReveal className="flex flex-col gap-5 md:sticky md:top-28">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              A day in Locus
            </span>
            <h2
              id="day-in-locus-heading"
              className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
            >
              An entire day, in one operating system.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              Work, life, the unscheduled. The deep block at 10 and the school
              pickup at 3. Locus is the layer underneath all of it — the one
              place where intent, drift, and the receipts of the week meet.
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
