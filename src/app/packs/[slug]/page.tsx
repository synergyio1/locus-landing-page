import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { findPack, packs, type PackChange } from "@/content/packs"
import { cn } from "@/lib/utils"

const BODY = "text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base"
const LABEL =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-text)]"

/** Roster order: what stands in, what arrives, what goes quiet, what's untouched. */
const ROSTER_ORDER: PackChange[] = ["replaces", "adds", "retires", "runs"]

export function generateStaticParams() {
  return packs.packs.map((pack) => ({ slug: pack.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const pack = findPack(slug)
  if (!pack) return {}
  return {
    title: `${pack.name} — Locus packs`,
    description: pack.summary,
  }
}

export default async function PackPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pack = findPack(slug)
  if (!pack) notFound()

  const groups = ROSTER_ORDER.map((change) => ({
    change,
    label: change === "runs" ? packs.runsLabel : packs.rosterLabels[change],
    routines: pack.routines.filter((routine) => routine.change === change),
  })).filter((group) => group.routines.length > 0)

  return (
    <PageShell as="article" className="py-20 md:py-28">
      <SpringReveal className="flex max-w-2xl flex-col gap-4">
        <Link
          href="/packs"
          className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)]"
        >
          {packs.eyebrow}
        </Link>
        <h1 className="text-4xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-5xl">
          {pack.name}
        </h1>
        {pack.inspiredBy ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            Inspired by {pack.inspiredBy}
          </p>
        ) : null}
        <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {pack.summary}
        </p>
      </SpringReveal>

      <SpringReveal
        delay={80}
        className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
      >
        <h2 className={cn(LABEL, "md:pt-1")}>The method</h2>
        <div className="flex flex-col gap-6 border-t border-[var(--border)] pt-6 md:border-t-0 md:pt-0">
          <p className="max-w-[64ch] text-[15px] leading-relaxed text-[var(--fg)] md:text-base">
            {pack.lede}
          </p>
          {pack.note ? (
            <p className={cn(BODY, "max-w-[64ch]")}>{pack.note}</p>
          ) : null}
          {pack.principles.map((principle) => (
            <div key={principle.title} className="flex flex-col gap-1">
              <h3 className="text-[15px] font-medium text-[var(--fg)] md:text-base">
                {principle.title}
              </h3>
              <p className={cn(BODY, "max-w-[64ch]")}>{principle.body}</p>
            </div>
          ))}
        </div>
      </SpringReveal>

      {pack.stance ? (
        <SpringReveal
          delay={80}
          className="mt-16 grid gap-6 md:mt-20 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
        >
          <h2 className={cn(LABEL, "md:pt-1")}>The coach&rsquo;s stance</h2>
          <blockquote className="border-l-2 border-[color-mix(in_oklab,var(--accent)_45%,transparent)] pl-6">
            <p className="max-w-[64ch] text-[15px] leading-relaxed text-[var(--fg)] md:text-base">
              {pack.stance}
            </p>
            <footer className="mt-3 text-xs text-[var(--muted-foreground)]">
              This shapes coaching and reflection only. It never changes what
              Locus records about you, and your own calibration always wins.
            </footer>
          </blockquote>
        </SpringReveal>
      ) : null}

      <SpringReveal
        delay={80}
        className="mt-16 grid gap-6 md:mt-20 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
      >
        <h2 className={cn(LABEL, "md:pt-1")}>What changes</h2>
        <div className="flex flex-col gap-10 border-t border-[var(--border)] pt-6 md:border-t-0 md:pt-0">
          {groups.map((group) => (
            <section key={group.change} className="flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                {group.label}
              </h3>
              <ul className="flex flex-col gap-4">
                {group.routines.map((routine) => (
                  <li key={routine.slug} className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="text-[15px] font-medium text-[var(--fg)] md:text-base">
                        {routine.name}
                      </h4>
                      {routine.time ? (
                        <span className="font-mono text-xs text-[var(--accent-text)]">
                          {routine.time}
                        </span>
                      ) : null}
                      {routine.replaces ? (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          stands in for {routine.replaces}
                        </span>
                      ) : null}
                    </div>
                    <p className={BODY}>{routine.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </SpringReveal>

      <SpringReveal
        delay={80}
        className="mt-16 grid gap-6 md:mt-20 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-12"
      >
        <h2 className={cn(LABEL, "md:pt-1")}>{packs.howToTitle}</h2>
        <div className="flex flex-col gap-6 border-t border-[var(--border)] pt-6 md:border-t-0 md:pt-0">
          <p className={cn(BODY, "max-w-[64ch]")}>{packs.howTo}</p>
          <p className="max-w-[64ch] text-[15px] leading-relaxed text-[var(--fg)] md:text-base">
            {pack.closer}
          </p>
        </div>
      </SpringReveal>

      <SpringReveal
        delay={120}
        className="mt-20 border-t border-[var(--border)] pt-8 md:mt-24"
      >
        <Link
          href="/packs"
          className="text-sm text-[var(--accent-text)] underline underline-offset-4"
        >
          All packs
        </Link>
      </SpringReveal>
    </PageShell>
  )
}
