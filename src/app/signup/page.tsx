import { redirect } from "next/navigation"

import { createServerClient } from "@/lib/supabase/server"

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
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Create your Locus account</h1>
      <p className="mt-2 text-sm text-[var(--fg)]/60">
        Enter your email — we&apos;ll send you a secure sign-in link. No password required.
      </p>
      <div className="mt-8">
        <LoginForm next={safeNext} />
      </div>
    </section>
  )
}
