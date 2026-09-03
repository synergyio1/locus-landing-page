"use client"

import { useState } from "react"

import { formatUsdCentsCompact } from "@/lib/billing/format-money"
import { startCreditCheckout } from "@/lib/billing/start-credit-checkout"

import {
  accountButton,
  accountButtonError,
  accountButtonOutline,
} from "./button-styles"

export type CreditPackOption = {
  priceId: string
  unitAmountCents: number
}

type ButtonState =
  | { kind: "idle" }
  | { kind: "pending"; priceId: string }
  | { kind: "error"; message: string }

export function BuyCreditsButtons({ packs }: { packs: CreditPackOption[] }) {
  const [state, setState] = useState<ButtonState>({ kind: "idle" })

  async function handleClick(priceId: string) {
    setState({ kind: "pending", priceId })
    const result = await startCreditCheckout(priceId, crypto.randomUUID())
    switch (result.kind) {
      case "ok":
        // assign() rather than `location.href =` so the React Compiler's
        // immutability rule doesn't flag the write inside the map closure.
        window.location.assign(result.url)
        return
      case "credit_price_not_allowed":
        setState({
          kind: "error",
          message: "That pack isn't available right now. Try another amount.",
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

  const anyPending = state.kind === "pending"

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {packs.map((pack, index) => {
        const pending = state.kind === "pending" && state.priceId === pack.priceId
        const amount = formatUsdCentsCompact(pack.unitAmountCents)
        return (
          <button
            key={pack.priceId}
            type="button"
            onClick={() => handleClick(pack.priceId)}
            disabled={anyPending}
            className={index === 0 ? accountButton : accountButtonOutline}
          >
            {pending ? "Redirecting…" : `Add ${amount}`}
          </button>
        )
      })}
      {state.kind === "error" ? (
        <p role="alert" className={accountButtonError}>
          {state.message}
        </p>
      ) : null}
    </div>
  )
}
