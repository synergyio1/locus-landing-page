"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { buttonVariants } from "@/components/ui/button"
import { GoogleMark } from "@/components/ui/provider-marks"
import { createBrowserClient } from "@/lib/supabase/browser"
import { cn } from "@/lib/utils"

type LoginFormProps = {
  next: string
  errorMessage?: string
  noticeMessage?: string
  submitLabel?: string
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string }

function siteOrigin(): string {
  return (
    (typeof window !== "undefined" && window.location.origin) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost"
  )
}

/** Google hands back a PKCE code, which only `/auth/callback` knows what to do with. */
function buildOAuthRedirectUrl(next: string): string {
  const url = new URL("/auth/callback", siteOrigin())
  url.searchParams.set("next", next)
  return url.toString()
}

/**
 * For an email link this is not a route the browser is sent to — Supabase copies
 * it verbatim into the template as `{{ .RedirectTo }}`, and `/auth/confirm` reads
 * it to learn where to land and which product asked. So it names the destination
 * itself rather than pointing back at the confirm route: nesting the confirm URL
 * inside its own query string meant a second `?` and double-encoded slashes in
 * every link, for no gain.
 *
 * Supabase validates it against the project's redirect allow list and silently
 * substitutes the Site URL if it fails — and this project's Site URL is the macOS
 * app's scheme, which `/auth/confirm` reads as an app sign-in. The allow list is
 * a wildcard over the site, so any same-site path is safe here.
 */
function buildEmailRedirectUrl(next: string): string {
  return new URL(next, siteOrigin()).toString()
}

/**
 * Supabase reports a failed email link in the URL *fragment*, which never reaches
 * the server — so a stale link arrives at the callback looking like a request with
 * no code at all, and the page renders a vague apology while `#error_code=
 * otp_expired` sits in the address bar.
 */
function readHashError(): string | undefined {
  if (typeof window === "undefined") return undefined
  const hash = window.location.hash
  if (!hash.includes("error")) return undefined

  const params = new URLSearchParams(hash.slice(1))
  const code = params.get("error_code") ?? params.get("error")
  if (!code) return undefined

  if (code === "otp_expired") {
    return "That sign-in link was already used or has expired. Send yourself a fresh one."
  }
  if (code === "access_denied") {
    return "That sign-in was declined. Please try again."
  }
  return "We couldn't complete your sign-in. Please try again."
}

/**
 * The fragment is state owned by the browser, not by React, and the server never
 * sees it — so it is read through `useSyncExternalStore`, which renders the
 * server's answer (nothing) during hydration and the real one straight after.
 * The snapshot is taken once and cached per mount: it has to stay stable across
 * renders, and the effect below erases the fragment it was read from.
 */
function useHashError(): string | undefined {
  const [store] = useState(() => {
    let snapshot: string | undefined
    let taken = false
    return {
      subscribe: () => () => {},
      getSnapshot: () => {
        if (!taken) {
          taken = true
          snapshot = readHashError()
        }
        return snapshot
      },
      getServerSnapshot: () => undefined,
    }
  })

  const message = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  )

  // Left in the address bar the fragment would re-raise this error on every
  // reload, long after the user has asked for a fresh link.
  useEffect(() => {
    if (!message) return
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`
    )
  }, [message])

  return message
}

/**
 * Supabase's auth errors are written for developers ("Unsupported provider:
 * provider is not enabled", "AuthApiError: ..."). Rendering them raw leaks
 * implementation detail into the one screen where trust matters most, so map the
 * cases we can recognise and fall back to something plain. The original is kept on
 * the console for debugging.
 */
function friendlyError(raw: string): string {
  const message = raw.toLowerCase()
  // Two different ceilings, and telling someone to "wait a minute" when the
  // project's hourly quota is gone sends them back to try again and fail again.
  // That one is not about them at all, so it should not read like a scolding.
  if (message.includes("email rate limit exceeded")) {
    return "We've hit our own limit on sign-in emails for the moment. This one is on us — try again a little later, or sign in with Google."
  }
  if (message.includes("rate limit") || message.includes("too many")) {
    return "You just asked for a link. Give it a few seconds, then try again."
  }
  if (message.includes("invalid") && message.includes("email")) {
    return "That address doesn't look right. Check it and try again."
  }
  return "We couldn't sign you in. Please try again."
}

export function LoginForm({
  next,
  errorMessage,
  noticeMessage,
  submitLabel = "Send magic link",
}: LoginFormProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [email, setEmail] = useState("")
  const hashError = useHashError()

  async function signInWithGoogle() {
    setStatus({ kind: "sending" })
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: buildOAuthRedirectUrl(next) },
    })
    if (error) {
      console.error("[auth] google sign-in failed:", error.message)
      setStatus({ kind: "error", message: friendlyError(error.message) })
    }
  }

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ kind: "sending" })
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: buildEmailRedirectUrl(next) },
    })
    if (error) {
      console.error("[auth] magic link failed:", error.message)
      setStatus({ kind: "error", message: friendlyError(error.message) })
      return
    }
    setStatus({ kind: "sent", email })
  }

  const disabled = status.kind === "sending"
  // A fragment error describes the click that just failed, so it outranks the
  // server-rendered one, which may be describing the same failure more vaguely.
  const bannerError = hashError ?? errorMessage

  // The link is out — swap the whole panel rather than appending a line under a
  // form that still looks untouched.
  if (status.kind === "sent") {
    return (
      <div role="status" className="flex flex-col gap-3">
        <span
          aria-hidden
          className="flex size-9 items-center justify-center rounded-full bg-[var(--accent-subtle)]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M4 6.5h16v11H4z" />
            <path d="M4.5 7l7.5 5.5L19.5 7" />
          </svg>
        </span>
        <p className="text-base font-medium text-[var(--fg)]">Check your inbox</p>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          We sent a one-time sign-in link to{" "}
          <span className="font-medium text-[var(--fg)]">{status.email}</span>. It
          expires shortly — open it on this device.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "self-start px-0"
          )}
        >
          Use a different address
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {noticeMessage ? (
        <p
          role="status"
          className="rounded-xl border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--accent-subtle)] px-3.5 py-2.5 text-sm text-[var(--accent-text)]"
        >
          {noticeMessage}
        </p>
      ) : null}
      {bannerError ? (
        <p
          role="alert"
          className="rounded-xl border border-[color-mix(in_oklab,var(--warn)_35%,transparent)] bg-[color-mix(in_oklab,var(--warn)_8%,transparent)] px-3.5 py-2.5 text-sm text-[var(--warn)]"
        >
          {bannerError}
        </p>
      ) : null}

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "w-full bg-[var(--bg)] hover:bg-[var(--surface-raised)]"
        )}
      >
        <GoogleMark />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        <span aria-hidden className="h-px flex-1 bg-[var(--border)]" />
        or with email
        <span aria-hidden className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form onSubmit={sendMagicLink} className="flex flex-col gap-3">
        <label
          htmlFor="auth-email"
          className="text-[13px] font-medium text-[var(--fg)]"
        >
          Email
        </label>
        <input
          id="auth-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          autoComplete="email"
          placeholder="you@work.com"
          className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 text-sm text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] hover:border-[color-mix(in_oklab,var(--fg)_20%,transparent)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-1 w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
          )}
        >
          {status.kind === "sending" ? "Sending…" : submitLabel}
        </button>
      </form>

      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-[var(--warn)]">
          {status.message}
        </p>
      ) : null}
    </div>
  )
}
