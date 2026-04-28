import { describe, it, expect, vi, beforeEach } from "vitest"

const { customersCreate, findByUserId, insertWithCustomer } = vi.hoisted(
  () => ({
    customersCreate: vi.fn(),
    findByUserId: vi.fn(),
    insertWithCustomer: vi.fn(),
  })
)

vi.mock("./client", () => ({
  getStripeClient: () => ({
    customers: { create: customersCreate },
  }),
}))

vi.mock("@/lib/db/subscriptionsRepo", () => ({
  SubscriptionsRepo: {
    findByUserId,
    insertWithCustomer,
  },
}))

import { getOrCreateCustomer } from "./customer"

describe("getOrCreateCustomer", () => {
  beforeEach(() => {
    customersCreate.mockReset()
    findByUserId.mockReset()
    insertWithCustomer.mockReset()
  })

  it("returns the existing stripe_customer_id without calling Stripe", async () => {
    findByUserId.mockResolvedValueOnce({
      user_id: "u1",
      stripe_customer_id: "cus_existing",
    })

    const id = await getOrCreateCustomer({
      userId: "u1",
      email: "cook@example.com",
    })

    expect(id).toBe("cus_existing")
    expect(customersCreate).not.toHaveBeenCalled()
    expect(findByUserId).toHaveBeenCalledWith("u1")
    expect(insertWithCustomer).not.toHaveBeenCalled()
  })

  it("creates a Stripe customer and inserts a stub subscription row when none exists", async () => {
    findByUserId.mockResolvedValueOnce(null)
    customersCreate.mockResolvedValue({ id: "cus_new" })
    insertWithCustomer.mockResolvedValue(undefined)

    const id = await getOrCreateCustomer({
      userId: "u1",
      email: "cook@example.com",
    })

    expect(id).toBe("cus_new")
    expect(customersCreate).toHaveBeenCalledWith({
      email: "cook@example.com",
      metadata: { supabase_user_id: "u1" },
    })
    expect(insertWithCustomer).toHaveBeenCalledWith("u1", "cus_new")
  })

  it("propagates lookup errors", async () => {
    findByUserId.mockRejectedValueOnce(new Error("boom"))

    await expect(
      getOrCreateCustomer({
        userId: "u1",
        email: "cook@example.com",
      })
    ).rejects.toThrow(/boom/)
    expect(customersCreate).not.toHaveBeenCalled()
  })

  it("propagates insert errors", async () => {
    findByUserId.mockResolvedValueOnce(null)
    customersCreate.mockResolvedValue({ id: "cus_new" })
    insertWithCustomer.mockRejectedValueOnce(new Error("constraint"))

    await expect(
      getOrCreateCustomer({
        userId: "u1",
        email: "cook@example.com",
      })
    ).rejects.toThrow(/constraint/)
  })
})
