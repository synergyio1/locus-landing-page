import "server-only"

import { prisma } from "./prisma"

export type RecordIfNewResult = {
  claimed: boolean
  processedAt: Date | null
}

export const StripeEventsRepo = {
  // Insert a row for the given Stripe event id with processed_at = NULL; if
  // one already exists, leave it alone. Returns whether the caller claimed
  // the row, plus the row's current processed_at timestamp. Callers
  // short-circuit only when processed_at IS NOT NULL — a non-null value
  // means the handler succeeded for a prior delivery.
  async recordIfNew(
    eventId: string,
    eventType: string,
    payload: string
  ): Promise<RecordIfNewResult> {
    const inserted = await prisma.$queryRaw<
      Array<{ processed_at: Date | null }>
    >`
      insert into app.stripe_events (stripe_event_id, event_type, payload, processed_at)
      values (${eventId}, ${eventType}, ${payload}::jsonb, null)
      on conflict (stripe_event_id) do nothing
      returning processed_at
    `
    if (inserted.length > 0) {
      return { claimed: true, processedAt: inserted[0].processed_at }
    }
    const existing = await prisma.$queryRaw<
      Array<{ processed_at: Date | null }>
    >`
      select processed_at from app.stripe_events
      where stripe_event_id = ${eventId}
    `
    return { claimed: false, processedAt: existing[0]?.processed_at ?? null }
  },

  // Stamp processed_at on rows where it's still NULL. No-op for rows that
  // already have a non-null processed_at (idempotent under retries).
  async markProcessed(eventId: string): Promise<{ updated: boolean }> {
    const rows = await prisma.$queryRaw<Array<{ stripe_event_id: string }>>`
      update app.stripe_events
      set processed_at = now()
      where stripe_event_id = ${eventId}
        and processed_at is null
      returning stripe_event_id
    `
    return { updated: rows.length > 0 }
  },
}
