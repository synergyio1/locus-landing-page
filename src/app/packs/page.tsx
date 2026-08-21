import type { Metadata } from "next"
import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { packs, type Pack } from "@/content/packs"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Packs — Locus",
  description:
    "A pack is a whole coaching method, expressed as the behaviours Locus runs for you. Six ship with the app.",
}

const BODY = "text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base"
const LABEL =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-text)]"

/**
 * The card's one-line roster read. General is the baseline the others are a
 * diff against, so counting its "changes" would be meaningless — it gets a
 * plain routine count instead.
 */
function rosterLine(pack: Pack): string {
  if (pack.baseline) {
    return `The default method · ${pack.routines.length} routines`
  }
  const counts = (["replaces", "adds", "retires"] as const)
    .map((change) => ({
      label: packs.rosterLabels[change],
      n: pack.routines.filter((r) => r.change === change).length,
    }))
    .filter(({ n }) => n > 0)
    .map(({ label, n }) => `${label} ${n}`)
  return counts.join(" · ")
}

export default function PacksPage() {
  return (
    <PageShell as="article" className="py-20 md:py-28">
      <SpringReveal className="flex max-w-2xl flex-col gap-4">
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          {packs.eyebrow}
        </span>
        <h1 className="text-4xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-5xl">
          {packs.title}
        </h1>
        <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {packs.intro}
        </p>
      </SpringReveal>

      <SpringReveal
        delay={80}
        className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
      >
        <h2 className={cn(LABEL, "md:pt-1")}>What a pack is</h2>
        <div className="flex flex-col gap-6 border-t border-[var(--border)] pt-6 md:border-t-0 md:pt-0">
          <p className={cn(BODY, "max-w-[64ch]")}>{packs.definition}</p>
          <p className="max-w-[64ch] text-[15px] leading-relaxed text-[var(--fg)] md:text-base">
            {packs.layering}
          </p>
          <ul className="flex flex-col gap-5">
            {packs.rules.map((rule) => (
              <li key={rule.title} className="flex flex-col gap-1">
                <h3 className="text-[15px] font-medium text-[var(--fg)] md:text-base">
                  {rule.title}
                </h3>
                <p className={cn(BODY, "max-w-[64ch]")}>{rule.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </SpringReveal>

      <h2 className="sr-only">The packs</h2>
      <ul className="mt-16 grid gap-4 md:mt-20 md:grid-cols-2">
        {packs.packs.map((pack, i) => (
          <SpringReveal
            key={pack.id}
            as="li"
            delay={80 + i * 40}
            className="h-full"
          >
            <Link
              href={`/packs/${pack.id}`}
              className="group flex h-full flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-[color-mix(in_oklab,var(--accent)_35%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:p-7"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-medium tracking-tight text-[var(--fg)]">
                  {pack.name}
                </h3>
                {pack.inspiredBy ? (
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Inspired by {pack.inspiredBy}
                  </p>
                ) : null}
              </div>

              <p className={cn(BODY, "flex-1")}>{pack.summary}</p>

              <p className={cn(LABEL, "text-[var(--muted-foreground)]")}>
                {rosterLine(pack)}
              </p>
            </Link>
          </SpringReveal>
        ))}
      </ul>

      <SpringReveal
        delay={80}
        className="mt-20 grid gap-6 border-t border-[var(--border)] pt-8 md:mt-24 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
      >
        <h2 className={cn(LABEL, "md:pt-1")}>{packs.communityTitle}</h2>
        <p className={cn(BODY, "max-w-[64ch]")}>{packs.community}</p>
      </SpringReveal>

      <SpringReveal delay={120} className="mt-12">
        <p className="text-sm text-[var(--muted-foreground)]">
          {packs.backLink.text}{" "}
          <Link
            href={packs.backLink.href}
            className="text-[var(--accent-text)] underline underline-offset-4"
          >
            {packs.backLink.linkLabel}
          </Link>
          .
        </p>
      </SpringReveal>
    </PageShell>
  )
}
