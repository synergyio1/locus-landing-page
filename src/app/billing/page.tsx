import Link from "next/link"
import { redirect } from "next/navigation"

import { createServerClient } from "@/lib/supabase/server"

import { ManageSubscriptionButton } from "../account/manage-subscription-button"

export default async function BillingPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/billing")
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-3 text-sm text-[var(--fg)]/70">
        Update your card, view invoices, switch plans, or cancel — all in
        Stripe&apos;s hosted portal.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ManageSubscriptionButton />
      </div>

      <div className="mt-12 border-t border-[var(--border)] pt-6">
        <Link
          href="/account"
          className="text-sm text-[var(--accent-text)] underline-offset-4 hover:underline"
        >
          ← Back to your account
        </Link>
      </div>
    </section>
  )
}
