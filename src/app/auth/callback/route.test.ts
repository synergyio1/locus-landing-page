import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const exchangeCodeForSession = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: async () => ({
    auth: {
      exchangeCodeForSession,
    },
  }),
}))

import { GET } from "./route"

describe("GET /auth/callback", () => {
  beforeEach(() => {
    exchangeCodeForSession.mockReset()
  })

  it("exchanges the code for a session and redirects to next param", async () => {
    exchangeCodeForSession.mockResolvedValue({ data: {}, error: null })

    const request = new NextRequest(
      new URL("http://localhost:3000/auth/callback?code=abc123&next=/billing")
    )
    const response = await GET(request)

    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc123")
    expect(response.status).toBe(302)
    expect(new URL(response.headers.get("location")!).pathname).toBe("/billing")
  })

  it("defaults to /account when no next param is given", async () => {
    exchangeCodeForSession.mockResolvedValue({ data: {}, error: null })

    const request = new NextRequest(
      new URL("http://localhost:3000/auth/callback?code=abc123")
    )
    const response = await GET(request)

    expect(response.status).toBe(302)
    expect(new URL(response.headers.get("location")!).pathname).toBe("/account")
  })

  it("redirects to /login with an error when code is missing", async () => {
    const request = new NextRequest(
      new URL("http://localhost:3000/auth/callback")
    )
    const response = await GET(request)

    expect(exchangeCodeForSession).not.toHaveBeenCalled()
    expect(response.status).toBe(302)
    const redirect = new URL(response.headers.get("location")!)
    expect(redirect.pathname).toBe("/login")
    expect(redirect.searchParams.get("error")).toBeTruthy()
  })

  it("redirects to /login with an error when exchange fails", async () => {
    exchangeCodeForSession.mockResolvedValue({
      data: null,
      error: { message: "invalid_grant" },
    })

    const request = new NextRequest(
      new URL("http://localhost:3000/auth/callback?code=bad")
    )
    const response = await GET(request)

    expect(response.status).toBe(302)
    const redirect = new URL(response.headers.get("location")!)
    expect(redirect.pathname).toBe("/login")
    expect(redirect.searchParams.get("error")).toBeTruthy()
  })

  it("rejects next values pointing to a different origin", async () => {
    exchangeCodeForSession.mockResolvedValue({ data: {}, error: null })

    const request = new NextRequest(
      new URL(
        "http://localhost:3000/auth/callback?code=abc&next=https://evil.example.com/steal"
      )
    )
    const response = await GET(request)

    expect(response.status).toBe(302)
    const redirect = new URL(response.headers.get("location")!)
    expect(redirect.origin).toBe("http://localhost:3000")
    expect(redirect.pathname).toBe("/account")
  })
})
