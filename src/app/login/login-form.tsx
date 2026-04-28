"use client"

import { useState } from "react"

import { createBrowserClient } from "@/lib/supabase/browser"

type LoginFormProps = {
  next: string
  errorMessage?: string
  noticeMessage?: string
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string }

function buildRedirectUrl(next: string): string {
  const origin =
    (typeof window !== "undefined" && window.location.origin) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    ""
  const url = new URL("/auth/callback", origin || "http://localhost")
  url.searchParams.set("next", next)
  return url.toString()
}

export function LoginForm({ next, errorMessage, noticeMessage }: LoginFormProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [email, setEmail] = useState("")

  async function signInWithProvider(provider: "google" | "apple") {
    setStatus({ kind: "sending" })
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: buildRedirectUrl(next) },
    })
    if (error) setStatus({ kind: "error", message: error.message })
  }

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ kind: "sending" })
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: buildRedirectUrl(next) },
    })
    if (error) {
      setStatus({ kind: "error", message: error.message })
      return
    }
    setStatus({ kind: "sent" })
  }

  const disabled = status.kind === "sending"

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      {noticeMessage ? (
        <p
          role="status"
          className="rounded-md bg-[#0047AB]/10 px-3 py-2 text-sm text-[#0047AB]"
        >
          {noticeMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-900">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => signInWithProvider("google")}
          disabled={disabled}
          className="inline-flex w-full items-center justify-center rounded-md border border-[var(--fg)]/20 px-4 py-2 text-sm font-medium transition hover:bg-[var(--fg)]/5 disabled:opacity-50"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => signInWithProvider("apple")}
          disabled={disabled}
          className="inline-flex w-full items-center justify-center rounded-md border border-[var(--fg)]/20 px-4 py-2 text-sm font-medium transition hover:bg-[var(--fg)]/5 disabled:opacity-50"
        >
          Continue with Apple
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[var(--fg)]/50">
        <span className="h-px flex-1 bg-[var(--fg)]/15" />
        or
        <span className="h-px flex-1 bg-[var(--fg)]/15" />
      </div>

      <form onSubmit={sendMagicLink} className="grid gap-3">
        <label className="grid gap-1 text-sm">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            autoComplete="email"
            className="rounded-md border border-[var(--fg)]/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--fg)]/50"
          />
        </label>
        <button
          type="submit"
          disabled={disabled || email.length === 0}
          className="inline-flex w-full items-center justify-center rounded-md bg-[#0047AB] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {status.kind === "sending" ? "Sending…" : "Send magic link"}
        </button>
      </form>

      {status.kind === "sent" ? (
        <p role="status" className="text-sm text-[var(--fg)]/70">
          Check your email for a sign-in link.
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-red-600">
          {status.message}
        </p>
      ) : null}
    </div>
  )
}
