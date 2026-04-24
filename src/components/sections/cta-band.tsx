import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { cn } from "@/lib/utils"

export function CtaBand() {
  return (
    <section
      aria-labelledby="cta-band-heading"
      className="relative isolate overflow-hidden border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "conic-gradient(from var(--angle), color-mix(in oklab, var(--accent) 18%, transparent), transparent 35%, transparent 65%, color-mix(in oklab, var(--accent) 12%, transparent))",
          animation: "conic-drift 14s linear infinite",
          maskImage:
            "radial-gradient(ellipse 60% 70% at 50% 60%, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 70% at 50% 60%, black 20%, transparent 80%)",
          opacity: 0.9,
        }}
      />
      <div
        aria-hidden
        className="chroma-grid pointer-events-none absolute inset-0 -z-10 opacity-40"
      />

      <PageShell className="relative py-24 md:py-36">
        <SpringReveal className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            <span className="size-1.5 rounded-full bg-[var(--alive)]" />
            Available for macOS
          </span>
          <h2
            id="cta-band-heading"
            className="text-balance text-4xl font-semibold leading-[1.02] tracking-tighter text-[var(--fg)] md:text-6xl"
          >
            Start the week with a plan.
            <br />
            End it with the receipts.
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            Download Locus. Run one session. Come back next Friday and the week
            is already writing itself.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href="/download">
              <span
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                )}
              >
                <Icon name="download" size={16} />
                Download for macOS
              </span>
            </MagneticButton>
            <Link
              href="/pricing"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              See Pro
            </Link>
          </div>
        </SpringReveal>
      </PageShell>
    </section>
  )
}
