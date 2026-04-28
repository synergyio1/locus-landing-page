import { beforeEach, describe, expect, it, vi } from "vitest"

const { queryRaw } = vi.hoisted(() => ({
  queryRaw: vi.fn(),
}))

vi.mock("./prisma", () => ({
  prisma: {
    $queryRaw: queryRaw,
  },
}))

import { StripeEventsRepo } from "./stripeEventsRepo"

beforeEach(() => {
  queryRaw.mockReset()
})

describe("StripeEventsRepo.recordIfNew", () => {
  it("returns claimed:true with the row's processed_at when the INSERT succeeds", async () => {
    const ts = new Date("2026-04-28T18:00:00Z")
    queryRaw.mockResolvedValueOnce([{ processed_at: ts }])

    const result = await StripeEventsRepo.recordIfNew(
      "evt_1",
      "checkout.session.completed",
      "{}"
    )

    expect(result).toEqual({ claimed: true, processedAt: ts })
    expect(queryRaw).toHaveBeenCalledTimes(1)
  })

  it("returns claimed:false and re-reads processed_at when the row already exists", async () => {
    const ts = new Date("2026-04-28T18:00:00Z")
    queryRaw.mockResolvedValueOnce([])
    queryRaw.mockResolvedValueOnce([{ processed_at: ts }])

    const result = await StripeEventsRepo.recordIfNew(
      "evt_dup",
      "checkout.session.completed",
      "{}"
    )

    expect(result).toEqual({ claimed: false, processedAt: ts })
    expect(queryRaw).toHaveBeenCalledTimes(2)
  })

  it("returns processedAt:null on the duplicate path when the existing row's processed_at is NULL", async () => {
    queryRaw.mockResolvedValueOnce([])
    queryRaw.mockResolvedValueOnce([{ processed_at: null }])

    const result = await StripeEventsRepo.recordIfNew(
      "evt_inflight",
      "checkout.session.completed",
      "{}"
    )

    expect(result).toEqual({ claimed: false, processedAt: null })
  })
})

describe("StripeEventsRepo.markProcessed", () => {
  it("returns updated:true when an unprocessed row was stamped", async () => {
    queryRaw.mockResolvedValueOnce([{ stripe_event_id: "evt_1" }])
    expect(await StripeEventsRepo.markProcessed("evt_1")).toEqual({
      updated: true,
    })
  })

  it("returns updated:false when no row was eligible (already processed or missing)", async () => {
    queryRaw.mockResolvedValueOnce([])
    expect(await StripeEventsRepo.markProcessed("evt_done")).toEqual({
      updated: false,
    })
  })
})
