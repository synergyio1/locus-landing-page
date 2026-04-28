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

const createCheckoutSessionMock = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: async () => fakeSupabase,
}))

vi.mock("@/lib/stripe/checkout", () => ({
  createCheckoutSession: (...args: unknown[]) =>
    createCheckoutSessionMock(...args),
}))

import { POST } from "./route"

const ORIGINAL_ENV = { ...process.env }

function postBody(
  body: unknown,
  origin = "https://getlocus.tech"
): NextRequest {
  return new NextRequest(new URL(`${origin}/api/checkout/create`), {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
}

describe("POST /api/checkout/create", () => {
  beforeEach(() => {
    authState.user = null
    createCheckoutSessionMock.mockReset()
    process.env.STRIPE_PRICE_MONTHLY = "price_monthly_env"
    process.env.STRIPE_PRICE_YEARLY = "price_yearly_env"
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("returns 401 when the user is unauthenticated", async () => {
    const response = await POST(postBody({ priceId: "monthly" }))
    expect(response.status).toBe(401)
    expect(createCheckoutSessionMock).not.toHaveBeenCalled()
  })

  it("returns 400 when the body is missing or malformed", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }

    const r1 = await POST(postBody(undefined))
    expect(r1.status).toBe(400)

    const r2 = await POST(postBody({ priceId: "lifetime" }))
    expect(r2.status).toBe(400)

    expect(createCheckoutSessionMock).not.toHaveBeenCalled()
  })

  it("resolves 'monthly' to STRIPE_PRICE_MONTHLY and forwards request fields", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    createCheckoutSessionMock.mockResolvedValue({
      url: "https://checkout.stripe.com/c/pay/cs_test_abc",
    })

    const response = await POST(postBody({ priceId: "monthly" }))
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toEqual({
      url: "https://checkout.stripe.com/c/pay/cs_test_abc",
    })

    expect(createCheckoutSessionMock).toHaveBeenCalledWith({
      userId: "u1",
      email: "cook@example.com",
      priceId: "price_monthly_env",
      origin: "https://getlocus.tech",
    })
  })

  it("resolves 'yearly' to STRIPE_PRICE_YEARLY", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    createCheckoutSessionMock.mockResolvedValue({
      url: "https://checkout.stripe.com/c/pay/cs_test_y",
    })

    await POST(postBody({ priceId: "yearly" }))

    const call = createCheckoutSessionMock.mock.calls[0][0]
    expect(call.priceId).toBe("price_yearly_env")
  })

  it("returns 500 when the price env var is missing", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    delete process.env.STRIPE_PRICE_MONTHLY

    const response = await POST(postBody({ priceId: "monthly" }))
    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toBe("price_not_configured")
    expect(createCheckoutSessionMock).not.toHaveBeenCalled()
  })

  it("returns 500 with a readable error when Stripe creation throws", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    createCheckoutSessionMock.mockRejectedValue(new Error("stripe down"))

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const response = await POST(postBody({ priceId: "monthly" }))
    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toBe("checkout_failed")
    errorSpy.mockRestore()
  })
})
