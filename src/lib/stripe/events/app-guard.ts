import "server-only"

import type Stripe from "stripe"

/**
 * The Synergy IO Stripe account is shared by several products (Locus,
 * Shoulders of Giants, and whatever ships next). A Stripe webhook endpoint
 * filters by event TYPE only — there is no way to subscribe to "events for
 * product X" — so every endpoint on the account receives every app's events.
 *
 * Concretely, as configured today, both this endpoint and the Shoulders of
 * Giants endpoint are subscribed to the same six types:
 *
 *   checkout.session.completed        customer.subscription.created
 *   invoice.paid                      customer.subscription.updated
 *   invoice.payment_failed            customer.subscription.deleted
 *
 * This module answers one question — "did MY app sell this?" — so the
 * dispatcher can drop another app's events before they reach a handler that
 * would email a stranger or provision a licence for a foreign user id.
 */

/** The app tag this deployment answers to. Written by scripts/stripe/migrate.mjs. */
export const APP = "locus"

/**
 * Reads `metadata.app` from wherever it lives for this event type.
 *
 * Returns null when the event carries no tag at all. That is NOT the same as
 * "foreign": objects created before the tag existed have no metadata, and a
 * null must fall through to the legacy ownership checks rather than being
 * treated as either mine or someone else's.
 */
export function appTagOf(event: Stripe.Event): string | null {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session
      return session.metadata?.app ?? null
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      return subscription.metadata?.app ?? null
    }
    case "invoice.paid":
    case "invoice.payment_failed":
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      // Under the pinned API version the subscription's metadata snapshot rides
      // on the invoice's parent, which is why checkout stamps
      // `subscription_data.metadata` as well as the session's own metadata.
      return invoice.parent?.subscription_details?.metadata?.app ?? null
    }
    default:
      return null
  }
}

/**
 * True when the event is positively tagged as another app's.
 *
 * Deliberately conservative: an untagged event is not foreign. Tightening this
 * to "untagged means foreign" is only safe once every live Customer,
 * Subscription and Product carries `metadata.app` — run
 * `node scripts/stripe/audit.mjs` and confirm it reports no untagged
 * subscriptions before considering that change.
 */
export function isForeignEvent(event: Stripe.Event): boolean {
  const tag = appTagOf(event)
  return tag !== null && tag !== APP
}
