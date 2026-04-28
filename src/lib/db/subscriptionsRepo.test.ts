import { beforeEach, describe, expect, it, vi } from "vitest"

const { findUnique, create, update, queryRaw, executeRaw } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  queryRaw: vi.fn(),
  executeRaw: vi.fn(),
}))

vi.mock("./prisma", () => ({
  prisma: {
    subscriptions: { findUnique, create, update },
    $queryRaw: queryRaw,
    $executeRaw: executeRaw,
  },
}))

import { SubscriptionsRepo } from "./subscriptionsRepo"

beforeEach(() => {
  findUnique.mockReset()
  create.mockReset()
  update.mockReset()
  queryRaw.mockReset()
  executeRaw.mockReset()
})

describe("SubscriptionsRepo.findByUserId", () => {
  it("returns the row when one exists", async () => {
    findUnique.mockResolvedValue({ user_id: "u1", stripe_customer_id: "cus_1" })
    const row = await SubscriptionsRepo.findByUserId("u1")
    expect(row).toMatchObject({ user_id: "u1", stripe_customer_id: "cus_1" })
    expect(findUnique).toHaveBeenCalledWith({ where: { user_id: "u1" } })
  })

  it("returns null when no row exists", async () => {
    findUnique.mockResolvedValue(null)
    expect(await SubscriptionsRepo.findByUserId("u1")).toBeNull()
  })
})

describe("SubscriptionsRepo.insertWithCustomer", () => {
  it("creates a row tying user_id to stripe customer id, status incomplete", async () => {
    create.mockResolvedValue({})
    await SubscriptionsRepo.insertWithCustomer("u1", "cus_new")
    expect(create).toHaveBeenCalledWith({
      data: {
        user_id: "u1",
        stripe_customer_id: "cus_new",
        status: "incomplete",
      },
    })
  })
})

describe("SubscriptionsRepo.claimOrFetch", () => {
  it("returns claimed:true and the inserted row when no prior row exists", async () => {
    queryRaw.mockResolvedValueOnce([
      { user_id: "u1", stripe_customer_id: "", status: "incomplete" },
    ])

    const result = await SubscriptionsRepo.claimOrFetch("u1")

    expect(result.claimed).toBe(true)
    expect(result.row).toMatchObject({ user_id: "u1", status: "incomplete" })
    expect(findUnique).not.toHaveBeenCalled()
  })

  it("returns claimed:false and re-reads the existing row on conflict", async () => {
    queryRaw.mockResolvedValueOnce([])
    findUnique.mockResolvedValue({
      user_id: "u1",
      stripe_customer_id: "cus_existing",
      status: "active",
    })

    const result = await SubscriptionsRepo.claimOrFetch("u1")

    expect(result.claimed).toBe(false)
    expect(result.row).toMatchObject({ stripe_customer_id: "cus_existing" })
    expect(findUnique).toHaveBeenCalledWith({ where: { user_id: "u1" } })
  })

  it("throws if the row vanishes between insert and re-read", async () => {
    queryRaw.mockResolvedValueOnce([])
    findUnique.mockResolvedValue(null)
    await expect(SubscriptionsRepo.claimOrFetch("u1")).rejects.toThrow(
      /disappeared/
    )
  })
})

describe("SubscriptionsRepo.attachStripeCustomer", () => {
  it("updates stripe_customer_id on the row identified by user_id", async () => {
    update.mockResolvedValue({})
    await SubscriptionsRepo.attachStripeCustomer("u1", "cus_new")
    expect(update).toHaveBeenCalledWith({
      where: { user_id: "u1" },
      data: { stripe_customer_id: "cus_new" },
    })
  })
})

describe("SubscriptionsRepo.promoteOrInsertFromSubscription", () => {
  const fields = {
    stripe_customer_id: "cus_x",
    stripe_subscription_id: "sub_x",
    status: "active",
    current_period_end: new Date("2026-05-01T00:00:00Z"),
    cancel_at: null,
    trial_end: null,
    price_id: "price_monthly",
  }

  it("returns promoted:true and skips the insert when an in-place UPDATE finds the placeholder", async () => {
    queryRaw.mockResolvedValueOnce([{ user_id: "u1" }])

    const result = await SubscriptionsRepo.promoteOrInsertFromSubscription(
      "u1",
      fields
    )

    expect(result).toEqual({ promoted: true })
    expect(executeRaw).not.toHaveBeenCalled()
  })

  it("returns promoted:false and runs the INSERT...ON CONFLICT path when no placeholder exists", async () => {
    queryRaw.mockResolvedValueOnce([])
    executeRaw.mockResolvedValueOnce(1)

    const result = await SubscriptionsRepo.promoteOrInsertFromSubscription(
      "u1",
      fields
    )

    expect(result).toEqual({ promoted: false })
    expect(executeRaw).toHaveBeenCalledTimes(1)
  })
})

describe("SubscriptionsRepo.updateBySubscriptionId", () => {
  const fields = {
    status: "canceled",
    current_period_end: null,
    cancel_at: new Date("2026-05-01T00:00:00Z"),
    trial_end: null,
    price_id: "price_monthly",
  }

  it("returns the user_id when an UPDATE matches a row", async () => {
    queryRaw.mockResolvedValueOnce([{ user_id: "u1" }])
    const result = await SubscriptionsRepo.updateBySubscriptionId("sub_x", fields)
    expect(result).toEqual({ user_id: "u1" })
  })

  it("returns null when no row matches", async () => {
    queryRaw.mockResolvedValueOnce([])
    const result = await SubscriptionsRepo.updateBySubscriptionId("sub_x", fields)
    expect(result).toBeNull()
  })
})

describe("SubscriptionsRepo.markCanceledBySubscriptionId", () => {
  it("returns the user_id when the row was found and marked canceled", async () => {
    queryRaw.mockResolvedValueOnce([{ user_id: "u1" }])
    const result = await SubscriptionsRepo.markCanceledBySubscriptionId("sub_x")
    expect(result).toEqual({ user_id: "u1" })
  })

  it("returns null when no row matches", async () => {
    queryRaw.mockResolvedValueOnce([])
    const result = await SubscriptionsRepo.markCanceledBySubscriptionId("sub_x")
    expect(result).toBeNull()
  })
})
