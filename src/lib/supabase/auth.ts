import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

import { createServerClient } from "./server"

type AuthenticatedUser = {
  id: string
  email: string | null
}

/**
 * Resolves the authenticated user from either a `Authorization: Bearer <jwt>`
 * header (Mac app callers) or the cookie-backed Supabase session (browser
 * callers from the landing page itself). Returns `null` when neither path
 * yields a user.
 *
 * Bearer auth wins when both are present so the Mac app's JWT is the
 * source of truth even if the same Mac happens to have a stale cookie
 * session lingering somewhere. The Bearer token is validated against
 * Supabase via `auth.getUser(token)` — a network round-trip, but rare
 * enough on portal/billing routes that the latency is fine.
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim()
    if (token.length > 0) {
      const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const {
        data: { user },
        error,
      } = await adminClient.auth.getUser(token)
      if (!error && user) {
        return { id: user.id, email: user.email ?? null }
      }
    }
  }

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    return { id: user.id, email: user.email ?? null }
  }
  return null
}
