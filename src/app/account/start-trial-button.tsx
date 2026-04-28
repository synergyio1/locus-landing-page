"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type ButtonState =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "error"; message: string }

type StartTrialButtonProps = {
  label: string
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

  return (
    <>
      <button
        type="button"
        onClick={startTrial}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-md border border-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-text)] transition hover:bg-[var(--accent-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Starting trial…" : label}
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
