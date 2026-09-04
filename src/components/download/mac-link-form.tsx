"use client"

import * as React from "react"
import posthog from "posthog-js"

import { buttonVariants } from "@/components/ui/button"
import { download } from "@/content/download"
import { cn } from "@/lib/utils"

const copy = download.otherPlatform

type FormState =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "sent" }
  | { kind: "error"; message: string }

/**
 * The non-Mac path: the visitor cannot run the DMG on this device, so the
 * conversion is an email carrying the link to the Mac they already own. The
 * capture also attaches the address to the PostHog person that already holds
 * the ad's first-touch UTMs, which is what joins an Instagram click to a
 * later install.
 */
export function MacLinkForm({ platform }: { platform: string }) {
  const [email, setEmail] = React.useState("")
  const [state, setState] = React.useState<FormState>({ kind: "idle" })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state.kind === "pending") return

    const trimmed = email.trim()
    if (!trimmed.includes("@")) {
      setState({ kind: "error", message: copy.errors.invalid })
      return
    }

    setState({ kind: "pending" })

    let response: Response
    try {
      response = await fetch("/api/mac-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })
    } catch {
      setState({ kind: "error", message: copy.errors.failed })
      return
    }

    if (!response.ok) {
      const message =
        response.status === 400 ? copy.errors.invalid : copy.errors.failed
      setState({ kind: "error", message })
      return
    }

    // Set before capture so the event lands on a person already carrying the
    // email, rather than one that gets the property a request later.
    posthog.setPersonProperties({ email: trimmed })
    posthog.capture("mac_link_requested", { platform })
    setState({ kind: "sent" })
  }

  if (state.kind === "sent") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[color-mix(in_oklab,var(--alive)_45%,transparent)] bg-[color-mix(in_oklab,var(--alive)_10%,transparent)] px-6 py-5"
      >
        <p className="text-base font-medium text-[var(--fg)] md:text-lg">
          {copy.success.headline}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {copy.success.body}
        </p>
      </div>
    )
  }

  const pending = state.kind === "pending"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <label htmlFor="mac-link-email" className="sr-only">
        {copy.label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="mac-link-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state.kind === "error") setState({ kind: "idle" })
          }}
          placeholder={copy.placeholder}
          aria-invalid={state.kind === "error"}
          aria-describedby={state.kind === "error" ? "mac-link-error" : undefined}
          className="h-11 min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-5 text-base text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
        />
        <button
          type="submit"
          disabled={pending}
          className={cn(buttonVariants({ size: "lg" }), "shrink-0")}
        >
          {pending ? copy.pending : copy.cta}
        </button>
      </div>
      {state.kind === "error" ? (
        <p
          id="mac-link-error"
          role="alert"
          className="text-sm text-[var(--danger,#b00020)]"
        >
          {state.message}
        </p>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">{copy.note}</p>
      )}
    </form>
  )
}
