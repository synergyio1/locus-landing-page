import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"

const authState: { user: { id: string; email: string | null } | null } = {
  user: null,
}
const fakeSupabase = {
  auth: {
    getUser: async () => ({
      data: { user: authState.user },
      error: null,
    }),
  },
}

const createCreditCheckoutSessionMock = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: async () => fakeSupabase,
}))

// Cuts the Prisma import chain at its boundary: the real credits module
// reaches the database only to find-or-create the Stripe customer.
vi.mock("@/lib/stripe/customer", () => ({
  getOrCreateCustomer: vi.fn(),
}))

vi.mock("@/lib/stripe/credits", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/stripe/credits")>()
  return {
    // loadCreditPriceIds and CreditPriceConfigurationError stay real — the
    // allowlist check is what this route exists to enforce.
    ...actual,
    createCreditCheckoutSession: (...args: unknown[]) =>
      createCreditCheckoutSessionMock(...args),
  }
})

import { POST } from "./route"
import { CreditPriceConfigurationError } from "@/lib/stripe/credits"

const ORIGINAL_ENV = { ...process.env }
const INTENT = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
const ALLOWED = "price_5"

function postBody(
  body: unknown,
  origin = "https://getlocus.tech"
): NextRequest {
  return new NextRequest(new URL(`${origin}/api/credits/checkout`), {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
}

describe("POST /api/credits/checkout", () => {
  beforeEach(() => {
    authState.user = null
    createCreditCheckoutSessionMock.mockReset()
    process.env.STRIPE_CREDIT_PRICE_IDS = "price_5,price_10,price_20"
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("returns 401 when the user is unauthenticated", async () => {
    const response = await POST(
      postBody({ priceId: ALLOWED, purchaseIntentId: INTENT })
    )
    expect(response.status).toBe(401)
    expect(createCreditCheckoutSessionMock).not.toHaveBeenCalled()
  })

  it("returns 400 when the body is malformed", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }

    for (const body of [
      undefined,
      {},
      { priceId: ALLOWED },
      { priceId: ALLOWED, purchaseIntentId: "not-a-uuid" },
      { priceId: "", purchaseIntentId: INTENT },
    ]) {
      const response = await POST(postBody(body))
      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: "invalid_body" })
    }
    expect(createCreditCheckoutSessionMock).not.toHaveBeenCalled()
  })

  // A client-supplied price must never reach Stripe unchecked — otherwise any
  // price in the account (a $3 subscription, say) becomes a credit pack.
  it("rejects a price outside the configured ladder", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }

    const response = await POST(
      postBody({ priceId: "price_not_ours", purchaseIntentId: INTENT })
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "credit_price_not_allowed" })
    expect(createCreditCheckoutSessionMock).not.toHaveBeenCalled()
  })

  it("rejects every price when the ladder is unconfigured", async () => {
    delete process.env.STRIPE_CREDIT_PRICE_IDS
    authState.user = { id: "u1", email: "cook@example.com" }

    const response = await POST(
      postBody({ priceId: ALLOWED, purchaseIntentId: INTENT })
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "credit_price_not_allowed" })
  })

  it("returns 400 when the account has no email to bill", async () => {
    authState.user = { id: "u1", email: null }

    const response = await POST(
      postBody({ priceId: ALLOWED, purchaseIntentId: INTENT })
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "missing_email" })
  })

  it("returns the Checkout url, passing the purchase intent through", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    createCreditCheckoutSessionMock.mockResolvedValue({
      url: "https://checkout.stripe.com/c/pay/cs_test_credit",
    })

    const response = await POST(
      postBody({ priceId: ALLOWED, purchaseIntentId: INTENT })
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      url: "https://checkout.stripe.com/c/pay/cs_test_credit",
    })
    expect(createCreditCheckoutSessionMock).toHaveBeenCalledWith({
      userId: "u1",
      email: "cook@example.com",
      priceId: ALLOWED,
      purchaseIntentId: INTENT,
      origin: "https://getlocus.tech",
    })
  })

  it("reports a misconfigured Stripe price distinctly from a generic failure", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    createCreditCheckoutSessionMock.mockRejectedValue(
      new CreditPriceConfigurationError("price_5 is recurring")
    )

    const response = await POST(
      postBody({ priceId: ALLOWED, purchaseIntentId: INTENT })
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: "credit_price_configuration_error",
    })
  })

  it("returns 500 when Stripe fails", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    createCreditCheckoutSessionMock.mockRejectedValue(new Error("stripe down"))

    const response = await POST(
      postBody({ priceId: ALLOWED, purchaseIntentId: INTENT })
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: "checkout_failed" })
  })
})
