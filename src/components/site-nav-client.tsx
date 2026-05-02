"use client"

import * as React from "react"
import Link from "next/link"
import { LayoutGroup, motion, useMotionValueEvent, useScroll } from "motion/react"

import { AccountMenu } from "@/components/account-menu"
import { buttonVariants } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { signOutAction } from "@/lib/auth/sign-out"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string }

const NAV_ITEMS: NavItem[] = [
  { href: "/#personas", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
]

type SiteNavClientProps = {
  email: string | null
}

export function SiteNavClient({ email }: SiteNavClientProps) {
  const [open, setOpen] = React.useState(false)
  const [compact, setCompact] = React.useState(false)
  const { scrollY } = useScroll()
  const isAuthed = email !== null

  useMotionValueEvent(scrollY, "change", (value) => {
    setCompact(value > 80)
  })

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
      className="sticky top-3 z-50 w-full md:top-5"
    >
      <div className="mx-auto flex max-w-[720px] items-center justify-center px-4">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          data-compact={compact ? "true" : "false"}
          className={cn(
            "relative flex w-full items-center justify-between gap-4 rounded-full border border-[var(--border)] backdrop-blur-xl transition-[padding,background-color] duration-200",
            "shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)]",
            compact
              ? "bg-[color-mix(in_oklab,var(--bg)_94%,transparent)] backdrop-saturate-150 px-3 py-1.5"
              : "bg-[color-mix(in_oklab,var(--bg)_72%,transparent)] px-4 py-2"
          )}
        >
          <Link
            href="/"
            aria-label="Locus home"
            className="inline-flex items-center gap-2 pl-1 font-semibold tracking-tight text-[var(--fg)]"
          >
            <Logo size={18} />
            <span className={cn("text-sm", compact ? "sr-only md:not-sr-only" : "")}>Locus</span>
          </Link>

          <LayoutGroup id="site-nav-hover">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-0.5 md:flex"
            >
              {NAV_ITEMS.map((item) => (
                <NavHoverLink key={item.href} item={item} />
              ))}
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-1.5">
            {isAuthed ? (
              <AccountMenu email={email} className="hidden md:block" />
            ) : (
              <MagneticButton href="/download" className="hidden md:inline-flex">
                <span className={cn(buttonVariants({ size: "sm" }))}>Download</span>
              </MagneticButton>
            )}
            <MobileToggle open={open} onToggle={() => setOpen((v) => !v)} />
          </div>
        </motion.div>
      </div>

      <MobileSheet
        open={open}
        onClose={() => setOpen(false)}
        isAuthed={isAuthed}
      />
    </header>
  )
}

function NavHoverLink({ item }: { item: NavItem }) {
  const [hover, setHover] = React.useState(false)
  return (
    <Link
      href={item.href}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="relative rounded-full px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--fg)]"
    >
      {hover ? (
        <motion.span
          layoutId="site-nav-hover-pill"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute inset-0 rounded-full bg-[var(--surface-raised)]"
        />
      ) : null}
      <span className="relative">{item.label}</span>
    </Link>
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
      className="inline-flex size-8 items-center justify-center rounded-full text-[var(--fg)] transition-colors hover:bg-[var(--surface-raised)] md:hidden"
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
            <path d="M3 7h14" />
            <path d="M3 13h14" />
          </>
        )}
      </svg>
    </button>
  )
}

function MobileSheet({
  open,
  onClose,
  isAuthed,
}: {
  open: boolean
  onClose: () => void
  isAuthed: boolean
}) {
  return (
    <div
      id="site-nav-sheet"
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed inset-x-0 top-14 z-40 mx-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_95%,transparent)] backdrop-blur-xl transition-[opacity,transform] duration-200 md:hidden",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      )}
      aria-hidden={!open}
    >
      <div className="p-4">
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
          {isAuthed ? (
            <>
              <Link
                href="/account"
                onClick={onClose}
                className="rounded-md px-3 py-3 text-base text-[var(--fg)] transition-colors hover:bg-[var(--surface-raised)]"
              >
                Account
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full rounded-md px-3 py-3 text-left text-base text-[var(--fg)] transition-colors hover:bg-[var(--surface-raised)]"
                >
                  Log out
                </button>
              </form>
            </>
          ) : null}
        </nav>
        {!isAuthed ? (
          <Link
            href="/download"
            onClick={onClose}
            className={cn(buttonVariants({ size: "lg" }), "mt-3 w-full")}
          >
            Download for macOS
          </Link>
        ) : null}
      </div>
    </div>
  )
}
