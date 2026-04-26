"use client"

import { useState } from "react"

type Plan = "monthly" | "yearly"

type ButtonState =
  | { kind: "idle" }
  | { kind: "pending"; plan: Plan }
  | { kind: "error"; message: string }

export function UpgradeButtons() {
  const [state, setState] = useState<ButtonState>({ kind: "idle" })

  async function startCheckout(plan: Plan) {
    setState({ kind: "pending", plan })
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan }),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        setState({
          kind: "error",
          message:
            body?.error === "price_not_configured"
              ? "Stripe pricing isn't configured yet. Try again shortly."
              : "Couldn't start checkout. Please try again.",
        })
        return
      }

      const body = (await response.json()) as { url?: string }
      if (!body.url) {
        setState({
          kind: "error",
          message: "Checkout response was malformed. Please try again.",
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

  const monthlyPending = state.kind === "pending" && state.plan === "monthly"
  const yearlyPending = state.kind === "pending" && state.plan === "yearly"
  const anyPending = state.kind === "pending"

  return (
    <>
      <button
        type="button"
        onClick={() => startCheckout("monthly")}
        disabled={anyPending}
        className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {monthlyPending ? "Redirecting…" : "Upgrade to Pro — Monthly"}
      </button>
      <button
        type="button"
        onClick={() => startCheckout("yearly")}
        disabled={anyPending}
        className="inline-flex items-center justify-center rounded-md border border-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-text)] transition hover:bg-[var(--accent-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {yearlyPending ? "Redirecting…" : "Upgrade to Pro — Yearly"}
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
