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

  // Without an explicit configuration the portal falls back to the account's
  // single default one, which offers EVERY product on the shared Synergy IO
  // account as a switch target — a Locus subscriber would be shown Shoulders
  // of Giants plans. `scripts/stripe/migrate.mjs` creates the per-app
  // configuration and prints its id.
  const configuration = process.env.STRIPE_PORTAL_CONFIG_LOCUS
  if (!configuration) {
    throw new Error(
      "STRIPE_PORTAL_CONFIG_LOCUS is not configured — refusing to open a portal " +
        "session against the account default, which exposes other products' plans. " +
        "Run `node scripts/stripe/migrate.mjs --env-file .env --apply` to create it."
    )
  }

  const stripe = getStripeClient()
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    configuration,
    return_url: returnUrl,
  })

  if (!session.url) {
    throw new Error("Stripe Portal did not return a redirect URL")
  }

  return { url: session.url }
}
