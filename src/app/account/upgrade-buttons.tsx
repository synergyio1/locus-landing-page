"use client"

import { useState } from "react"

import {
  startCheckout,
  type CheckoutCadence,
} from "@/lib/billing/start-checkout"

type ButtonState =
  | { kind: "idle" }
  | { kind: "pending"; plan: CheckoutCadence }
  | { kind: "error"; message: string }

export function UpgradeButtons() {
  const [state, setState] = useState<ButtonState>({ kind: "idle" })

  async function handleClick(plan: CheckoutCadence) {
    setState({ kind: "pending", plan })
    const result = await startCheckout(plan)
    switch (result.kind) {
      case "ok":
        window.location.href = result.url
        return
      case "price_not_configured":
        setState({
          kind: "error",
          message: "Stripe pricing isn't configured yet. Try again shortly.",
        })
        return
      case "malformed_response":
        setState({
          kind: "error",
          message: "Checkout response was malformed. Please try again.",
        })
        return
      case "network_error":
        setState({
          kind: "error",
          message: "Network error. Please try again.",
        })
        return
      case "http_error":
        setState({
          kind: "error",
          message: "Couldn't start checkout. Please try again.",
        })
        return
    }
  }

  const monthlyPending = state.kind === "pending" && state.plan === "monthly"
  const yearlyPending = state.kind === "pending" && state.plan === "yearly"
  const anyPending = state.kind === "pending"

  return (
    <>
      <button
        type="button"
        onClick={() => handleClick("monthly")}
        disabled={anyPending}
        className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {monthlyPending ? "Redirecting…" : "Upgrade to Pro — Monthly"}
      </button>
      <button
        type="button"
        onClick={() => handleClick("yearly")}
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
