"use client"

import * as React from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { PageShell } from "@/components/layout/page-shell"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string }

const NAV_ITEMS: NavItem[] = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
]

export function SiteNav() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      data-slot="site-nav"
      className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--bg)_72%,transparent)]"
    >
      <PageShell>
        <div className="flex h-14 items-center justify-between gap-6">
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

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-md px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)] md:inline-block"
            >
              Login
            </Link>
            <Link
              href="/download"
              className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
            >
              Download
            </Link>
            <MobileToggle open={open} onToggle={() => setOpen((v) => !v)} />
          </div>
        </div>
      </PageShell>

      <MobileSheet open={open} onClose={() => setOpen(false)} />
    </header>
  )
}

function MobileToggle({
  open,
  onToggle,
}: {
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="site-nav-sheet"
      onClick={onToggle}
      className="inline-flex size-9 items-center justify-center rounded-md text-[var(--fg)] transition-colors hover:bg-[var(--surface-raised)] md:hidden"
    >
      <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        className="size-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        {open ? (
          <>
            <path d="M5 5l10 10" />
            <path d="M15 5L5 15" />
          </>
        ) : (
          <>
            <path d="M3 6h14" />
            <path d="M3 10h14" />
            <path d="M3 14h14" />
          </>
        )}
      </svg>
    </button>
  )
}

function MobileSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <div
      id="site-nav-sheet"
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed inset-x-0 top-14 z-40 border-b border-[var(--border)] bg-[var(--bg)] transition-[opacity,transform] duration-200 md:hidden",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      )}
      aria-hidden={!open}
    >
      <PageShell className="py-6">
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="rounded-md px-3 py-3 text-base text-[var(--fg)] transition-colors hover:bg-[var(--surface-raised)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={onClose}
            className="rounded-md px-3 py-3 text-base text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-raised)]"
          >
            Login
          </Link>
        </nav>
        <Link
          href="/download"
          onClick={onClose}
          className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")}
        >
          Download for macOS
        </Link>
      </PageShell>
    </div>
  )
}
