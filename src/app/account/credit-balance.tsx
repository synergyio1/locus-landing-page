"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { formatUsdCents } from "@/lib/billing/format-money"

// Stripe redirects back the moment the payment is authorised, but the grant
// arrives on the webhook a beat later. Poll on the same cadence the Mac app
// uses for its checkout return (2s, giving up after 30s).
const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 30_000

type PollState = "idle" | "waiting" | "settled" | "timeout"

export function CreditBalance({
  balanceCents,
  checkoutPending,
}: {
  balanceCents: number
  checkoutPending: boolean
}) {
  const router = useRouter()
  const [balance, setBalance] = useState(balanceCents)
  const [serverBalance, setServerBalance] = useState(balanceCents)
  const [pollState, setPollState] = useState<PollState>(
    checkoutPending ? "waiting" : "idle"
  )

  // A refresh after the grant lands re-renders the server component with the
  // new balance; adopt it rather than keeping the stale local copy.
  if (balanceCents !== serverBalance) {
    setServerBalance(balanceCents)
    setBalance(balanceCents)
  }

  useEffect(() => {
    if (!checkoutPending) return

    const startedAt = Date.now()
    const balanceOnReturn = balanceCents
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    async function poll() {
      if (cancelled) return
      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        setPollState("timeout")
        return
      }
      try {
        const response = await fetch("/api/credits/balance", {
          cache: "no-store",
        })
        if (response.ok) {
          const body = (await response.json()) as {
            creditBalanceCents?: unknown
          }
          const next = body?.creditBalanceCents
          if (typeof next === "number" && next !== balanceOnReturn) {
            if (cancelled) return
            setBalance(next)
            setPollState("settled")
            // Drop ?credits=pending and re-read the server snapshot so the
            // rest of the card (copy, empty state) agrees with the balance.
            router.replace("/account")
            router.refresh()
            return
          }
        }
      } catch {
        // Transient — keep polling until the deadline.
      }
      if (cancelled) return
      timer = setTimeout(poll, POLL_INTERVAL_MS)
    }

    timer = setTimeout(poll, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [checkoutPending, balanceCents, router])

  return (
    <>
      <p
        data-testid="remote-credits-balance"
        className="font-mono text-sm text-[var(--fg)]"
      >
        {formatUsdCents(balance)}
      </p>
      {pollState === "waiting" ? (
        <p
          role="status"
          className="basis-full text-sm text-[var(--muted-foreground)]"
        >
          Payment received — adding your credits…
        </p>
      ) : null}
      {pollState === "timeout" ? (
        <p
          role="status"
          className="basis-full text-sm text-[var(--muted-foreground)]"
        >
          Still settling with Stripe. Your balance will update shortly —
          refresh in a minute.
        </p>
      ) : null}
    </>
  )
}
