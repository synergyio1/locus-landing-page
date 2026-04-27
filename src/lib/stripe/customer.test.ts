import { describe, it, expect, vi, beforeEach } from "vitest"

const customersCreate = vi.fn()
const sqlFn = vi.fn()

vi.mock("./client", () => ({
  getStripeClient: () => ({
    customers: { create: customersCreate },
  }),
}))

vi.mock("@/lib/db/client", () => ({
  getDb: () => sqlFn,
}))

import { getOrCreateCustomer } from "./customer"

describe("getOrCreateCustomer", () => {
  beforeEach(() => {
    customersCreate.mockReset()
    sqlFn.mockReset()
  })

  it("returns the existing stripe_customer_id without calling Stripe", async () => {
    sqlFn.mockResolvedValueOnce([{ stripe_customer_id: "cus_existing" }])

    const id = await getOrCreateCustomer({
      userId: "u1",
      email: "cook@example.com",
    })

    expect(id).toBe("cus_existing")
    expect(customersCreate).not.toHaveBeenCalled()
    expect(sqlFn).toHaveBeenCalledTimes(1)
    expect(sqlFn.mock.calls[0]).toContain("u1")
  })

  it("creates a Stripe customer and inserts a stub subscription row when none exists", async () => {
    sqlFn.mockResolvedValueOnce([])
    sqlFn.mockResolvedValueOnce([])
    customersCreate.mockResolvedValue({ id: "cus_new" })

    const id = await getOrCreateCustomer({
      userId: "u1",
      email: "cook@example.com",
    })

    expect(id).toBe("cus_new")
    expect(customersCreate).toHaveBeenCalledWith({
      email: "cook@example.com",
      metadata: { supabase_user_id: "u1" },
    })
    expect(sqlFn).toHaveBeenCalledTimes(2)
    expect(sqlFn.mock.calls[1]).toContain("u1")
    expect(sqlFn.mock.calls[1]).toContain("cus_new")
  })

  it("propagates lookup errors", async () => {
    sqlFn.mockRejectedValueOnce(new Error("boom"))

    await expect(
      getOrCreateCustomer({
        userId: "u1",
        email: "cook@example.com",
      })
    ).rejects.toThrow(/boom/)
    expect(customersCreate).not.toHaveBeenCalled()
  })

  it("propagates insert errors", async () => {
    sqlFn.mockResolvedValueOnce([])
    sqlFn.mockRejectedValueOnce(new Error("constraint"))
    customersCreate.mockResolvedValue({ id: "cus_new" })

    await expect(
      getOrCreateCustomer({
        userId: "u1",
        email: "cook@example.com",
      })
    ).rejects.toThrow(/constraint/)
  })
})
