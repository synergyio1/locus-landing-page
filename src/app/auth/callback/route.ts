import { NextResponse, type NextRequest } from "next/server"

import { resolveEmailNext } from "@/lib/auth/resolve-email-next"
import { createServerClient } from "@/lib/supabase/server"

/**
 * The OAuth landing route — Google sends the browser here with a PKCE `code`.
 *
 * Email sign-in does *not* come through here any more: a one-time link that
 * signs you in on a plain GET gets spent by inbox scanners, so those links now
 * land on `/auth/confirm`, which only verifies on a POST. Supabase still routes
 * failures back to whatever `redirect_to` it was given, and it puts the reason in
 * the URL *fragment* — invisible to the server — which is why a stale link used
 * to arrive here as a bare `missing_code`. The login form reads that fragment.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get("code")
  const nextParam = searchParams.get("next")

  const providerError = searchParams.get("error_code") ?? searchParams.get("error")
  if (providerError) {
    console.error("[auth] provider returned an error:", providerError)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set(
      "error",
      providerError === "otp_expired" ? "link_expired" : "exchange_failed"
    )
    return NextResponse.redirect(loginUrl, 302)
  }

  if (!code) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("error", "missing_code")
    return NextResponse.redirect(loginUrl, 302)
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("[auth] code exchange failed:", error.message)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("error", "exchange_failed")
    return NextResponse.redirect(loginUrl, 302)
  }

  const next = resolveEmailNext(nextParam, request.url)
  return NextResponse.redirect(new URL(next, request.url), 302)
}
