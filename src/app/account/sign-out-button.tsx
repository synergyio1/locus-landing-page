"use client"

import { useTransition } from "react"

import { signOutAction } from "@/lib/auth/sign-out"

export function SignOutButton() {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      onClick={() => startTransition(() => signOutAction())}
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md border border-[var(--fg)]/20 px-4 py-2 text-sm font-medium text-[var(--fg)] transition hover:bg-[var(--fg)]/5 disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out everywhere"}
    </button>
  )
}
