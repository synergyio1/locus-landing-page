import type { VerifyType } from "./email-otp-type"

/**
 * The macOS app signs in by email too, through the same Supabase project and so
 * through the same email template. Its links come back to a custom scheme rather
 * than to the website — `AuthManager.authRedirectURL` in the Locus repo builds it
 * from the bundle id, which is why there are two.
 *
 * Matched exactly, never by prefix: this value ends up as a `redirect_to` on a
 * URL that carries a live sign-in token, so "starts with com.locus.app" is not a
 * check worth trusting.
 */
const APP_CALLBACKS = new Set([
  "com.locus.app://auth/callback",
  "tech.getlocus.app://auth/callback",
])

export function isAppCallback(next: string | null | undefined): next is string {
  return typeof next === "string" && APP_CALLBACKS.has(next)
}

/**
 * Supabase's own verify URL, rebuilt from the token hash — the two are the same
 * string, which is what lets one email template serve both surfaces.
 *
 * The app keeps this route because its session has to be minted against the code
 * verifier in its keychain, which a browser cannot do. It still gains the
 * protection this page exists for: a scanner's GET lands on the page, and only a
 * real click follows the link that spends the token.
 */
export function buildAppVerifyUrl(
  supabaseUrl: string,
  tokenHash: string,
  type: VerifyType,
  appCallback: string
): string {
  const url = new URL("/auth/v1/verify", supabaseUrl)
  url.searchParams.set("token", tokenHash)
  // `email` is a verifyOtp-only alias; this endpoint wants the flow's own name.
  url.searchParams.set("type", type === "email" ? "magiclink" : type)
  url.searchParams.set("redirect_to", appCallback)
  return url.toString()
}
