"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

import { accountButtonError, accountButtonOutline } from "./button-styles"

type ButtonState =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "error"; message: string }

type StartTrialButtonProps = {
  label: string
}

// The derived label carries its own reassurance after an em dash
// ("Start 7-day Pro trial — Free for 7 days, no card needed"). Split it so the
// promise sits under the action's weight instead of stretching the pill into a
// sentence.
const SEPARATOR = " — "

function splitLabel(label: string): [string, string | null] {
  const at = label.indexOf(SEPARATOR)
  if (at === -1) return [label, null]
  return [label.slice(0, at), label.slice(at + SEPARATOR.length)]
}

export function StartTrialButton({ label }: StartTrialButtonProps) {
  const router = useRouter()
  const [state, setState] = useState<ButtonState>({ kind: "idle" })

  async function startTrial() {
    setState({ kind: "pending" })
    try {
      const response = await fetch("/api/pro-trial/start", { method: "POST" })

      if (!response.ok) {
        setState({
          kind: "error",
          message: "Couldn't start your trial. Please try again.",
        })
        return
      }

      const body = (await response.json()) as
        | { started: true; expiresAt: string }
        | { started: false; reason: string }

      if (body.started === false) {
        setState({
          kind: "error",
          message: "This account has already used its trial.",
        })
        router.refresh()
        return
      }

      router.replace("/account?welcome=trial")
    } catch {
      setState({
        kind: "error",
        message: "Network error. Please try again.",
      })
    }
  }

  const pending = state.kind === "pending"
  const [action, promise] = splitLabel(label)

  return (
    <>
      <button
        type="button"
        onClick={startTrial}
        disabled={pending}
        // The pill carries two clauses, so it has to read as flowing text and
        // wrap inside the card. `buttonVariants` is an inline-flex, nowrap,
        // fixed-height pill by default — which would push past the card edge
        // on a phone and break the clauses into two columns.
        className={cn(
          accountButtonOutline,
          "block h-auto max-w-full py-2 text-left leading-6 whitespace-normal"
        )}
      >
        {pending ? (
          "Starting trial…"
        ) : (
          <>
            {action}
            {promise ? (
              <>
                <span aria-hidden className="px-1.5 opacity-40">
                  ·
                </span>
                <span className="font-normal opacity-70">{promise}</span>
              </>
            ) : null}
          </>
        )}
      </button>
      {state.kind === "error" ? (
        <p role="alert" className={accountButtonError}>
          {state.message}
        </p>
      ) : null}
    </>
  )
}
