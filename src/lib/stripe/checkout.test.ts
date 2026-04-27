import { describe, it, expect, vi, beforeEach } from "vitest"

const checkoutSessionsCreate = vi.fn()
const getOrCreateCustomerMock = vi.fn()

vi.mock("./client", () => ({
  getStripeClient: () => ({
    checkout: { sessions: { create: checkoutSessionsCreate } },
  }),
}))

vi.mock("./customer", () => ({
  getOrCreateCustomer: (...args: unknown[]) => getOrCreateCustomerMock(...args),
}))

import { createCheckoutSession } from "./checkout"

describe("createCheckoutSession", () => {
  beforeEach(() => {
    checkoutSessionsCreate.mockReset()
    getOrCreateCustomerMock.mockReset()
  })

  it("creates a Checkout Session with the passed price, customer, client_reference_id, and origin URLs", async () => {
    getOrCreateCustomerMock.mockResolvedValue("cus_123")
    checkoutSessionsCreate.mockResolvedValue({
      url: "https://checkout.stripe.com/c/pay/cs_test_abc",
    })

    const { url } = await createCheckoutSession({
      userId: "u1",
      email: "cook@example.com",
      priceId: "price_monthly_xyz",
      origin: "https://getlocus.tech",
    })

    expect(url).toBe("https://checkout.stripe.com/c/pay/cs_test_abc")
    expect(getOrCreateCustomerMock).toHaveBeenCalledWith({
      userId: "u1",
      email: "cook@example.com",
    })
    expect(checkoutSessionsCreate).toHaveBeenCalledWith({
      mode: "subscription",
      customer: "cus_123",
      line_items: [{ price: "price_monthly_xyz", quantity: 1 }],
      client_reference_id: "u1",
      success_url: "https://getlocus.tech/account?welcome=1",
      cancel_url: "https://getlocus.tech/pricing",
    })
  })

  it("throws when Stripe returns a session without a URL", async () => {
    getOrCreateCustomerMock.mockResolvedValue("cus_123")
    checkoutSessionsCreate.mockResolvedValue({ url: null })

    await expect(
      createCheckoutSession({
        userId: "u1",
        email: "cook@example.com",
        priceId: "price_yearly_abc",
        origin: "http://localhost:3000",
      })
    ).rejects.toThrow(/redirect URL/)
  })
})
