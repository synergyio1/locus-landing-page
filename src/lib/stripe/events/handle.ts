import "server-only"

import type Stripe from "stripe"

import { getDb } from "@/lib/db/client"

import { getStripeClient } from "../client"

export type HandleEventResult =
  | {
      handled: true
      type: string
      cancellationTransition?: boolean
    }
  | {
      handled: false
      type: string
      reason:
        | "unknown_type"
        | "missing_client_reference_id"
        | "subscription_not_found"
    }

export async function handleStripeEvent(
  event: Stripe.Event
): Promise<HandleEventResult> {
  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      )
    case "customer.subscription.updated":
      return handleSubscriptionUpdated(
        event.data.object as Stripe.Subscription,
        (event.data.previous_attributes ?? {}) as Partial<Stripe.Subscription>
      )
    case "customer.subscription.deleted":
      return handleSubscriptionDeleted(
        event.data.object as Stripe.Subscription
      )
    default:
      console.log(`[stripe-webhook] ignoring event type ${event.type}`)
      return { handled: false, type: event.type, reason: "unknown_type" }
  }
}

function toIsoOrNull(timestamp: number | null | undefined): string | null {
  if (!timestamp) return null
  return new Date(timestamp * 1000).toISOString()
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

// `current_period_end` is present on the wire payload (and on subscriptions
// returned for our pinned 2024-12-18.acacia API version) but stripe-node v22's
// type moved it to per-item. Read it through a narrow shape to keep types honest.
type WithPeriodEnd = { current_period_end?: number | null }
function currentPeriodEndOf(
  subscription: Stripe.Subscription | (Stripe.Subscription & WithPeriodEnd)
): number | null {
  return (subscription as WithPeriodEnd).current_period_end ?? null
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

  const sql = getDb()
  await sql`
    insert into app.subscriptions (
      user_id,
      stripe_customer_id,
      stripe_subscription_id,
      status,
      current_period_end,
      cancel_at,
      trial_end,
      price_id
    ) values (
      ${userId},
      ${customerId},
      ${subscription.id},
      ${subscription.status},
      ${toIsoOrNull(currentPeriodEndOf(subscription))},
      ${toIsoOrNull(subscription.cancel_at)},
      ${toIsoOrNull(subscription.trial_end)},
      ${priceIdOf(subscription)}
    )
    on conflict (user_id) do update set
      stripe_customer_id = excluded.stripe_customer_id,
      stripe_subscription_id = excluded.stripe_subscription_id,
      status = excluded.status,
      current_period_end = excluded.current_period_end,
      cancel_at = excluded.cancel_at,
      trial_end = excluded.trial_end,
      price_id = excluded.price_id
  `

  return { handled: true, type: "checkout.session.completed" }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  previousAttributes: Partial<Stripe.Subscription>
): Promise<HandleEventResult> {
  const sql = getDb()
  const rows = await sql<Array<{ user_id: string }>>`
    update app.subscriptions set
      status = ${subscription.status},
      current_period_end = ${toIsoOrNull(currentPeriodEndOf(subscription))},
      cancel_at = ${toIsoOrNull(subscription.cancel_at)},
      trial_end = ${toIsoOrNull(subscription.trial_end)},
      price_id = ${priceIdOf(subscription)}
    where stripe_subscription_id = ${subscription.id}
    returning user_id
  `

  if (rows.length === 0) {
    return {
      handled: false,
      type: "customer.subscription.updated",
      reason: "subscription_not_found",
    }
  }

  const cancellationTransition =
    previousAttributes.status === "active" && subscription.status === "canceled"

  return {
    handled: true,
    type: "customer.subscription.updated",
    ...(cancellationTransition ? { cancellationTransition: true } : {}),
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<HandleEventResult> {
  const sql = getDb()
  const rows = await sql<Array<{ user_id: string }>>`
    update app.subscriptions set
      status = 'canceled',
      cancel_at = now()
    where stripe_subscription_id = ${subscription.id}
    returning user_id
  `

  if (rows.length === 0) {
    return {
      handled: false,
      type: "customer.subscription.deleted",
      reason: "subscription_not_found",
    }
  }

  return { handled: true, type: "customer.subscription.deleted" }
}
