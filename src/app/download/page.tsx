import type { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { BreathingDot, SpringReveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import { download } from "@/content/download"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Download — Locus",
  description:
    "Locus is coming soon for macOS 14 Sonoma or later. Get notified when the first build ships.",
}

export default function DownloadPage() {
  return (
    <PageShell as="section" className="py-24 md:py-32">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <SpringReveal className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            <BreathingDot aria-hidden />
            {download.eyebrow}
          </span>
          <h1 className="text-5xl font-semibold leading-none tracking-tighter text-[var(--fg)] md:text-6xl">
            {download.headline}
          </h1>
          <p className="text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
            {download.body}
          </p>
        </SpringReveal>

        <SpringReveal
          delay={100}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5"
        >
          <p
            data-slot="download-requirement"
            className="text-base font-medium text-[var(--fg)] md:text-lg"
          >
            {download.requirement}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Apple Silicon and Intel Macs both supported.
          </p>
        </SpringReveal>

        <SpringReveal delay={160} className="flex flex-col gap-3">
          <Link
            href={download.notify.href}
            className={cn(buttonVariants({ size: "lg" }), "self-start")}
          >
            {download.notify.label}
          </Link>
          <p className="text-sm text-[var(--muted-foreground)]">
            {download.notify.note}
          </p>
        </SpringReveal>
      </div>
    </PageShell>
  )
}
