import { NextResponse, type NextRequest } from "next/server"
import type Stripe from "stripe"

import { StripeEventsRepo } from "@/lib/db/stripeEventsRepo"
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

  const { claimed, processedAt } = await StripeEventsRepo.recordIfNew(
    event.id,
    event.type,
    rawBody
  )

  if (!claimed) {
    if (processedAt) {
      return NextResponse.json({ received: true, duplicate: true })
    }
    // A prior delivery claimed the row but hasn't finished processing (or
    // failed). Return non-200 so Stripe retries; a future delivery will
    // re-run the handler and stamp processed_at on success.
    return new NextResponse("Webhook in flight", { status: 409 })
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

  await StripeEventsRepo.markProcessed(event.id)

  return NextResponse.json({ received: true })
}
