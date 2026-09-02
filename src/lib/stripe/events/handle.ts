import "server-only"

import type Stripe from "stripe"

import { captureServerEvent } from "@/lib/analytics/server"
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
import { isForeignEvent } from "./app-guard"

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
        | "foreign_app"
        | "not_our_customer"
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
  // First gate, before any handler runs. Another app's event is not an error —
  // it is simply not ours, so it is acknowledged (the route returns 200) rather
  // than retried. Throwing or returning 5xx here would make Stripe retry for
  // three days and eventually disable this endpoint, taking Locus billing down
  // over a sale that belonged to a sibling product.
  if (isForeignEvent(event)) {
    return { handled: false, type: event.type, reason: "foreign_app" }
  }

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
  // `client_reference_id` is a single unnamespaced string: on a Stripe account
  // shared by several products, every app's sessions carry one and nothing
  // distinguishes them. So identity comes from `metadata.user_id` first — a
  // namespaced key, and the same contract locus-api's webhook uses — with
  // client_reference_id as the fallback for sessions created before the
  // metadata existed. When both are present they must agree; a mismatch means
  // the session was not built by us and is refused rather than guessed at.
  const metadataUserId = session.metadata?.user_id
  const referenceUserId = session.client_reference_id ?? undefined
  if (metadataUserId && referenceUserId && metadataUserId !== referenceUserId) {
    console.error(
      `[stripe-webhook] checkout.session.completed has conflicting user ids (session ${session.id})`,
      { metadataUserId, referenceUserId }
    )
    return {
      handled: false,
      type: "checkout.session.completed",
      reason: "missing_client_reference_id",
    }
  }

  const userId = metadataUserId ?? referenceUserId
  if (!userId) {
    console.error(
      `[stripe-webhook] checkout.session.completed has no user id in metadata or client_reference_id (session ${session.id})`
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

  // Closes the ads funnel server-side: this fires even when the buyer never
  // returns from Stripe. distinctId = Supabase user id merges with the
  // identified browser person and its first-touch UTM attribution.
  await captureServerEvent(userId, "subscription_created", {
    price_id: priceIdOf(subscription),
    status: subscription.status,
    ...(recipientEmail ? { $set: { email: recipientEmail } } : {}),
  })

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
  // Ownership check, not just an app-tag check. `metadata.app` only exists on
  // objects created after the tag was introduced, and this handler sends mail
  // to a human — so it verifies against our own table instead of trusting an
  // absent tag. Without this, a failed card on ANY product in the shared Stripe
  // account produced a Locus-branded dunning email to someone who never bought
  // Locus.
  const customerId = customerIdOf(invoice.customer ?? null)
  if (!customerId) {
    console.warn(
      `[stripe-webhook] payment_failed has no customer (invoice ${invoice.id})`
    )
    return { handled: true, type: "invoice.payment_failed" }
  }

  const owned = await SubscriptionsRepo.findByCustomerId(customerId)
  if (!owned) {
    console.log(
      `[stripe-webhook] ignoring payment_failed for customer ${customerId} — not a Locus customer (invoice ${invoice.id})`
    )
    return {
      handled: false,
      type: "invoice.payment_failed",
      reason: "not_our_customer",
    }
  }

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

  await captureServerEvent(result.user_id, "subscription_canceled", {
    price_id: priceIdOf(subscription),
  })

  return { handled: true, type: "customer.subscription.deleted" }
}
