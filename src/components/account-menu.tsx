"use client"

import * as React from "react"
import Link from "next/link"

import { initialsFromEmail } from "@/lib/auth/initials"
import { signOutAction } from "@/lib/auth/sign-out"
import { cn } from "@/lib/utils"

type AccountMenuProps = {
  email: string
  className?: string
}

export function AccountMenu({ email, className }: AccountMenuProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const firstItemRef = React.useRef<HTMLAnchorElement>(null)

  const initials = initialsFromEmail(email) || "U"

  React.useEffect(() => {
    if (!open) return
    firstItemRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (menuRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("mousedown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("mousedown", onPointerDown)
    }
  }, [open])

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold tracking-wide text-[var(--accent-foreground)] transition-[box-shadow,transform] hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      >
        {initials}
      </button>

      {open ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_95%,transparent)] py-1 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          <Link
            ref={firstItemRef}
            role="menuitem"
            href="/account"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-[var(--fg)] transition-colors hover:bg-[var(--surface-raised)] focus-visible:bg-[var(--surface-raised)] focus-visible:outline-none"
          >
            Account
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-[var(--fg)] transition-colors hover:bg-[var(--surface-raised)] focus-visible:bg-[var(--surface-raised)] focus-visible:outline-none"
            >
              Log out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
