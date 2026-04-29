import "server-only"

import { getStripeClient } from "./client"
import { getOrCreateCustomer } from "./customer"

export type CreateCheckoutSessionParams = {
  userId: string
  email: string
  priceId: string
  origin: string
  now?: Date
}

const IDEMPOTENCY_BUCKET_MS = 5 * 60 * 1000

function buildIdempotencyKey(
  userId: string,
  priceId: string,
  now: Date
): string {
  const bucket = Math.floor(now.getTime() / IDEMPOTENCY_BUCKET_MS)
  return `checkout:${userId}:${priceId}:${bucket}`
}

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  origin,
  now,
}: CreateCheckoutSessionParams): Promise<{ url: string }> {
  const customerId = await getOrCreateCustomer({ userId, email })

  const stripe = getStripeClient()
  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      customer: customerId,
      customer_update: { address: "auto", name: "auto" },
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: userId,
      // PROTIER-07 (#301): Checkout return goes back to the Mac app via
      // a custom URL scheme. The macOS DeepLinkRouter resolves
      // `locus://checkout-complete` → entitlements refresh.
      success_url: "locus://checkout-complete",
      cancel_url: `${origin}/pricing`,
      adaptive_pricing: { enabled: true },
    },
    {
      idempotencyKey: buildIdempotencyKey(userId, priceId, now ?? new Date()),
    }
  )

  if (!session.url) {
    throw new Error("Stripe Checkout did not return a redirect URL")
  }

  return { url: session.url }
}
