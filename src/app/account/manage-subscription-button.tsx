"use client"

import { useState } from "react"

import {
  accountButton,
  accountButtonError,
  accountButtonOutline,
} from "./button-styles"

type ButtonState =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "error"; message: string }

export function ManageSubscriptionButton({
  variant = "default",
}: {
  variant?: "default" | "outline"
} = {}) {
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
        className={variant === "outline" ? accountButtonOutline : accountButton}
      >
        {pending ? "Redirecting…" : "Manage subscription"}
      </button>
      {state.kind === "error" ? (
        <p role="alert" className={accountButtonError}>
          {state.message}
        </p>
      ) : null}
    </>
  )
}
