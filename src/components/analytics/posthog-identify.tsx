"use client"

import * as React from "react"
import posthog from "posthog-js"

const enabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)

/**
 * Ties the anonymous browser person (which carries the first-touch UTM
 * attribution from the ad click) to the Supabase user id — the same id the
 * Stripe webhook captures `subscription_created` against. Without this the
 * ad→visit and checkout→subscription halves of the funnel land on two
 * different persons and can't be joined.
 */
export function PostHogIdentify({
  userId,
  email,
}: {
  userId: string | null
  email: string | null
}) {
  React.useEffect(() => {
    if (!enabled || !userId) return
    // Repeat calls with the same id are no-ops, so this is safe on every page.
    posthog.identify(userId, email ? { email } : undefined)
  }, [userId, email])

  return null
}
