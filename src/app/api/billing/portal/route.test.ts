import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const cookieAuthState: { user: { id: string; email: string | null } | null } = {
  user: null,
}
const fakeCookieSupabase = {
  auth: {
    getUser: async () => ({
      data: { user: cookieAuthState.user },
      error: null,
    }),
  },
}

const bearerAuthState: {
  user: { id: string; email: string | null } | null
  error: { message: string } | null
} = {
  user: null,
  error: null,
}
const fakeBearerSupabase = {
  auth: {
    getUser: async (_token: string) => ({
      data: { user: bearerAuthState.user },
      error: bearerAuthState.error,
    }),
  },
}

const createPortalSessionMock = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: async () => fakeCookieSupabase,
}))

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => fakeBearerSupabase,
}))

vi.mock("@/lib/stripe/portal", () => ({
  createPortalSession: (...args: unknown[]) => createPortalSessionMock(...args),
}))

import { POST } from "./route"

function postReq(
  origin = "https://getlocus.tech",
  headers?: Record<string, string>
): NextRequest {
  return new NextRequest(new URL(`${origin}/api/billing/portal`), {
    method: "POST",
    headers,
  })
}

describe("POST /api/billing/portal", () => {
  beforeEach(() => {
    cookieAuthState.user = null
    bearerAuthState.user = null
    bearerAuthState.error = null
    createPortalSessionMock.mockReset()
  })

  it("returns 401 when neither cookie session nor bearer token is present", async () => {
    const response = await POST(postReq())
    expect(response.status).toBe(401)
    expect(createPortalSessionMock).not.toHaveBeenCalled()
  })

  it("creates a portal session for the cookie-authenticated user", async () => {
    cookieAuthState.user = { id: "u1", email: "cook@example.com" }
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

  it("creates a portal session for a bearer-authenticated Mac app caller", async () => {
    bearerAuthState.user = { id: "macapp-user", email: "mac@example.com" }
    createPortalSessionMock.mockResolvedValue({
      url: "https://billing.stripe.com/p/session/xyz",
    })

    const response = await POST(
      postReq("https://getlocus.tech", {
        Authorization: "Bearer fake-jwt-token",
      })
    )

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toEqual({
      url: "https://billing.stripe.com/p/session/xyz",
    })
    expect(createPortalSessionMock).toHaveBeenCalledWith({
      userId: "macapp-user",
      returnUrl: "https://getlocus.tech/account",
    })
  })

  it("returns 401 when the bearer token is rejected", async () => {
    bearerAuthState.user = null
    bearerAuthState.error = { message: "invalid token" }

    const response = await POST(
      postReq("https://getlocus.tech", {
        Authorization: "Bearer rejected-token",
      })
    )

    expect(response.status).toBe(401)
    expect(createPortalSessionMock).not.toHaveBeenCalled()
  })

  it("returns 409 when the user has no Stripe customer yet", async () => {
    cookieAuthState.user = { id: "u1", email: "cook@example.com" }
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
    cookieAuthState.user = { id: "u1", email: "cook@example.com" }
    createPortalSessionMock.mockRejectedValue(new Error("stripe down"))

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const response = await POST(postReq())
    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json.error).toBe("portal_failed")
    errorSpy.mockRestore()
  })
})
