import { NextResponse, type NextRequest } from "next/server"
import type Stripe from "stripe"

import { getDb } from "@/lib/db/client"
import { getStripeClient } from "@/lib/stripe/client"
import { handleStripeEvent } from "@/lib/stripe/events/handle"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 })
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not configured")
    return new NextResponse("Webhook secret not configured", { status: 500 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = getStripeClient().webhooks.constructEvent(
      rawBody,
      signature,
      secret
    )
  } catch (error) {
    console.error("[stripe-webhook] signature verification failed", error)
    return new NextResponse("Invalid signature", { status: 400 })
  }

  const sql = getDb()
  const inserted = await sql<Array<{ stripe_event_id: string }>>`
    insert into app.stripe_events (stripe_event_id, type, payload)
    values (${event.id}, ${event.type}, ${rawBody}::jsonb)
    on conflict (stripe_event_id) do nothing
    returning stripe_event_id
  `

  if (inserted.length === 0) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    await handleStripeEvent(event)
  } catch (error) {
    console.error(
      `[stripe-webhook] handler for ${event.type} (${event.id}) failed`,
      error
    )
    return new NextResponse("Webhook processing error", { status: 500 })
  }

  return NextResponse.json({ received: true })
}
