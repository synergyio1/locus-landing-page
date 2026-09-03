import Link from "next/link"
import { redirect } from "next/navigation"

import { PageShell } from "@/components/layout/page-shell"
import { BreathingDot, SpringReveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { MAC_DOWNLOAD_URL } from "@/content/download"
import { deriveAccountView, type PlanLabel } from "@/lib/account/derive"
import { loadAccountSnapshot } from "@/lib/account/snapshot"
import { initialsFromEmail } from "@/lib/auth/initials"
import { listCreditPacks } from "@/lib/stripe/credits"
import { createServerClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

import { BuyCreditsButtons } from "./buy-credits-buttons"
import { CreditBalance } from "./credit-balance"
import { ManageSubscriptionButton } from "./manage-subscription-button"
import { StartTrialButton } from "./start-trial-button"
import { UpgradeButtons } from "./upgrade-buttons"

const PLAN_CHIP_TONES: Record<PlanLabel, string> = {
  Free: "bg-[var(--surface-raised)] text-[var(--muted-foreground)]",
  Trial: "bg-[var(--accent-subtle)] text-[var(--accent-text)]",
  Pro: "bg-[var(--accent)] text-[var(--accent-foreground)]",
}

// One card language for the whole page — the same rounded-2xl surface the
// download and manifesto pages use, lifted just enough to read as a panel.
const CARD =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgb(11_26_51/0.04),0_18px_40px_-32px_rgb(11_26_51/0.45)]"

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

  const [snapshot, creditPacks] = await Promise.all([
    loadAccountSnapshot(user.id, user.email ?? ""),
    listCreditPacks(),
  ])
  const view = deriveAccountView(snapshot)

  const params = (await searchParams) ?? {}
  const welcomeParam = params.welcome
  const welcomeKind =
    welcomeParam === "1"
      ? "paid"
      : welcomeParam === "trial"
        ? "trial"
        : null
  const creditsPending = params.credits === "pending"

  const canDownload =
    view.displayPlan === "pro" || view.displayPlan === "trial"
  const initials = initialsFromEmail(view.email) || "U"

  return (
    <PageShell as="section" className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        {welcomeKind ? (
          <div
            role="status"
            data-testid="welcome-banner"
            className="rounded-2xl border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--accent-subtle)] px-5 py-4 text-sm leading-relaxed text-[var(--accent-text)]"
          >
            {welcomeKind === "paid" ? (
              <>
                <strong className="font-semibold">Welcome to Pro.</strong>{" "}
                {"Your subscription is being set up — refresh in a moment if your plan chip hasn't updated yet."}
              </>
            ) : (
              "You're on Pro for the next 7 days. Make it count."
            )}
          </div>
        ) : null}

        <SpringReveal className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            <BreathingDot aria-hidden />
            Account
          </span>
          <h1 className="text-4xl font-semibold leading-none tracking-tighter text-[var(--fg)] md:text-5xl">
            Your account
          </h1>
        </SpringReveal>

        {/* Identity + plan, then the actions that belong to them, in one panel
            so the page reads as a single object rather than a stack of rows. */}
        <SpringReveal delay={80} className={cn(CARD, "px-6 py-6 md:px-7")}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span
                aria-hidden
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-sm font-semibold tracking-wide text-[var(--accent-text)] ring-1 ring-[color-mix(in_oklab,var(--accent)_20%,transparent)]"
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  Signed in as
                </p>
                <p className="mt-1 truncate text-base font-medium text-[var(--fg)] md:text-lg">
                  {view.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:items-end sm:text-right">
              <span
                data-testid="plan-chip"
                className={cn(
                  "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                  PLAN_CHIP_TONES[view.planLabel]
                )}
              >
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-current opacity-70"
                />
                {view.planLabel}
              </span>
              {view.dateLine ? (
                <span className="text-sm text-[var(--muted-foreground)]">
                  {view.dateLine}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-6 border-t border-[var(--border)] pt-6">
            <div className="flex flex-wrap items-center gap-3">
              {canDownload ? (
                <a
                  href={MAC_DOWNLOAD_URL}
                  download
                  aria-label="Download Locus for Mac (.dmg)"
                  className={cn(buttonVariants())}
                >
                  <Icon name="download" />
                  Download for Mac
                </a>
              ) : null}

              {view.displayPlan === "pro" ? (
                <ManageSubscriptionButton variant="outline" />
              ) : (
                <UpgradeButtons emphasis={canDownload ? "secondary" : "primary"} />
              )}
            </div>

            {/* The trial CTA carries its own reassurance, so it gets its own
                line instead of crowding the upgrade pair. */}
            {view.trialCta ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {view.trialCta.kind === "start" ? (
                  <StartTrialButton label={view.trialCta.label} />
                ) : (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {view.trialCta.label}
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </SpringReveal>

        {/* Remote credits sit on top of any license state (ADR-0010), so this
            shows for free, trial, and paid alike. The same ledger backs the Mac
            app's Settings → Account, so a balance bought here shows up there. */}
        <SpringReveal
          delay={140}
          as="section"
          aria-labelledby="remote-credits-heading"
          data-testid="remote-credits-card"
          className={cn(CARD, "px-6 py-6 md:px-7")}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h2
              id="remote-credits-heading"
              className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]"
            >
              Remote credits
            </h2>
            <CreditBalance
              balanceCents={snapshot.creditBalanceCents}
              checkoutPending={creditsPending}
            />
          </div>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--muted-foreground)]">
            {snapshot.creditBalanceCents > 0
              ? "Prepaid balance for Locus Remote — spend it as you use the AI."
              : "Prepaid credits for Locus Remote — add a pack, spend it as you use the AI."}
          </p>
          {creditPacks.length > 0 ? (
            <BuyCreditsButtons packs={creditPacks} />
          ) : (
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--muted-foreground)]">
              Add credits from the Mac app — Settings → Account.
            </p>
          )}
          <p className="mt-4 max-w-prose border-t border-[var(--border)] pt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
            Bring your own AI (Claude Code, Codex, or an API key) and there&apos;s
            nothing to buy.
          </p>
        </SpringReveal>

        {view.displayPlan === "free" ? (
          <Link
            href="/download"
            className="group inline-flex w-fit items-center gap-1.5 text-sm text-[var(--accent-text)] underline-offset-4 hover:underline"
          >
            Download the app
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        ) : null}
      </div>
    </PageShell>
  )
}
