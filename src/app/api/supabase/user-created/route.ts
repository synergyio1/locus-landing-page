import { createHash, timingSafeEqual } from "node:crypto"

import { NextResponse, type NextRequest } from "next/server"

import { captureServerEvent } from "@/lib/analytics/server"
import { notifyNewUser } from "@/lib/slack"
import {
  decideSignupPing,
  type SupabaseWebhookPayload,
} from "@/lib/slack/signup-event"

// node:crypto, and never cached.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const SECRET_HEADER = "x-locus-webhook-secret"

/**
 * POST /api/supabase/user-created — the Supabase `auth.users` database webhook.
 *
 * Configured by hand in the Supabase dashboard (Database → Webhooks) on
 * INSERT + UPDATE of `auth.users`, with the shared secret in a custom header.
 * This is the single chokepoint for both surfaces: the Mac app signs in with
 * `signInWithIdToken` and the website with `signInWithOtp` / `signInWithOAuth`,
 * and all three write the same table — so one webhook sees every signup and
 * no Mac app release is needed to change what gets announced.
 *
 * `decideSignupPing` owns which deliveries actually qualify; see its header for
 * why INSERT-means-new-user is wrong on both ends.
 *
 * Always answers 200 once authenticated. Supabase retries non-2xx, and there is
 * nothing to retry here — a Slack miss is already swallowed downstream, and a
 * payload we chose not to announce is a decision, not a failure.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const expected = process.env.LOCUS_SUPABASE_WEBHOOK_SECRET
  if (!expected) {
    console.error(
      "[supabase-webhook] LOCUS_SUPABASE_WEBHOOK_SECRET is not configured",
    )
    return NextResponse.json({ error: "not_configured" }, { status: 500 })
  }

  const presented = request.headers.get(SECRET_HEADER)
  if (!presented || !secretMatches(presented, expected)) {
    // This endpoint is public and its payload shape is guessable, so an
    // unauthenticated caller could otherwise forge signups into the channel.
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let payload: SupabaseWebhookPayload
  try {
    payload = (await request.json()) as SupabaseWebhookPayload
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const decision = decideSignupPing(payload)
  if (!decision.ping) {
    return NextResponse.json({ ok: true, skipped: decision.reason })
  }

  const { id, email, provider } = decision.user

  // Both are individually fire-and-forget, but a thrown error here would still
  // turn a real signup into a 500 and a Supabase retry storm — so the whole
  // announcement is wrapped.
  try {
    await Promise.all([
      notifyNewUser({ email, provider }),
      // distinctId = Supabase user id, matching the Stripe handler's captures,
      // so signup and subscription land on the same PostHog person.
      id
        ? captureServerEvent(id, "user_signed_up", {
            provider: provider ?? undefined,
            ...(email ? { $set: { email } } : {}),
          })
        : Promise.resolve(),
    ])
  } catch (error) {
    console.error("[supabase-webhook] failed to announce signup", error)
  }

  return NextResponse.json({ ok: true, announced: true })
}

/**
 * Compares digests rather than the raw strings so the comparison is both
 * constant-time and length-independent — `timingSafeEqual` throws on a length
 * mismatch, which would itself leak the secret's length.
 */
function secretMatches(presented: string, expected: string): boolean {
  const a = createHash("sha256").update(presented).digest()
  const b = createHash("sha256").update(expected).digest()
  return timingSafeEqual(a, b)
}
