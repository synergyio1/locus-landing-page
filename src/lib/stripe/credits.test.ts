import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"

const { pricesRetrieve, sessionsCreate, getOrCreateCustomerMock } = vi.hoisted(
  () => ({
    pricesRetrieve: vi.fn(),
    sessionsCreate: vi.fn(),
    getOrCreateCustomerMock: vi.fn(),
  })
)

vi.mock("./client", () => ({
  getStripeClient: () => ({
    prices: { retrieve: pricesRetrieve },
    checkout: { sessions: { create: sessionsCreate } },
  }),
}))

vi.mock("./customer", () => ({
  getOrCreateCustomer: (...args: unknown[]) => getOrCreateCustomerMock(...args),
}))

import {
  CreditPriceConfigurationError,
  clearCreditPackCache,
  createCreditCheckoutSession,
  listCreditPacks,
  loadCreditPriceIds,
  resolveCreditPack,
} from "./credits"

function price(overrides: Record<string, unknown> = {}) {
  return {
    id: "price_5",
    active: true,
    type: "one_time",
    currency: "usd",
    unit_amount: 500,
    ...overrides,
  }
}

describe("loadCreditPriceIds", () => {
  it("returns an empty ladder when unconfigured", () => {
    expect(loadCreditPriceIds({})).toEqual([])
    expect(loadCreditPriceIds({ STRIPE_CREDIT_PRICE_IDS: "" })).toEqual([])
    expect(loadCreditPriceIds({ STRIPE_CREDIT_PRICE_IDS: " , ," })).toEqual([])
  })

  // Configured order is display order: $5 first, $20 last.
  it("preserves order and tolerates whitespace", () => {
    expect(
      loadCreditPriceIds({
        STRIPE_CREDIT_PRICE_IDS: " price_5 , price_10,price_20 ",
      })
    ).toEqual(["price_5", "price_10", "price_20"])
  })
})

describe("resolveCreditPack", () => {
  beforeEach(() => {
    pricesRetrieve.mockReset()
    clearCreditPackCache()
  })

  it("accepts an active one-time USD price", async () => {
    pricesRetrieve.mockResolvedValue(price())

    await expect(resolveCreditPack("price_5")).resolves.toEqual({
      priceId: "price_5",
      unitAmountCents: 500,
      currency: "usd",
    })
  })

  for (const [label, overrides] of [
    ["an archived price", { active: false }],
    ["a subscription price", { type: "recurring" }],
    ["a customer-chosen amount", { unit_amount: null }],
    ["a non-USD price", { currency: "eur" }],
    ["a zero price", { unit_amount: 0 }],
    ["a negative price", { unit_amount: -500 }],
    ["a fractional price", { unit_amount: 12.5 }],
  ] as const) {
    it(`refuses ${label}`, async () => {
      pricesRetrieve.mockResolvedValue(price(overrides))

      await expect(resolveCreditPack("price_5")).rejects.toBeInstanceOf(
        CreditPriceConfigurationError
      )
    })
  }

  it("caches for ten minutes, then re-reads Stripe", async () => {
    pricesRetrieve.mockResolvedValue(price())
    let now = 1_000_000

    await resolveCreditPack("price_5", () => now)
    await resolveCreditPack("price_5", () => now)
    expect(pricesRetrieve).toHaveBeenCalledOnce()

    now += 10 * 60 * 1000 + 1
    await resolveCreditPack("price_5", () => now)
    expect(pricesRetrieve).toHaveBeenCalledTimes(2)
  })
})

describe("listCreditPacks", () => {
  beforeEach(() => {
    pricesRetrieve.mockReset()
    clearCreditPackCache()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns packs in configured order", async () => {
    pricesRetrieve.mockImplementation(async (id: string) =>
      price({ id, unit_amount: id === "price_5" ? 500 : 2000 })
    )

    await expect(
      listCreditPacks({ STRIPE_CREDIT_PRICE_IDS: "price_5,price_20" })
    ).resolves.toEqual([
      { priceId: "price_5", unitAmountCents: 500, currency: "usd" },
      { priceId: "price_20", unitAmountCents: 2000, currency: "usd" },
    ])
  })

  // One bad id must not take down the whole card.
  it("skips an unusable price and still sells the rest", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    pricesRetrieve.mockImplementation(async (id: string) => {
      if (id === "price_broken") throw new Error("No such price")
      return price({ id })
    })

    const packs = await listCreditPacks({
      STRIPE_CREDIT_PRICE_IDS: "price_broken,price_5",
    })

    expect(packs).toEqual([
      { priceId: "price_5", unitAmountCents: 500, currency: "usd" },
    ])
  })

  it("returns nothing when the ladder is unconfigured", async () => {
    await expect(listCreditPacks({})).resolves.toEqual([])
    expect(pricesRetrieve).not.toHaveBeenCalled()
  })
})

describe("createCreditCheckoutSession", () => {
  beforeEach(() => {
    pricesRetrieve.mockReset()
    sessionsCreate.mockReset()
    getOrCreateCustomerMock.mockReset()
    clearCreditPackCache()
    pricesRetrieve.mockResolvedValue(price())
    getOrCreateCustomerMock.mockResolvedValue("cus_123")
    sessionsCreate.mockResolvedValue({
      url: "https://checkout.stripe.com/c/pay/cs_test_credit",
    })
  })

  const params = {
    userId: "u1",
    email: "cook@example.com",
    priceId: "price_5",
    purchaseIntentId: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    origin: "https://getlocus.tech",
    now: new Date("2026-08-20T12:00:00.000Z"),
  }

  it("speaks the metadata contract locus-api's webhook grants against", async () => {
    await createCreditCheckoutSession(params)

    const [payload, options] = sessionsCreate.mock.calls[0]
    expect(payload).toMatchObject({
      mode: "payment",
      customer: "cus_123",
      client_reference_id: "u1",
      line_items: [{ price: "price_5", quantity: 1 }],
      metadata: {
        locus_credit_purchase: "true",
        user_id: "u1",
        credit_price_id: "price_5",
        // Server-authored: a later Stripe price edit cannot change what an
        // already-signed session is worth.
        credit_amount_cents: "500",
      },
      success_url: "https://getlocus.tech/account?credits=pending",
      cancel_url: "https://getlocus.tech/account",
    })
    // The grant trusts credit_amount_cents as USD, so local-currency
    // conversion must stay off.
    expect(payload.adaptive_pricing).toBeUndefined()
    expect(options).toEqual({
      idempotencyKey: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    })
  })

  it("expires the session after thirty minutes", async () => {
    await createCreditCheckoutSession(params)

    const [payload] = sessionsCreate.mock.calls[0]
    expect(payload.expires_at).toBe(
      Math.floor(params.now.getTime() / 1000) + 30 * 60
    )
  })

  it("refuses to bill against a price outside the ladder's rules", async () => {
    pricesRetrieve.mockResolvedValue(price({ type: "recurring" }))

    await expect(createCreditCheckoutSession(params)).rejects.toBeInstanceOf(
      CreditPriceConfigurationError
    )
    expect(sessionsCreate).not.toHaveBeenCalled()
  })

  it("throws when Stripe returns no redirect url", async () => {
    sessionsCreate.mockResolvedValue({ url: null })

    await expect(createCreditCheckoutSession(params)).rejects.toThrow(
      /did not return a redirect URL/
    )
  })
})
