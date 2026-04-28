"use client"

import { useState } from "react"

type ButtonState =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "error"; message: string }

export function ManageSubscriptionButton() {
  const [state, setState] = useState<ButtonState>({ kind: "idle" })

  async function openPortal() {
    setState({ kind: "pending" })
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" })

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        setState({
          kind: "error",
          message:
            body?.error === "no_customer"
              ? "We couldn't find a subscription for your account. Please contact support."
              : "Couldn't open the billing portal. Please try again.",
        })
        return
      }

      const body = (await response.json()) as { url?: string }
      if (!body.url) {
        setState({
          kind: "error",
          message: "Portal response was malformed. Please try again.",
        })
        return
      }

      window.location.href = body.url
    } catch {
      setState({
        kind: "error",
        message: "Network error. Please try again.",
      })
    }
  }

  const pending = state.kind === "pending"

  return (
    <>
      <button
        type="button"
        onClick={openPortal}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Redirecting…" : "Manage subscription"}
      </button>
      {state.kind === "error" ? (
        <p
          role="alert"
          className="basis-full text-sm text-[var(--danger,#b00020)]"
        >
          {state.message}
        </p>
      ) : null}
    </>
  )
}
