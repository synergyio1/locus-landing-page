import "server-only"

import { SubscriptionsRepo } from "@/lib/db/subscriptionsRepo"

import { getStripeClient } from "./client"

export type GetOrCreateCustomerParams = {
  userId: string
  email: string
}

const LOSER_RETRY_DELAYS_MS = [50, 100, 200]

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getOrCreateCustomer({
  userId,
  email,
}: GetOrCreateCustomerParams): Promise<string> {
  const { row, claimed } = await SubscriptionsRepo.claimOrFetch(userId)

  if (!claimed) {
    if (row.stripe_customer_id) {
      return row.stripe_customer_id
    }
    // Loser raced ahead of the winner's UPDATE. Re-read briefly until
    // the customer id is populated.
    for (const delay of LOSER_RETRY_DELAYS_MS) {
      await sleep(delay)
      const refetched = await SubscriptionsRepo.findByUserId(userId)
      if (refetched?.stripe_customer_id) {
        return refetched.stripe_customer_id
      }
    }
    throw new Error(
      `getOrCreateCustomer: lost the race for ${userId} but stripe_customer_id never appeared`
    )
  }

  const stripe = getStripeClient()
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  await SubscriptionsRepo.attachStripeCustomer(userId, customer.id)

  return customer.id
}
