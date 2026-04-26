import "server-only"

import Stripe from "stripe"

let cached: Stripe | null = null

export function getStripeClient(): Stripe {
  if (cached) return cached

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }

  cached = new Stripe(secret, {
    // Pinned per PRD #3. Cast required because stripe-node's `apiVersion`
    // type is locked to the SDK's bundled version.
    apiVersion: "2024-12-18.acacia" as never,
  })
  return cached
}
