import "server-only"

import { prisma } from "@/lib/db/prisma"

export type Plan = "free" | "trial" | "pro"

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "trialing"
  | "unpaid"
  | "paused"

export type EntitlementSource = "subscription" | "trial"

export type Entitlement = {
  user_id: string
  plan: Plan
  source: EntitlementSource | null
  active_until: string | null
}

export type Subscription = {
  user_id: string
  status: SubscriptionStatus | string
  current_period_end: string | null
  cancel_at: string | null
  price_id: string | null
}

export type Profile = {
  user_id: string
  email: string
}

export type ProTrial = {
  user_id: string
  started_at: string
  expires_at: string
}

export type AccountSnapshot = {
  email: string
  entitlement: Entitlement | null
  subscription: Subscription | null
  proTrial: ProTrial | null
}

type EntitlementRow = {
  user_id: string
  plan: Plan
  source: EntitlementSource | null
  active_until: Date | null
}

type ProfileEmailRow = {
  user_id: string
  email: string | null
}

function toIso(value: Date | string | null): string | null {
  if (value === null || value === undefined) return null
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

export async function loadAccountSnapshot(
  userId: string,
  fallbackEmail: string
): Promise<AccountSnapshot> {
  const [entitlementRows, subscriptionRow, profileRows, proTrialRow] =
    await Promise.all([
      prisma.$queryRaw<EntitlementRow[]>`
        select user_id, plan, source, active_until
        from app.entitlements_v
        where user_id = ${userId}::uuid
      `,
      prisma.subscriptions.findUnique({
        where: { user_id: userId },
        select: {
          user_id: true,
          status: true,
          current_period_end: true,
          cancel_at: true,
          price_id: true,
        },
      }),
      prisma.$queryRaw<ProfileEmailRow[]>`
        select p.user_id, u.email
        from app.profiles p
        join auth.users u on u.id = p.user_id
        where p.user_id = ${userId}::uuid
      `,
      prisma.pro_trials.findUnique({
        where: { user_id: userId },
        select: {
          user_id: true,
          started_at: true,
          expires_at: true,
        },
      }),
    ])

  const subscription = subscriptionRow
    ? {
        user_id: subscriptionRow.user_id,
        status: subscriptionRow.status,
        current_period_end: toIso(subscriptionRow.current_period_end),
        cancel_at: toIso(subscriptionRow.cancel_at),
        price_id: subscriptionRow.price_id,
      }
    : null

  const proTrial = proTrialRow
    ? {
        user_id: proTrialRow.user_id,
        started_at: toIso(proTrialRow.started_at)!,
        expires_at: toIso(proTrialRow.expires_at)!,
      }
    : null

  const entitlementRow = entitlementRows[0]
  const entitlement: Entitlement | null = entitlementRow
    ? {
        user_id: entitlementRow.user_id,
        plan: entitlementRow.plan,
        source: entitlementRow.source,
        active_until: toIso(entitlementRow.active_until),
      }
    : null

  return {
    email: profileRows[0]?.email ?? fallbackEmail,
    entitlement,
    subscription,
    proTrial,
  }
}
