import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { Logo } from "@/components/ui/logo"

const SUPPORT_EMAIL = "support@getlocus.tech"

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      aria-labelledby="site-footer-heading"
      className="relative border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <h2 id="site-footer-heading" className="sr-only">
        Site footer
      </h2>
      <PageShell className="py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.6fr)] md:items-start md:gap-16">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              aria-label="Locus home"
              className="inline-flex items-center gap-2 font-semibold tracking-tight text-[var(--fg)]"
            >
              <Logo size={22} />
              Locus
            </Link>
            <div
              aria-hidden
              className="h-px w-24 motion-reduce:animate-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--accent), transparent)",
                backgroundSize: "200% 100%",
                animation: "hairline-sweep 3.8s ease-in-out infinite",
              }}
            />
            <p className="max-w-xs text-sm text-[var(--muted-foreground)]">
              The bridge between the things you said you&rsquo;d do and the things you actually did. For macOS.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm"
          >
            <Link
              href="/pricing"
              className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)]"
            >
              Pricing
            </Link>
            <Link
              href="/changelog"
              className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)]"
            >
              Changelog
            </Link>
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
            <Link
              href="/terms"
              className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)]"
            >
              Terms
            </Link>
          </nav>

          <div className="flex flex-col gap-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)] md:text-right">
            <span>v0.1.0</span>
            <span>macOS 14+</span>
            <span>Made in Europe</span>
          </div>
        </div>

        <p className="mt-12 text-xs text-[var(--muted-foreground)] md:mt-16">
          © {year} Locus. All rights reserved.
        </p>
      </PageShell>
    </footer>
  )
}
