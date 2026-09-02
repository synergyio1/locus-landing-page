import "server-only"

import { PostHog } from "posthog-node"

/**
 * Server-side capture for events the browser can never see reliably —
 * subscription outcomes arrive on the Stripe webhook whether or not the buyer
 * ever returns to the site. Uses the same project key as the client SDK, so
 * a `distinctId` equal to the Supabase user id merges with the identified
 * browser person (see PostHogIdentify) and closes the ad→subscription funnel.
 *
 * A client per call keeps this correct on serverless: capture + flush, done.
 * Failures are logged and swallowed — analytics must never fail a webhook.
 */
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return

  const client = new PostHog(key, {
    host: "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  })
  try {
    client.capture({ distinctId, event, properties })
    await client.shutdown()
  } catch (error) {
    console.error(`[analytics] failed to capture ${event}`, error)
  }
}
