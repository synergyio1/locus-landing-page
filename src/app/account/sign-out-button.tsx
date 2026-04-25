"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { createBrowserClient } from "@/lib/supabase/browser"

export function SignOutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleSignOut() {
    setPending(true)
    const supabase = createBrowserClient()
    await supabase.auth.signOut({ scope: "global" })
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md border border-[var(--fg)]/20 px-4 py-2 text-sm font-medium text-[var(--fg)] transition hover:bg-[var(--fg)]/5 disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out everywhere"}
    </button>
  )
}
