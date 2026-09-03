import { redirect } from "next/navigation"

import { authCopy } from "@/content/auth"
import { sanitizeNext } from "@/lib/auth/sanitize-next"
import { createServerClient } from "@/lib/supabase/server"

import { AuthLayout } from "./auth-layout"
import { LoginForm } from "./login-form"

type PageProps = {
  searchParams: Promise<{ next?: string; error?: string; notice?: string }>
}

/**
 * Every one of these lands the user back here mid-sign-in, so each message has to
 * say what to do next. `link_expired` is the common one: a link works once, and
 * an inbox scanner or a second click can spend it first.
 */
function errorMessageFor(code: string | undefined): string | undefined {
  if (!code) return undefined
  if (code === "link_expired")
    return "That sign-in link was already used or has expired. Send yourself a fresh one."
  if (code === "missing_token")
    return "That link is missing its sign-in code. Send yourself a fresh one."
  if (code === "missing_code" || code === "exchange_failed")
    return "We couldn't complete your sign-in. Please try again."
  return "Something went wrong. Please try again."
}

function noticeMessageFor(code: string | undefined): string | undefined {
  if (code === "signin") return "Please sign in to continue."
  return undefined
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { next, error, notice } = await searchParams
  const safeNext = sanitizeNext(next)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(safeNext)
  }

  return (
    <AuthLayout copy={authCopy.login}>
      <LoginForm
        next={safeNext}
        errorMessage={errorMessageFor(error)}
        noticeMessage={noticeMessageFor(notice)}
        submitLabel={authCopy.login.submitLabel}
      />
    </AuthLayout>
  )
}
