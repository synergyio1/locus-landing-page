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

  it("creates a Checkout Session with customer_update and a deterministic idempotency key for the time bucket", async () => {
    getOrCreateCustomerMock.mockResolvedValue("cus_123")
    checkoutSessionsCreate.mockResolvedValue({
      url: "https://checkout.stripe.com/c/pay/cs_test_abc",
    })

    const now = new Date("2026-04-28T18:03:30Z")
    const { url } = await createCheckoutSession({
      userId: "u1",
      email: "cook@example.com",
      priceId: "price_monthly_xyz",
      origin: "https://getlocus.tech",
      now,
    })

    expect(url).toBe("https://checkout.stripe.com/c/pay/cs_test_abc")
    expect(getOrCreateCustomerMock).toHaveBeenCalledWith({
      userId: "u1",
      email: "cook@example.com",
    })
    expect(checkoutSessionsCreate).toHaveBeenCalledTimes(1)
    const [params, options] = checkoutSessionsCreate.mock.calls[0]
    expect(params).toEqual({
      mode: "subscription",
      customer: "cus_123",
      customer_update: { address: "auto", name: "auto" },
      line_items: [{ price: "price_monthly_xyz", quantity: 1 }],
      client_reference_id: "u1",
      success_url: "https://getlocus.tech/account?welcome=1",
      cancel_url: "https://getlocus.tech/pricing",
    })
    expect(options).toEqual({
      idempotencyKey: expect.stringMatching(/^checkout:u1:price_monthly_xyz:\d+$/),
    })
  })

  it("two calls with the same userId+priceId in the same 5-minute bucket get the same idempotency key", async () => {
    getOrCreateCustomerMock.mockResolvedValue("cus_123")
    checkoutSessionsCreate.mockResolvedValue({ url: "https://example/cs" })

    await createCheckoutSession({
      userId: "u1",
      email: "cook@example.com",
      priceId: "price_x",
      origin: "https://getlocus.tech",
      now: new Date("2026-04-28T18:00:10Z"),
    })
    await createCheckoutSession({
      userId: "u1",
      email: "cook@example.com",
      priceId: "price_x",
      origin: "https://getlocus.tech",
      now: new Date("2026-04-28T18:04:50Z"),
    })

    const [, optionsA] = checkoutSessionsCreate.mock.calls[0]
    const [, optionsB] = checkoutSessionsCreate.mock.calls[1]
    expect(optionsA.idempotencyKey).toBe(optionsB.idempotencyKey)
  })

  it("calls in different 5-minute buckets get different idempotency keys", async () => {
    getOrCreateCustomerMock.mockResolvedValue("cus_123")
    checkoutSessionsCreate.mockResolvedValue({ url: "https://example/cs" })

    await createCheckoutSession({
      userId: "u1",
      email: "cook@example.com",
      priceId: "price_x",
      origin: "https://getlocus.tech",
      now: new Date("2026-04-28T18:00:10Z"),
    })
    await createCheckoutSession({
      userId: "u1",
      email: "cook@example.com",
      priceId: "price_x",
      origin: "https://getlocus.tech",
      now: new Date("2026-04-28T18:06:00Z"),
    })

    const [, optionsA] = checkoutSessionsCreate.mock.calls[0]
    const [, optionsB] = checkoutSessionsCreate.mock.calls[1]
    expect(optionsA.idempotencyKey).not.toBe(optionsB.idempotencyKey)
  })

  it("different priceId in the same bucket gets a different idempotency key", async () => {
    getOrCreateCustomerMock.mockResolvedValue("cus_123")
    checkoutSessionsCreate.mockResolvedValue({ url: "https://example/cs" })

    const now = new Date("2026-04-28T18:00:10Z")
    await createCheckoutSession({
      userId: "u1",
      email: "cook@example.com",
      priceId: "price_monthly",
      origin: "https://getlocus.tech",
      now,
    })
    await createCheckoutSession({
      userId: "u1",
      email: "cook@example.com",
      priceId: "price_yearly",
      origin: "https://getlocus.tech",
      now,
    })

    const [, optionsA] = checkoutSessionsCreate.mock.calls[0]
    const [, optionsB] = checkoutSessionsCreate.mock.calls[1]
    expect(optionsA.idempotencyKey).not.toBe(optionsB.idempotencyKey)
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
