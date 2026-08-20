import "server-only"

import type Stripe from "stripe"

import {
  CreditLedgerRepo,
  isForeignKeyViolation,
} from "@/lib/db/creditLedgerRepo"
import { prisma } from "@/lib/db/prisma"
import { SubscriptionsRepo } from "@/lib/db/subscriptionsRepo"
import { sendCancellation } from "@/lib/mail/sendCancellation"
import { sendPaymentFailed } from "@/lib/mail/sendPaymentFailed"
import { sendWelcome } from "@/lib/mail/sendWelcome"

import { getStripeClient } from "../client"

export type HandleEventResult =
  | {
      handled: true
      type: string
      cancellationTransition?: boolean
      creditsGranted?: boolean
    }
  | {
      handled: false
      type: string
      reason:
        | "unknown_type"
        | "missing_client_reference_id"
        | "subscription_not_found"
        | "credit_session_unpaid"
        | "credit_metadata_malformed"
    }

// Credit purchases are payment-mode Checkout sessions carrying the metadata
// contract locus-api defined (see its src/routes/credits-webhook.ts). Both
// consumers may be subscribed to checkout.session.completed in the same Stripe
// account; app.credit_ledger's UNIQUE stripe_event_id makes that safe.
function isCreditPurchase(session: Stripe.Checkout.Session): boolean {
  return session.metadata?.locus_credit_purchase === "true"
}

export async function handleStripeEvent(
  event: Stripe.Event
): Promise<HandleEventResult> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      if (isCreditPurchase(session)) {
        if (session.payment_status !== "paid") {
          console.log(
            `[stripe-webhook] credit session ${session.id} completed unpaid (${session.payment_status}) — awaiting async settlement`
          )
          return {
            handled: false,
            type: event.type,
            reason: "credit_session_unpaid",
          }
        }
        return handleCreditPurchase(session, event.id, event.type)
      }
      return handleCheckoutSessionCompleted(session)
    }
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session
      if (!isCreditPurchase(session)) {
        return { handled: false, type: event.type, reason: "unknown_type" }
      }
      return handleCreditPurchase(session, event.id, event.type)
    }
    case "checkout.session.async_payment_failed":
      console.error(
        `[stripe-webhook] checkout async payment failed (event ${event.id})`
      )
      return { handled: true, type: event.type }
    case "customer.subscription.updated":
      return handleSubscriptionUpdated(
        event.data.object as Stripe.Subscription,
        (event.data.previous_attributes ?? {}) as Partial<Stripe.Subscription>
      )
    case "customer.subscription.deleted":
      return handleSubscriptionDeleted(
        event.data.object as Stripe.Subscription
      )
    case "invoice.payment_failed":
      return handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
    default:
      console.log(`[stripe-webhook] ignoring event type ${event.type}`)
      return { handled: false, type: event.type, reason: "unknown_type" }
  }
}

function toDateOrNull(timestamp: number | null | undefined): Date | null {
  if (!timestamp) return null
  return new Date(timestamp * 1000)
}

function customerIdOf(value: string | { id: string } | null): string | null {
  if (!value) return null
  return typeof value === "string" ? value : value.id
}

function priceIdOf(subscription: Stripe.Subscription): string | null {
  const item = subscription.items?.data?.[0]
  if (!item) return null
  const price = item.price
  if (!price) return null
  return typeof price === "string" ? price : price.id
}

function currentPeriodEndOf(subscription: Stripe.Subscription): number | null {
  return subscription.items?.data?.[0]?.current_period_end ?? null
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<HandleEventResult> {
  const userId = session.client_reference_id
  if (!userId) {
    console.error(
      `[stripe-webhook] checkout.session.completed missing client_reference_id (session ${session.id})`
    )
    return {
      handled: false,
      type: "checkout.session.completed",
      reason: "missing_client_reference_id",
    }
  }

  const subscriptionRef = session.subscription
  const subscriptionId =
    typeof subscriptionRef === "string"
      ? subscriptionRef
      : (subscriptionRef?.id ?? null)
  const customerId = customerIdOf(session.customer)

  if (!subscriptionId || !customerId) {
    console.error(
      `[stripe-webhook] checkout.session.completed missing subscription or customer (session ${session.id})`
    )
    return {
      handled: false,
      type: "checkout.session.completed",
      reason: "subscription_not_found",
    }
  }

  const stripe = getStripeClient()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  await SubscriptionsRepo.promoteOrInsertFromSubscription(userId, {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    current_period_end: toDateOrNull(currentPeriodEndOf(subscription)),
    cancel_at: toDateOrNull(subscription.cancel_at),
    trial_end: toDateOrNull(subscription.trial_end),
    price_id: priceIdOf(subscription),
  })

  const recipientEmail =
    session.customer_details?.email ??
    session.customer_email ??
    (await fetchUserEmail(userId))
  if (recipientEmail) {
    try {
      await sendWelcome(
        {
          email: recipientEmail,
          name: session.customer_details?.name ?? null,
        },
        { downloadUrl: buildDownloadUrl() }
      )
    } catch (error) {
      console.error(
        `[stripe-webhook] failed to send welcome email (session ${session.id})`,
        error
      )
    }
  } else {
    console.warn(
      `[stripe-webhook] no recipient email for welcome (session ${session.id}, user ${userId})`
    )
  }

  return { handled: true, type: "checkout.session.completed" }
}

// Mirrors locus-api's credits webhook validation. The grant trusts the
// server-authored metadata rather than the session's amount_total, so a later
// Stripe price edit cannot change what an already-signed session is worth.
async function handleCreditPurchase(
  session: Stripe.Checkout.Session,
  eventId: string,
  eventType: string
): Promise<HandleEventResult> {
  const metadata = session.metadata ?? {}
  const userId = metadata.user_id
  const priceId = metadata.credit_price_id
  const rawAmount = metadata.credit_amount_cents
  const referenceUserId = session.client_reference_id ?? undefined
  const amountCents = Number(rawAmount)
  const amountMicrocents = amountCents * 10_000

  if (
    !userId ||
    !priceId ||
    !rawAmount ||
    (referenceUserId && userId !== referenceUserId) ||
    !Number.isSafeInteger(amountCents) ||
    !Number.isSafeInteger(amountMicrocents) ||
    amountCents <= 0
  ) {
    // Acknowledge rather than retry — a poisoned payload will never parse.
    console.error(
      `[stripe-webhook] credit session ${session.id} has malformed metadata (event ${eventId})`,
      { metadata, clientReferenceId: session.client_reference_id }
    )
    return {
      handled: false,
      type: eventType,
      reason: "credit_metadata_malformed",
    }
  }

  try {
    const { granted } = await CreditLedgerRepo.grantPurchase({
      userId,
      amountMicrocents,
      currency: "usd",
      stripeEventId: eventId,
    })
    if (!granted) {
      console.log(
        `[stripe-webhook] credit event ${eventId} already granted — replay ignored`
      )
    }
    return { handled: true, type: eventType, creditsGranted: granted }
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      console.error(
        `[stripe-webhook] credit purchase arrived after user ${userId} was deleted (event ${eventId})`,
        error
      )
      return { handled: true, type: eventType, creditsGranted: false }
    }
    throw error
  }
}

