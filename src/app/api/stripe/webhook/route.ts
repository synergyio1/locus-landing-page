import { NextResponse, type NextRequest } from "next/server"
import type Stripe from "stripe"

import { StripeEventsRepo } from "@/lib/db/stripeEventsRepo"
import { getStripeClient } from "@/lib/stripe/client"
import { isForeignEvent } from "@/lib/stripe/events/app-guard"
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

  // Another app's event on the shared Synergy IO account. Acknowledged without
  // being recorded: storing it would copy a sibling product's customer name,
  // email and billing address into the Locus database for no reason.
  if (isForeignEvent(event)) {
    return NextResponse.json({ received: true, ignored: "foreign_app" })
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
    // The row exists but was never marked processed, so a prior delivery
    // claimed it and then failed. Fall through and re-run the handler: the
    // claim is not a lock, and refusing here would strand the event forever
    // (every retry would take this branch and nothing would ever reprocess it).
    // Handlers are individually idempotent, so a genuine concurrent delivery
    // re-running is safe; a permanently unprocessed payment is not.
    console.warn(
      `[stripe-webhook] retrying previously-failed event ${event.id} (${event.type})`
    )
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
