import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const verifyOtp = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: async () => ({ auth: { verifyOtp } }),
}))

import { POST } from "./route"

function post(fields: Record<string, string>): NextRequest {
  const body = new FormData()
  for (const [key, value] of Object.entries(fields)) body.set(key, value)
  return new NextRequest("https://getlocus.tech/auth/confirm/verify", {
    method: "POST",
    body,
  })
}

describe("POST /auth/confirm/verify", () => {
  beforeEach(() => {
    verifyOtp.mockReset()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("spends the token hash and lands on the unwrapped next", async () => {
    verifyOtp.mockResolvedValue({ data: {}, error: null })

    const response = await POST(
      post({
        token_hash: "hash-123",
        type: "email",
        next: "https://getlocus.tech/auth/confirm?next=%2Fbilling",
      })
    )

    expect(verifyOtp).toHaveBeenCalledWith({ type: "email", token_hash: "hash-123" })
    // 303 turns the POST into a GET, so refreshing the destination cannot re-post
    // a token that is now spent.
    expect(response.status).toBe(303)
    expect(new URL(response.headers.get("location")!).pathname).toBe("/billing")
  })

  it("defaults to /account when the email carried no destination", async () => {
    verifyOtp.mockResolvedValue({ data: {}, error: null })

    const response = await POST(post({ token_hash: "hash-123", type: "email" }))

    expect(new URL(response.headers.get("location")!).pathname).toBe("/account")
  })

  it("tells the user the link is spent when verification fails", async () => {
    verifyOtp.mockResolvedValue({
      data: null,
      error: { message: "Token has expired or is invalid" },
    })

    const response = await POST(post({ token_hash: "stale", type: "email" }))

    const redirect = new URL(response.headers.get("location")!)
    expect(redirect.pathname).toBe("/login")
    expect(redirect.searchParams.get("error")).toBe("link_expired")
  })

  it("normalises the template's flow name onto the type verifyOtp wants", async () => {
    verifyOtp.mockResolvedValue({ data: {}, error: null })

    await POST(post({ token_hash: "hash-123", type: "magiclink" }))

    expect(verifyOtp).toHaveBeenCalledWith({ type: "email", token_hash: "hash-123" })
  })

  it("never calls Supabase with a token type it did not mint", async () => {
    const response = await POST(post({ token_hash: "hash", type: "sms" }))

    expect(verifyOtp).not.toHaveBeenCalled()
    expect(new URL(response.headers.get("location")!).searchParams.get("error")).toBe(
      "missing_token"
    )
  })

  it("refuses a submission with no token at all", async () => {
    const response = await POST(post({ type: "email" }))

    expect(verifyOtp).not.toHaveBeenCalled()
    expect(new URL(response.headers.get("location")!).pathname).toBe("/login")
  })

  it("keeps a cross-origin next out of the redirect", async () => {
    verifyOtp.mockResolvedValue({ data: {}, error: null })

    const response = await POST(
      post({
        token_hash: "hash",
        type: "email",
        next: "https://evil.example.com/steal",
      })
    )

    const redirect = new URL(response.headers.get("location")!)
    expect(redirect.origin).toBe("https://getlocus.tech")
    expect(redirect.pathname).toBe("/account")
  })
})