async function fetchUserEmail(userId: string): Promise<string | null> {
  const rows = await prisma.$queryRaw<Array<{ email: string | null }>>`
    select email from auth.users where id = ${userId}::uuid limit 1
  `
  return rows[0]?.email ?? null
}

function buildDownloadUrl(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getlocus.tech"
  return `${base.replace(/\/$/, "")}/download`
}

function toIsoOrNull(date: Date | null): string | null {
  return date ? date.toISOString() : null
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  previousAttributes: Partial<Stripe.Subscription>
): Promise<HandleEventResult> {
  const result = await SubscriptionsRepo.updateBySubscriptionId(
    subscription.id,
    {
      status: subscription.status,
      current_period_end: toDateOrNull(currentPeriodEndOf(subscription)),
      cancel_at: toDateOrNull(subscription.cancel_at),
      trial_end: toDateOrNull(subscription.trial_end),
      price_id: priceIdOf(subscription),
    }
  )

  if (!result) {
    return {
      handled: false,
      type: "customer.subscription.updated",
      reason: "subscription_not_found",
    }
  }

  const cancellationTransition =
    previousAttributes.status === "active" && subscription.status === "canceled"

  if (cancellationTransition) {
    const userId = result.user_id
    const recipientEmail = await fetchUserEmail(userId)
    const accessUntil =
      toIsoOrNull(toDateOrNull(currentPeriodEndOf(subscription))) ??
      toIsoOrNull(toDateOrNull(subscription.cancel_at)) ??
      new Date().toISOString()
    if (recipientEmail) {
      try {
        await sendCancellation(
          { email: recipientEmail },
          { accessUntil }
        )
      } catch (error) {
        console.error(
          `[stripe-webhook] failed to send cancellation email (subscription ${subscription.id})`,
          error
        )
      }
    } else {
      console.warn(
        `[stripe-webhook] no recipient email for cancellation (subscription ${subscription.id}, user ${userId})`
      )
    }
  }

  return {
    handled: true,
    type: "customer.subscription.updated",
    ...(cancellationTransition ? { cancellationTransition: true } : {}),
  }
}

function recipientEmailFromInvoice(invoice: Stripe.Invoice): string | null {
  const direct = invoice.customer_email
  if (direct) return direct
  const customer = invoice.customer
  if (customer && typeof customer !== "string" && "email" in customer) {
    const inferred = (customer as { email?: string | null }).email
    if (inferred) return inferred
  }
  return null
}

function buildAccountUrl(): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://getlocus.tech"
  return `${base.replace(/\/$/, "")}/account`
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<HandleEventResult> {
  const recipientEmail = recipientEmailFromInvoice(invoice)
  if (!recipientEmail) {
    console.warn(
      `[stripe-webhook] no recipient email for payment_failed (invoice ${invoice.id})`
    )
    return { handled: true, type: "invoice.payment_failed" }
  }

  const updatePaymentUrl =
    invoice.hosted_invoice_url ?? buildAccountUrl()

  try {
    await sendPaymentFailed(
      { email: recipientEmail },
      { updatePaymentUrl }
    )
  } catch (error) {
    console.error(
      `[stripe-webhook] failed to send payment_failed email (invoice ${invoice.id})`,
      error
    )
  }

  return { handled: true, type: "invoice.payment_failed" }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<HandleEventResult> {
  const result = await SubscriptionsRepo.markCanceledBySubscriptionId(
    subscription.id
  )

  if (!result) {
    return {
      handled: false,
      type: "customer.subscription.deleted",
      reason: "subscription_not_found",
    }
  }

  return { handled: true, type: "customer.subscription.deleted" }
}
