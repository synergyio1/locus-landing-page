import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"

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

export type Entitlement = {
  user_id: string
  plan: Plan
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

export async function loadAccountSnapshot(
  supabase: SupabaseClient,
  userId: string,
  fallbackEmail: string
): Promise<AccountSnapshot> {
  const [entitlement, subscription, profile, proTrial] = await Promise.all([
    supabase
      .from("entitlements_v")
      .select("user_id, plan")
      .eq("user_id", userId)
      .maybeSingle<Entitlement>(),
    supabase
      .from("subscriptions")
      .select("user_id, status, current_period_end, cancel_at, price_id")
      .eq("user_id", userId)
      .maybeSingle<Subscription>(),
    supabase
      .from("profiles")
      .select("user_id, email")
      .eq("user_id", userId)
      .maybeSingle<Profile>(),
    supabase
      .from("pro_trials")
      .select("user_id, started_at, expires_at")
      .eq("user_id", userId)
      .maybeSingle<ProTrial>(),
  ])

  return {
    email: profile.data?.email ?? fallbackEmail,
    entitlement: entitlement.data ?? null,
    subscription: subscription.data ?? null,
    proTrial: proTrial.data ?? null,
  }
}
