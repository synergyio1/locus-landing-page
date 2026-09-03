import { redirect } from "next/navigation"

import { authCopy } from "@/content/auth"
import { sanitizeNext } from "@/lib/auth/sanitize-next"
import { createServerClient } from "@/lib/supabase/server"

import { AuthLayout } from "../login/auth-layout"
import { LoginForm } from "../login/login-form"

type PageProps = {
  searchParams: Promise<{ next?: string }>
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
