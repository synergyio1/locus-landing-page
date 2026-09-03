"use client"

import { useEffect, useRef } from "react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AutoConfirmProps = {
  tokenHash: string
  type: string
  next?: string
  label: string
}

/**
 * The form that spends the token, and the script that submits it for you.
 *
 * The button exists because a link that signs you in on a plain GET gets spent by
 * the mail scanners that fetch every URL in a message before the recipient sees
 * it. But those scanners don't run scripts — so submitting on mount costs the
 * protection nothing and gives back the one click people expect from an email
 * link: open it, and you land signed in.
 *
 * The button is the no-JavaScript path, and stays a real submit control. The
 * effect drives it through the DOM rather than React state on purpose: the page
 * is navigating away, so there is nothing worth re-rendering, and it keeps the
 * server and client markup identical.
 */
export function AutoConfirm({ tokenHash, type, next, label }: AutoConfirmProps) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    const button = form.querySelector<HTMLButtonElement>("button[type=submit]")
    if (button) {
      // Spending the token twice fails the second time, so close the manual
      // path as the automatic one opens.
      button.disabled = true
      button.textContent = "Signing you in…"
    }
    form.requestSubmit()
  }, [])

  return (
    <form
      ref={formRef}
      method="post"
      action="/auth/confirm/verify"
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="token_hash" value={tokenHash} />
      <input type="hidden" name="type" value={type} />
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <button
        type="submit"
        className={cn(
          buttonVariants({ size: "lg" }),
          "w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
        )}
      >
        {label}
      </button>
      <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
        Didn&rsquo;t start this? Close the tab — nothing happens until you
        confirm.
      </p>
    </form>
  )
}
