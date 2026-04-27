import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const portalSessionsCreate = vi.fn()
const sqlFn = vi.fn()

vi.mock("./client", () => ({
  getStripeClient: () => ({
    billingPortal: { sessions: { create: portalSessionsCreate } },
  }),
}))

vi.mock("@/lib/db/client", () => ({
  getDb: () => sqlFn,
}))

import { createPortalSession } from "./portal"

const ORIGINAL_ENV = { ...process.env }

describe("createPortalSession", () => {
  beforeEach(() => {
    portalSessionsCreate.mockReset()
    sqlFn.mockReset()
    process.env.NEXT_PUBLIC_SITE_URL = "https://getlocus.tech"
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("creates a Portal Session for the user's stripe_customer_id and returns the URL", async () => {
    sqlFn.mockResolvedValueOnce([{ stripe_customer_id: "cus_existing" }])
    portalSessionsCreate.mockResolvedValue({
      url: "https://billing.stripe.com/p/session/abc",
    })

    const { url } = await createPortalSession({
      userId: "u1",
      returnUrl: "https://getlocus.tech/account",
    })

    expect(url).toBe("https://billing.stripe.com/p/session/abc")
    expect(portalSessionsCreate).toHaveBeenCalledWith({
      customer: "cus_existing",
      return_url: "https://getlocus.tech/account",
    })
  })

  it("throws when the user has no stripe_customer_id", async () => {
    sqlFn.mockResolvedValueOnce([])

    await expect(
      createPortalSession({
        userId: "u1",
        returnUrl: "https://getlocus.tech/account",
      })
    ).rejects.toThrow(/no stripe customer/i)
    expect(portalSessionsCreate).not.toHaveBeenCalled()
  })

  it("throws when Stripe returns a session without a URL", async () => {
    sqlFn.mockResolvedValueOnce([{ stripe_customer_id: "cus_existing" }])
    portalSessionsCreate.mockResolvedValue({ url: null })

    await expect(
      createPortalSession({
        userId: "u1",
        returnUrl: "https://getlocus.tech/account",
      })
    ).rejects.toThrow(/redirect URL/)
  })
})
