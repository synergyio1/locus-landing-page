import type { AccountSnapshot } from "./snapshot"

export type DisplayPlan = "free" | "trial" | "pro"

export type PlanLabel = "Free" | "Trial" | "Pro"

export type AccountView = {
  email: string
  displayPlan: DisplayPlan
  planLabel: PlanLabel
  dateLine: string | null
  primaryCta: { label: "Upgrade to Pro" | "Manage subscription" }
  trialCta:
    | { kind: "start"; label: string }
    | { kind: "used"; label: string }
    | null
}

const PLAN_LABELS: Record<DisplayPlan, PlanLabel> = {
  free: "Free",
  trial: "Trial",
  pro: "Pro",
}

const TRIAL_AVAILABLE_LABEL =
  "Start 7-day Pro trial — Free for 7 days, no card needed"

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return formatDateUtc(date)
}

function formatDateUtc(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

const MS_PER_DAY = 86_400_000

export function formatTrialDateLine(activeUntil: Date, now: Date): string {
  const diff = activeUntil.getTime() - now.getTime()
  if (diff < MS_PER_DAY) return "Trial expires today"
  const daysLeft = Math.ceil(diff / MS_PER_DAY)
  const noun = daysLeft === 1 ? "day" : "days"
  return `${daysLeft} ${noun} left · expires ${formatDateUtc(activeUntil)}`
}

function computeDisplayPlan(snapshot: AccountSnapshot): DisplayPlan {
  const entitlement = snapshot.entitlement
  if (entitlement?.plan === "pro") {
    if (entitlement.source === "subscription") return "pro"
    if (entitlement.source === "trial") return "trial"
  }
  return "free"
}

export function deriveAccountView(
  snapshot: AccountSnapshot,
  now: Date = new Date()
): AccountView {
  const displayPlan = computeDisplayPlan(snapshot)
  const planLabel = PLAN_LABELS[displayPlan]

  let dateLine: string | null = null
  if (displayPlan === "pro" && snapshot.subscription) {
    const sub = snapshot.subscription
    const cancelAt = formatDate(sub.cancel_at)
    const renewal = formatDate(sub.current_period_end)
    if (sub.cancel_at && sub.status === "active" && cancelAt) {
      dateLine = `Pro until ${cancelAt}, will not renew`
    } else if (renewal) {
      dateLine = `Renews on ${renewal}`
    }
  } else if (displayPlan === "trial") {
    const activeUntilIso = snapshot.entitlement?.active_until ?? null
    if (activeUntilIso) {
      const activeUntil = new Date(activeUntilIso)
      if (!Number.isNaN(activeUntil.getTime())) {
        dateLine = formatTrialDateLine(activeUntil, now)
      }
    }
  }

  const primaryCta: AccountView["primaryCta"] =
    displayPlan === "pro"
      ? { label: "Manage subscription" }
      : { label: "Upgrade to Pro" }

  let trialCta: AccountView["trialCta"] = null
  if (displayPlan === "free") {
    if (snapshot.proTrial) {
      const usedDate = formatDate(snapshot.proTrial.started_at)
      trialCta = {
        kind: "used",
        label: usedDate ? `Trial used on ${usedDate}` : "Trial already used",
      }
    } else {
      trialCta = { kind: "start", label: TRIAL_AVAILABLE_LABEL }
    }
  }

  return {
    email: snapshot.email,
    displayPlan,
    planLabel,
    dateLine,
    primaryCta,
    trialCta,
  }
}
