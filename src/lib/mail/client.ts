import "server-only"

import { Resend } from "resend"

let cached: Resend | null = null

export function getMailClient(): Resend {
  if (cached) return cached

  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error("RESEND_API_KEY is not configured")
  }

  cached = new Resend(key)
  return cached
}

// Production sends from the verified getlocus.tech domain (live Stripe mode).
// Local dev / preview uses Resend's onboarding sandbox sender so test-mode
// Stripe events don't blow through the verified domain reputation.
const DEFAULT_FROM = "Locus <onboarding@resend.dev>"

export function getMailFrom(): string {
  return process.env.RESEND_FROM ?? DEFAULT_FROM
}
