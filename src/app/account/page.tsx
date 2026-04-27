import Link from "next/link"
import { redirect } from "next/navigation"

import { deriveAccountView, type PlanLabel } from "@/lib/account/derive"
import { loadAccountSnapshot } from "@/lib/account/snapshot"
import { createServerClient } from "@/lib/supabase/server"

import { SignOutButton } from "./sign-out-button"
import { UpgradeButtons } from "./upgrade-buttons"

const PLAN_CHIP_TONES: Record<PlanLabel, string> = {
  Free: "bg-[var(--surface-raised)] text-[var(--fg)]/70",
  Trial: "bg-[var(--accent-subtle)] text-[var(--accent-text)]",
  Pro: "bg-[var(--accent)] text-[var(--accent-foreground)]",
}

type AccountPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function AccountPage({
  searchParams,
}: AccountPageProps = {}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/account")
  }

  const snapshot = await loadAccountSnapshot(user.id, user.email ?? "")
  const view = deriveAccountView(snapshot)

  const params = (await searchParams) ?? {}
  const showWelcome = params.welcome === "1"

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      {showWelcome ? (
        <div
          role="status"
          data-testid="welcome-banner"
          className="mb-8 rounded-md border border-[var(--accent)] bg-[var(--accent-subtle)] px-4 py-3 text-sm text-[var(--accent-text)]"
        >
          <strong className="font-semibold">Welcome to Pro.</strong>{" "}
          Your subscription is being set up — refresh in a moment if your plan
          chip still says Free.
        </div>
      ) : null}

      <h1 className="text-3xl font-semibold tracking-tight">Your account</h1>

      <dl className="mt-8 grid gap-6">
        <div>
          <dt className="text-sm text-[var(--fg)]/60">Signed in as</dt>
          <dd className="mt-1 text-lg">{view.email}</dd>
        </div>

        <div>
          <dt className="text-sm text-[var(--fg)]/60">Plan</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-3">
            <span
              data-testid="plan-chip"
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${PLAN_CHIP_TONES[view.planLabel]}`}
            >
              {view.planLabel}
            </span>
            {view.dateLine ? (
              <span className="text-sm text-[var(--fg)]/70">
                {view.dateLine}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {view.plan === "free" ? (
          <UpgradeButtons />
        ) : view.primaryCta.label === "Manage subscription" ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {view.primaryCta.label}
          </button>
        ) : null}

        {view.trialCta ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex items-center justify-center rounded-md border border-[var(--fg)]/20 px-4 py-2 text-sm font-medium text-[var(--fg)] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {view.trialCta.label}
          </button>
        ) : null}

        <SignOutButton />
      </div>

      <div className="mt-12 border-t border-[var(--border)] pt-6">
        <Link
          href="/download"
          className="text-sm text-[var(--accent-text)] underline-offset-4 hover:underline"
        >
          Download Locus for Mac →
        </Link>
      </div>
    </section>
  )
}
