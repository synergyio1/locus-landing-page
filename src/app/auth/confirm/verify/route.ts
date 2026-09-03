import { NextResponse, type NextRequest } from "next/server"

import { isVerifyType, toEmailOtpType } from "@/lib/auth/email-otp-type"
import { resolveEmailNext } from "@/lib/auth/resolve-email-next"
import { createServerClient } from "@/lib/supabase/server"

function loginWithError(request: NextRequest, code: string): NextResponse {
  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("error", code)
  // 303 so the browser turns the POST into a GET; a plain 302 would re-post the
  // spent token to /login on a refresh.
  return NextResponse.redirect(loginUrl, 303)
}

/**
 * Spends the one-time token hash from a sign-in email and starts the session.
 *
 * POST-only on purpose. The GET at `/auth/confirm` is what mail scanners fetch;
 * keeping the verification behind a form submit is what stops them from burning
 * the token before the recipient clicks (see that page for the full story).
 */
export async function POST(request: NextRequest) {
  const form = await request.formData()
  const tokenHash = form.get("token_hash")
  const type = form.get("type")

  if (typeof tokenHash !== "string" || !tokenHash || !isVerifyType(type)) {
    return loginWithError(request, "missing_token")
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.verifyOtp({
    type: toEmailOtpType(type),
    token_hash: tokenHash,
  })

  if (error) {
    console.error("[auth] token verification failed:", error.message)
    return loginWithError(request, "link_expired")
  }

  const nextParam = form.get("next")
  const next = resolveEmailNext(
    typeof nextParam === "string" ? nextParam : null,
    request.url
  )

  return NextResponse.redirect(new URL(next, request.url), 303)
}
