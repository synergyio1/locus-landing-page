import { redirect } from "next/navigation"

import { createServerClient } from "@/lib/supabase/server"

import { SignOutButton } from "./sign-out-button"

export default async function AccountPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/account")
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Your account</h1>
      <dl className="mt-8 grid gap-4">
        <div>
          <dt className="text-sm text-[var(--fg)]/60">Signed in as</dt>
          <dd className="mt-1 text-lg">{user.email}</dd>
        </div>
      </dl>
      <div className="mt-10">
        <SignOutButton />
      </div>
    </section>
  )
}
