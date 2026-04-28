import "server-only"

import { getDb } from "@/lib/db/client"

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

function toIso(value: Date | string | null): string | null {
  if (value === null || value === undefined) return null
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

export async function loadAccountSnapshot(
  userId: string,
  fallbackEmail: string
): Promise<AccountSnapshot> {
  const sql = getDb()

  const [entitlementRows, subscriptionRows, profileRows, proTrialRows] =
    await Promise.all([
      sql<
        Array<{
          user_id: string
          plan: Plan
          source: EntitlementSource | null
          active_until: Date | null
        }>
      >`
        select user_id, plan, source, active_until
        from app.entitlements_v
        where user_id = ${userId}
      `,
      sql<
        Array<{
          user_id: string
          status: string
          current_period_end: Date | null
          cancel_at: Date | null
          price_id: string | null
        }>
      >`
        select user_id, status, current_period_end, cancel_at, price_id
        from app.subscriptions
        where user_id = ${userId}
        limit 1
      `,
      sql<Array<{ user_id: string; email: string | null }>>`
        select p.user_id, u.email
        from app.profiles p
        join auth.users u on u.id = p.user_id
        where p.user_id = ${userId}
      `,
      sql<Array<{ user_id: string; started_at: Date; expires_at: Date }>>`
        select user_id, started_at, expires_at
        from app.pro_trials
        where user_id = ${userId}
      `,
    ])

  const subscription = subscriptionRows[0]
    ? {
        user_id: subscriptionRows[0].user_id,
        status: subscriptionRows[0].status,
        current_period_end: toIso(subscriptionRows[0].current_period_end),
        cancel_at: toIso(subscriptionRows[0].cancel_at),
        price_id: subscriptionRows[0].price_id,
      }
    : null

  const proTrial = proTrialRows[0]
    ? {
        user_id: proTrialRows[0].user_id,
        started_at: toIso(proTrialRows[0].started_at)!,
        expires_at: toIso(proTrialRows[0].expires_at)!,
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
