import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"

import { getStripeClient } from "./client"
import { getOrCreateCustomer } from "./customer"

export type CreateCheckoutSessionParams = {
  supabase: SupabaseClient
  userId: string
  email: string
  priceId: string
  origin: string
}

export async function createCheckoutSession({
  supabase,
  userId,
  email,
  priceId,
  origin,
}: CreateCheckoutSessionParams): Promise<{ url: string }> {
  const customerId = await getOrCreateCustomer({ supabase, userId, email })

  const stripe = getStripeClient()
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    success_url: `${origin}/account?welcome=1`,
    cancel_url: `${origin}/pricing`,
  })

  if (!session.url) {
    throw new Error("Stripe Checkout did not return a redirect URL")
  }

  return { url: session.url }
}
