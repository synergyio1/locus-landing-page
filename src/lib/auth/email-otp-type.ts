import type { EmailOtpType } from "@supabase/supabase-js"

/**
 * The `type` a link from an email carries.
 *
 * Two vocabularies overlap here. Supabase's own `/auth/v1/verify` endpoint —
 * which the macOS app's links still go through — names the flow (`magiclink`,
 * `signup`), while `verifyOtp` wants `email` for both and calls the older names
 * deprecated. So the value travels as the endpoint's name and is normalised on
 * the way into `verifyOtp`.
 */
const VERIFY_TYPES = [
  "magiclink",
  "signup",
  "email",
  "recovery",
  "invite",
  "email_change",
] as const

export type VerifyType = (typeof VERIFY_TYPES)[number]

export function isVerifyType(value: unknown): value is VerifyType {
  return (
    typeof value === "string" && (VERIFY_TYPES as readonly string[]).includes(value)
  )
}

/** `magiclink` and `signup` are both plain email verification to `verifyOtp`. */
export function toEmailOtpType(type: VerifyType): EmailOtpType {
  if (type === "magiclink" || type === "signup") return "email"
  return type
}
