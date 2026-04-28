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
    apiVersion: "2026-04-22.dahlia",
  })
  return cached
}
