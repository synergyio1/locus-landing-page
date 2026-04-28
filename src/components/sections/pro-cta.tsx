"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { buildLoginNext } from "@/lib/auth/build-login-next"
import {
  startCheckout,
  type CheckoutCadence,
} from "@/lib/billing/start-checkout"
import { cn } from "@/lib/utils"

const CTA_CLASS = cn(
  buttonVariants({ size: "lg", variant: "default" }),
  "w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
)

type CtaState =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "error"; message: string }

function loginHref(next: string): string {
  return `/login?next=${encodeURIComponent(next)}&notice=signin`
}

export function ProCta({
  cadence,
  isAuthed,
  label,
}: {
  cadence: CheckoutCadence
  isAuthed: boolean
  label: string
}) {
  const pathname = usePathname()
  const [state, setState] = React.useState<CtaState>({ kind: "idle" })

  if (!isAuthed) {
    const fallbackHref = loginHref(buildLoginNext(pathname, ""))

    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
      e.preventDefault()
      const next = buildLoginNext(
        window.location.pathname,
        window.location.hash
      )
      window.location.href = loginHref(next)
    }

    return (
      <a
        href={fallbackHref}
        onClick={handleClick}
        className={CTA_CLASS}
      >
        {label}
      </a>
    )
  }

  async function handleClick() {
    setState({ kind: "pending" })
    const result = await startCheckout(cadence)
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

  const pending = state.kind === "pending"
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={CTA_CLASS}
      >
        {pending ? "Redirecting…" : label}
      </button>
      {state.kind === "error" ? (
        <p
          role="alert"
          className="mt-2 text-sm text-[var(--danger,#b00020)]"
        >
          {state.message}
        </p>
      ) : null}
    </>
  )
}
