import { describe, it, expect, vi, beforeEach } from "vitest"
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

const createPortalSessionMock = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: async () => fakeSupabase,
}))

vi.mock("@/lib/stripe/portal", () => ({
  createPortalSession: (...args: unknown[]) => createPortalSessionMock(...args),
}))

import { POST } from "./route"

function postReq(origin = "https://getlocus.tech"): NextRequest {
  return new NextRequest(new URL(`${origin}/api/billing/portal`), {
    method: "POST",
  })
}

describe("POST /api/billing/portal", () => {
  beforeEach(() => {
    authState.user = null
    createPortalSessionMock.mockReset()
  })

  it("returns 401 when the user is unauthenticated", async () => {
    const response = await POST(postReq())
    expect(response.status).toBe(401)
    expect(createPortalSessionMock).not.toHaveBeenCalled()
  })

  it("creates a portal session for the user and returns the URL with origin-based return_url", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    createPortalSessionMock.mockResolvedValue({
      url: "https://billing.stripe.com/p/session/abc",
    })

    const response = await POST(postReq())
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toEqual({
      url: "https://billing.stripe.com/p/session/abc",
    })
    expect(createPortalSessionMock).toHaveBeenCalledWith({
      userId: "u1",
      returnUrl: "https://getlocus.tech/account",
    })
  })

  it("returns 409 when the user has no Stripe customer yet", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    createPortalSessionMock.mockRejectedValue(
      new Error("No Stripe customer for this user")
    )

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const response = await POST(postReq())
    expect(response.status).toBe(409)
    const json = await response.json()
    expect(json.error).toBe("no_customer")
    errorSpy.mockRestore()
  })

  it("returns 500 with a readable error when portal creation throws unexpectedly", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }
    createPortalSessionMock.mockRejectedValue(new Error("stripe down"))

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const response = await POST(postReq())
    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toBe("portal_failed")
    errorSpy.mockRestore()
  })
})
