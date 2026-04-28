import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const { portalSessionsCreate, findByUserId } = vi.hoisted(() => ({
  portalSessionsCreate: vi.fn(),
  findByUserId: vi.fn(),
}))

vi.mock("./client", () => ({
  getStripeClient: () => ({
    billingPortal: { sessions: { create: portalSessionsCreate } },
  }),
}))

vi.mock("@/lib/db/subscriptionsRepo", () => ({
  SubscriptionsRepo: { findByUserId },
}))

import { createPortalSession } from "./portal"

const ORIGINAL_ENV = { ...process.env }

describe("createPortalSession", () => {
  beforeEach(() => {
    portalSessionsCreate.mockReset()
    findByUserId.mockReset()
    process.env.NEXT_PUBLIC_SITE_URL = "https://getlocus.tech"
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("creates a Portal Session for the user's stripe_customer_id and returns the URL", async () => {
    findByUserId.mockResolvedValueOnce({
      user_id: "u1",
      stripe_customer_id: "cus_existing",
    })
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
    findByUserId.mockResolvedValueOnce(null)

    await expect(
      createPortalSession({
        userId: "u1",
        returnUrl: "https://getlocus.tech/account",
      })
    ).rejects.toThrow(/no stripe customer/i)
    expect(portalSessionsCreate).not.toHaveBeenCalled()
  })

  it("throws when Stripe returns a session without a URL", async () => {
    findByUserId.mockResolvedValueOnce({
      user_id: "u1",
      stripe_customer_id: "cus_existing",
    })
    portalSessionsCreate.mockResolvedValue({ url: null })

    await expect(
      createPortalSession({
        userId: "u1",
        returnUrl: "https://getlocus.tech/account",
      })
    ).rejects.toThrow(/redirect URL/)
  })
})
