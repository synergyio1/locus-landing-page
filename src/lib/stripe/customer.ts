import "server-only"

import { SubscriptionsRepo } from "@/lib/db/subscriptionsRepo"

import { getStripeClient } from "./client"

export type GetOrCreateCustomerParams = {
  userId: string
  email: string
}

export async function getOrCreateCustomer({
  userId,
  email,
}: GetOrCreateCustomerParams): Promise<string> {
  const existing = await SubscriptionsRepo.findByUserId(userId)
  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id
  }

  const stripe = getStripeClient()
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  await SubscriptionsRepo.insertWithCustomer(userId, customer.id)

  return customer.id
}
