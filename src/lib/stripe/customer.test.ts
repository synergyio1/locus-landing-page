import { describe, it, expect, vi, beforeEach } from "vitest"

const {
  customersCreate,
  claimOrFetch,
  findByUserId,
  attachStripeCustomer,
} = vi.hoisted(() => ({
  customersCreate: vi.fn(),
  claimOrFetch: vi.fn(),
  findByUserId: vi.fn(),
  attachStripeCustomer: vi.fn(),
}))

vi.mock("./client", () => ({
  getStripeClient: () => ({
    customers: { create: customersCreate },
  }),
}))

vi.mock("@/lib/db/subscriptionsRepo", () => ({
  SubscriptionsRepo: {
    claimOrFetch,
    findByUserId,
    attachStripeCustomer,
  },
}))

import { getOrCreateCustomer } from "./customer"

describe("getOrCreateCustomer", () => {
  beforeEach(() => {
    customersCreate.mockReset()
    claimOrFetch.mockReset()
    findByUserId.mockReset()
    attachStripeCustomer.mockReset()
  })

  it("returns the existing stripe_customer_id without calling Stripe when the loser sees a populated row", async () => {
    claimOrFetch.mockResolvedValueOnce({
      row: { user_id: "u1", stripe_customer_id: "cus_existing" },
      claimed: false,
    })

    const id = await getOrCreateCustomer({
      userId: "u1",
      email: "cook@example.com",
    })

    expect(id).toBe("cus_existing")
    expect(customersCreate).not.toHaveBeenCalled()
    expect(claimOrFetch).toHaveBeenCalledWith("u1")
    expect(attachStripeCustomer).not.toHaveBeenCalled()
  })

  it("winner creates the Stripe customer and attaches it to the claimed row", async () => {
    claimOrFetch.mockResolvedValueOnce({
      row: { user_id: "u1", stripe_customer_id: "", status: "incomplete" },
      claimed: true,
    })
    customersCreate.mockResolvedValue({ id: "cus_new" })
    attachStripeCustomer.mockResolvedValue(undefined)

    const id = await getOrCreateCustomer({
      userId: "u1",
      email: "cook@example.com",
    })

    expect(id).toBe("cus_new")
    expect(customersCreate).toHaveBeenCalledWith({
      email: "cook@example.com",
      metadata: { supabase_user_id: "u1" },
    })
    expect(attachStripeCustomer).toHaveBeenCalledWith("u1", "cus_new")
  })

  it("two concurrent calls (winner + loser) produce exactly one Stripe customer.create and both return the same id", async () => {
    // Winner: claims the row, creates the customer, attaches it.
    // Loser: doesn't claim. Initially sees an empty stripe_customer_id, then
    // re-reads and finds the winner's update.
    claimOrFetch.mockImplementation(async (userId: string) => {
      const calls = claimOrFetch.mock.calls.length
      if (calls === 1) {
        return {
          row: { user_id: userId, stripe_customer_id: "", status: "incomplete" },
          claimed: true,
        }
      }
      return {
        row: { user_id: userId, stripe_customer_id: "", status: "incomplete" },
        claimed: false,
      }
    })
    customersCreate.mockResolvedValue({ id: "cus_winner" })
    attachStripeCustomer.mockResolvedValue(undefined)
    // Loser's re-read finds the populated row after the winner's update.
    findByUserId.mockResolvedValue({
      user_id: "u1",
      stripe_customer_id: "cus_winner",
    })

    const [winnerId, loserId] = await Promise.all([
      getOrCreateCustomer({ userId: "u1", email: "cook@example.com" }),
      getOrCreateCustomer({ userId: "u1", email: "cook@example.com" }),
    ])

    expect(winnerId).toBe("cus_winner")
    expect(loserId).toBe("cus_winner")
    expect(customersCreate).toHaveBeenCalledTimes(1)
    expect(attachStripeCustomer).toHaveBeenCalledTimes(1)
  })

  it("loser whose row never gets a stripe_customer_id eventually throws", async () => {
    claimOrFetch.mockResolvedValueOnce({
      row: { user_id: "u1", stripe_customer_id: "", status: "incomplete" },
      claimed: false,
    })
    findByUserId.mockResolvedValue({
      user_id: "u1",
      stripe_customer_id: "",
    })

    await expect(
      getOrCreateCustomer({ userId: "u1", email: "cook@example.com" })
    ).rejects.toThrow(/lost the race/)
    expect(customersCreate).not.toHaveBeenCalled()
  })

  it("propagates claimOrFetch errors", async () => {
    claimOrFetch.mockRejectedValueOnce(new Error("boom"))

    await expect(
      getOrCreateCustomer({
        userId: "u1",
        email: "cook@example.com",
      })
    ).rejects.toThrow(/boom/)
    expect(customersCreate).not.toHaveBeenCalled()
  })

  it("propagates attachStripeCustomer errors after creating the Stripe customer", async () => {
    claimOrFetch.mockResolvedValueOnce({
      row: { user_id: "u1", stripe_customer_id: "", status: "incomplete" },
      claimed: true,
    })
    customersCreate.mockResolvedValue({ id: "cus_new" })
    attachStripeCustomer.mockRejectedValueOnce(new Error("constraint"))

    await expect(
      getOrCreateCustomer({
        userId: "u1",
        email: "cook@example.com",
      })
    ).rejects.toThrow(/constraint/)
  })
})
