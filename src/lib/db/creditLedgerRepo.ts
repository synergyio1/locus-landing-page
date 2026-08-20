import "server-only"

import { prisma } from "./prisma"

// app.credit_ledger is append-only and owned by the schema repo
// (../../pomodoro-preview/locus-api/supabase/migrations). Purchases are
// positive rows; the API debits usage with negative ones. There is no Prisma
// model for it here on purpose — raw SQL keeps this repo out of a schema it
// does not own.
//
// amount_microcents is bigint (1/10,000 of a cent). Never read it back as a
// plain number; the balance is exposed in cents through app.entitlements_v.

export type GrantCreditPurchaseParams = {
  userId: string
  amountMicrocents: number
  currency: string
  stripeEventId: string
}

export const CreditLedgerRepo = {
  // Idempotent by construction: stripe_event_id is UNIQUE, so a redelivered
  // Stripe event (or the same event reaching a second webhook consumer)
  // inserts nothing. `granted` is false on a replay, which is not an error.
  async grantPurchase({
    userId,
    amountMicrocents,
    currency,
    stripeEventId,
  }: GrantCreditPurchaseParams): Promise<{ granted: boolean }> {
    const rows = await prisma.$queryRaw<Array<{ stripe_event_id: string }>>`
      insert into app.credit_ledger (user_id, amount_microcents, currency, stripe_event_id)
      values (${userId}::uuid, ${BigInt(amountMicrocents)}, ${currency}, ${stripeEventId})
      on conflict (stripe_event_id) do nothing
      returning stripe_event_id
    `
    return { granted: rows.length > 0 }
  },

  // Clamped at zero and floored to cents by the view, matching what the Mac
  // app shows. Enforcement in locus-api reads the raw signed sum instead.
  async balanceCents(userId: string): Promise<number> {
    const rows = await prisma.$queryRaw<Array<{ credit_balance_cents: number }>>`
      select coalesce(credit_balance_cents, 0)::int as credit_balance_cents
      from app.entitlements_v
      where user_id = ${userId}::uuid
    `
    return rows[0]?.credit_balance_cents ?? 0
  },
}

// Postgres 23503: the purchase settled after the user row was deleted. The
// event is unprocessable rather than failed, so callers acknowledge it instead
// of making Stripe retry forever. Prisma surfaces raw-query failures as P2010
// with the driver's code in `meta`, but the pg adapter has carried it at the
// top level too — check both.
export function isForeignKeyViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false
  const candidate = error as {
    code?: unknown
    meta?: { code?: unknown } | null
  }
  return candidate.code === "23503" || candidate.meta?.code === "23503"
}
