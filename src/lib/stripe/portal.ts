import "server-only"

import { getDb } from "@/lib/db/client"

import { getStripeClient } from "./client"

export type CreatePortalSessionParams = {
  userId: string
  returnUrl: string
}

export async function createPortalSession({
  userId,
  returnUrl,
}: CreatePortalSessionParams): Promise<{ url: string }> {
  const sql = getDb()

  const rows = await sql<Array<{ stripe_customer_id: string | null }>>`
    select stripe_customer_id
    from app.subscriptions
    where user_id = ${userId}
    limit 1
  `

  const customerId = rows[0]?.stripe_customer_id
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
