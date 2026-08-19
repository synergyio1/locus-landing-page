import * as React from "react"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import type { AuthCopy } from "@/content/auth"

type AuthLayoutProps = {
  copy: AuthCopy
  children: React.ReactNode
}

/**
 * The shared shell for `/login` and `/signup` — the site's asymmetric two-column
 * rhythm (same split as the hero and pricing sections): the left rail states where
 * you are, the right rail carries the form on a raised surface.
 *
 * ⚠️ The top padding is load-bearing, not taste. The header's `ProgressiveGlass`
 * (`components/site-nav-client.tsx`) is `h-[calc(100%+4rem)]`, so the blur reaches
 * 7.5rem down on mobile and 8rem from `md`. These pages previously used `py-16`
 * (4rem) and the `<h1>` rendered visibly blurred underneath it. `pt-32` is 8rem and
 * clears the glass exactly — do not lower it.
 */
export function AuthLayout({ copy, children }: AuthLayoutProps) {
  return (
    <PageShell as="section" className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto grid max-w-[68rem] gap-12 md:grid-cols-[minmax(0,1fr)_minmax(19rem,23rem)] md:items-center md:gap-x-20">
        <SpringReveal className="flex flex-col items-start gap-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
            {copy.eyebrow}
          </span>

          <h1 className="text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-[3rem]">
            {copy.title}
          </h1>

          <p className="max-w-[38ch] text-pretty text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base">
            {copy.subline}
          </p>

          <ul className="mt-2 flex w-full max-w-[40ch] flex-col gap-3 border-t border-[var(--border)] pt-6">
            {copy.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm leading-relaxed text-[var(--muted-foreground)]"
              >
                <span
                  aria-hidden
                  className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-[color-mix(in_oklab,var(--accent)_45%,transparent)]"
                />
                {point}
              </li>
            ))}
          </ul>
        </SpringReveal>

        <SpringReveal
          delay={120}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[0_24px_48px_-32px_rgba(11,26,51,0.22)]"
        >
          {children}
        </SpringReveal>
      </div>
    </PageShell>
  )
}
