import "server-only"

import { getDb } from "@/lib/db/client"

import { getStripeClient } from "./client"

export type GetOrCreateCustomerParams = {
  userId: string
  email: string
}

export async function getOrCreateCustomer({
  userId,
  email,
}: GetOrCreateCustomerParams): Promise<string> {
  const sql = getDb()

  const existing = await sql<Array<{ stripe_customer_id: string }>>`
    select stripe_customer_id
    from app.subscriptions
    where user_id = ${userId}
    limit 1
  `

  if (existing[0]?.stripe_customer_id) {
    return existing[0].stripe_customer_id
  }

  const stripe = getStripeClient()
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  await sql`
    insert into app.subscriptions (user_id, stripe_customer_id, status)
    values (${userId}, ${customer.id}, 'incomplete')
  `

  return customer.id
}
