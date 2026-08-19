import { redirect } from "next/navigation"

import { authCopy } from "@/content/auth"
import { createServerClient } from "@/lib/supabase/server"

import { AuthLayout } from "../login/auth-layout"
import { LoginForm } from "../login/login-form"

type PageProps = {
  searchParams: Promise<{ next?: string }>
}

function sanitizeNext(next: string | undefined): string {
  if (!next) return "/account"
  if (!next.startsWith("/") || next.startsWith("//")) return "/account"
  return next
}

export default async function SignupPage({ searchParams }: PageProps) {
  const { next } = await searchParams
  const safeNext = sanitizeNext(next)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(safeNext)
  }

  return (
    <AuthLayout copy={authCopy.signup}>
      <LoginForm next={safeNext} submitLabel={authCopy.signup.submitLabel} />
    </AuthLayout>
  )
}
