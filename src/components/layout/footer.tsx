import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"

const SUPPORT_EMAIL = "support@getlocus.tech"

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      aria-labelledby="site-footer-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <h2 id="site-footer-heading" className="sr-only">
        Site footer
      </h2>
      <PageShell className="py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              aria-label="Locus home"
              className="inline-flex items-center gap-2 font-semibold tracking-tight text-[var(--fg)]"
            >
              <span
                aria-hidden
                className="inline-block size-2 rounded-full bg-[var(--accent)]"
              />
              Locus
            </Link>
            <p className="max-w-xs text-sm text-[var(--muted-foreground)]">
              A macOS focus system for sessions, projects and habits.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <Link
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)]"
            >
              {SUPPORT_EMAIL}
            </Link>
            <Link
              href="/privacy"
              className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)]"
            >
              Privacy
            </Link>
          </nav>
        </div>

        <p className="mt-10 text-xs text-[var(--muted-foreground)] md:mt-14">
          © {year} Locus. All rights reserved.
        </p>
      </PageShell>
    </footer>
  )
}
