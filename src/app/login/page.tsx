import { redirect } from "next/navigation"

import { authCopy } from "@/content/auth"
import { createServerClient } from "@/lib/supabase/server"

import { AuthLayout } from "./auth-layout"
import { LoginForm } from "./login-form"

type PageProps = {
  searchParams: Promise<{ next?: string; error?: string; notice?: string }>
}

function sanitizeNext(next: string | undefined): string {
  if (!next) return "/account"
  if (!next.startsWith("/") || next.startsWith("//")) return "/account"
  return next
}

function errorMessageFor(code: string | undefined): string | undefined {
  if (!code) return undefined
  if (code === "missing_code") return "We couldn't complete your sign-in. Please try again."
  if (code === "exchange_failed") return "That sign-in link is invalid or expired. Please try again."
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
