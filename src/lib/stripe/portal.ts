import "server-only"

import { SubscriptionsRepo } from "@/lib/db/subscriptionsRepo"

import { getStripeClient } from "./client"

export type CreatePortalSessionParams = {
  userId: string
  returnUrl: string
}

export async function createPortalSession({
  userId,
  returnUrl,
}: CreatePortalSessionParams): Promise<{ url: string }> {
  const row = await SubscriptionsRepo.findByUserId(userId)
  const customerId = row?.stripe_customer_id
  if (!customerId) {
    throw new Error("No Stripe customer for this user")
  }

  const stripe = getStripeClient()
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  if (!session.url) {
    throw new Error("Stripe Portal did not return a redirect URL")
  }

  return { url: session.url }
}
