"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AccountMenu } from "@/components/account-menu"
import { PageShell } from "@/components/layout/page-shell"
import { Logo } from "@/components/ui/logo"
import { signOutAction } from "@/lib/auth/sign-out"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string }

// Packs hidden 2026-08-30 (Luis): the page is being reworked and comes back
// later. The route, content, and e2e specs stay live — restore the item here
// (plus footer link, /app secondary CTA, and sitemap entries) to relaunch.
const NAV_ITEMS: NavItem[] = [
  { href: "/#manifesto", label: "Manifesto" },
  { href: "/app", label: "App" },
  // { href: "/packs", label: "Packs" },
  { href: "/pricing", label: "Pricing" },
]

type SiteNavClientProps = {
  email: string | null
}

/**
 * Site header (2026-08-17, redesign).
 *
 * Structure is the settled one — mark left, three links dead-centre, a
 * single "Log in" right (the hero owns Download) — but the chrome is new:
 *
 *  · Progressive glass. Stacked backdrop layers, taller than the bar,
 *    whose blur + canvas tint dissolve through staggered bottom masks.
 *    There is no seam where the header "ends" — footage and page content
 *    simply come into focus beneath it. Same at every scroll position,
 *    no JS.
 *  · True centre. A 1fr/auto/1fr grid keeps the links on the page's
 *    axis regardless of how wide the logo or the right cluster is.
 *  · Focus, not pills. Hovering one link softens its siblings instead of
 *    drawing a background behind it. Active route sits in full ink.
 *  · Ink pill for Log in — the same rounded-full language as the hero
 *    buttons, so it reads as a real action rather than a form control.
 */
export function SiteNavClient({ email }: SiteNavClientProps) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const isAuthed = email !== null

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
      data-state={open ? "open" : "closed"}
      className="fixed inset-x-0 top-0 z-50"
    >
      <ProgressiveGlass />

      <PageShell className="grid h-14 grid-cols-[1fr_auto_1fr] items-center md:h-16">
        {/* Left — the mark, optically flush with the content edge. */}
        <div className="flex items-center">
          <Link
            href="/"
            aria-label="Locus home"
            className="-ml-1 inline-flex items-center rounded-full p-1 text-[var(--fg)] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Logo size={34} />
          </Link>
        </div>

        {/* Centre — primary links. Sibling-dim on hover; no pill. */}
        <nav
          aria-label="Primary"
          className="group/nav col-start-2 hidden items-center gap-1 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = item.href === pathname
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-[14px] font-medium tracking-[-0.01em] transition-[color,opacity] duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                  active
                    ? "text-[var(--fg)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--fg)]",
                  "group-hover/nav:not-hover:opacity-55"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right — one action. */}
        <div className="col-start-3 flex items-center justify-end gap-2">
          {isAuthed ? (
            <AccountMenu email={email} className="hidden md:block" />
          ) : (
            <Link
              href="/login"
              className={cn(
                "hidden h-8 items-center rounded-full bg-[var(--fg)] px-3.5 text-[13px] font-medium text-[var(--bg)] md:inline-flex",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
                "transition-[background-color,transform,box-shadow] duration-200 hover:bg-[color-mix(in_oklab,var(--fg)_86%,white)] active:scale-[0.97]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              )}
            >
              Log in
            </Link>
          )}
          <MobileToggle open={open} onToggle={() => setOpen((v) => !v)} />
        </div>
      </PageShell>

      <MobileSheet
        open={open}
        onClose={() => setOpen(false)}
        isAuthed={isAuthed}
      />
    </header>
  )
}

/**
 * The header's only surface — a progressive blur, not a band.
 *
 * Three backdrop layers, each confined to a soft band by a bottom mask and
 * each blurring what the layers beneath it already painted, so the blur
 * compounds toward the top and thins to nothing at the tail. A canvas tint
 * rides on top to carry the row and is gone before the blur is. The whole
 * thing is taller than the bar, so nothing ever "ends" at the row's edge.
 */
function ProgressiveGlass() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+4rem)]"
    >
      <div className="absolute inset-0 backdrop-blur-[3px] mask-b-from-55% mask-b-to-100%" />
      <div className="absolute inset-0 backdrop-blur-[8px] mask-b-from-40% mask-b-to-80%" />
      <div className="absolute inset-0 backdrop-blur-[16px] backdrop-saturate-150 mask-b-from-25% mask-b-to-60%" />
      <div className="absolute inset-0 [background:linear-gradient(to_bottom,color-mix(in_oklab,var(--bg)_84%,transparent)_0%,color-mix(in_oklab,var(--bg)_74%,transparent)_25%,color-mix(in_oklab,var(--bg)_54%,transparent)_50%,color-mix(in_oklab,var(--bg)_28%,transparent)_75%,color-mix(in_oklab,var(--bg)_8%,transparent)_92%,transparent_100%)]" />
    </div>
  )
}

function MobileToggle({
  open,
  onToggle,
}: {
  open: boolean
  onToggle: () => void
}) {
  const bar =
    "absolute left-1/2 top-1/2 h-[1.5px] w-[18px] -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="site-nav-sheet"
      onClick={onToggle}
      className="relative -mr-2 inline-flex size-9 items-center justify-center rounded-full text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden"
    >
      <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      <span
        aria-hidden
        className={cn(bar, open ? "rotate-45" : "-translate-y-[4px]")}
      />
      <span
        aria-hidden
        className={cn(bar, open ? "-rotate-45" : "translate-y-[4px]")}
      />
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
  const item =
    "block rounded-xl px-3 py-3 text-[17px] font-medium tracking-[-0.01em] text-[var(--fg)] transition-colors hover:bg-[color-mix(in_oklab,var(--fg)_6%,transparent)]"
  return (
    <>
      {/* Scrim — tap anywhere outside the sheet to close. Sits behind the
          bar and the sheet, above the page. */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 -z-20 bg-[color-mix(in_oklab,var(--fg)_18%,transparent)] transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      {/* The sheet starts at the very top and pads past the bar, so the bar
          and the menu share one continuous surface — no seam between them. */}
      <div
        id="site-nav-sheet"
        data-state={open ? "open" : "closed"}
        className={cn(
          "absolute inset-x-0 top-0 -z-[5] rounded-b-[24px] pt-14 md:hidden",
          "bg-[color-mix(in_oklab,var(--bg)_94%,transparent)] backdrop-blur-xl backdrop-saturate-150",
          "shadow-[0_24px_48px_-24px_rgba(11,26,51,0.28)]",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
        aria-hidden={!open}
      >
        <PageShell className="pb-6 pt-2">
          <nav aria-label="Mobile" className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((navItem) => (
              <Link
                key={navItem.href}
                href={navItem.href}
                onClick={onClose}
                className={item}
              >
                {navItem.label}
              </Link>
            ))}
            {isAuthed ? (
              <>
                <Link href="/account" onClick={onClose} className={item}>
                  Account
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className={cn(item, "w-full text-left")}
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-[var(--fg)] px-5 text-[15px] font-medium text-[var(--bg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform active:scale-[0.98]"
              >
                Log in
              </Link>
            )}
          </nav>
        </PageShell>
      </div>
    </>
  )
}
