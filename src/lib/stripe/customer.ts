import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"

import { getStripeClient } from "./client"

type ExistingRow = {
  stripe_customer_id: string | null
}

export type GetOrCreateCustomerParams = {
  supabase: SupabaseClient
  userId: string
  email: string
}

export async function getOrCreateCustomer({
  supabase,
  userId,
  email,
}: GetOrCreateCustomerParams): Promise<string> {
  const { data: existing, error: lookupError } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle<ExistingRow>()

  if (lookupError) {
    throw new Error(`Failed to look up subscription: ${lookupError.message}`)
  }

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id
  }

  const stripe = getStripeClient()
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  const { error: upsertError } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: customer.id,
        status: "incomplete",
      },
      { onConflict: "user_id" }
    )

  if (upsertError) {
    throw new Error(
      `Failed to persist Stripe customer id: ${upsertError.message}`
    )
  }

  return customer.id
}
