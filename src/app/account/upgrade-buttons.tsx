"use client"

import { useState } from "react"

import {
  startCheckout,
  type CheckoutCadence,
} from "@/lib/billing/start-checkout"

import {
  accountButton,
  accountButtonError,
  accountButtonOutline,
} from "./button-styles"

type ButtonState =
  | { kind: "idle" }
  | { kind: "pending"; plan: CheckoutCadence }
  | { kind: "error"; message: string }

/**
 * `emphasis` is "secondary" wherever Download for Mac already owns the filled
 * pill (trial and paid), so two Cobalt blocks never compete in one row.
 */
export function UpgradeButtons({
  emphasis = "primary",
}: {
  emphasis?: "primary" | "secondary"
} = {}) {
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
        className={
          emphasis === "primary" ? accountButton : accountButtonOutline
        }
      >
        {monthlyPending ? "Redirecting…" : "Upgrade to Pro — Monthly"}
      </button>
      <button
        type="button"
        onClick={() => handleClick("yearly")}
        disabled={anyPending}
        className={accountButtonOutline}
      >
        {yearlyPending ? "Redirecting…" : "Upgrade to Pro — Yearly"}
      </button>
      {state.kind === "error" ? (
        <p role="alert" className={accountButtonError}>
          {state.message}
        </p>
      ) : null}
    </>
  )
}
