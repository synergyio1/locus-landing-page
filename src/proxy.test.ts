import { describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"

import type { createServerClient as CreateServerClient } from "@supabase/ssr"

type MockedUser = { id: string; email: string } | null

const authState: { user: MockedUser } = { user: null }

vi.mock("@supabase/ssr", () => ({
  createServerClient: ((): ReturnType<typeof CreateServerClient> =>
    ({
      auth: {
        getUser: async () => ({
          data: { user: authState.user },
          error: null,
        }),
      },
    }) as unknown as ReturnType<typeof CreateServerClient>) as unknown as typeof CreateServerClient,
}))

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"

import { proxy } from "./proxy"

describe("proxy", () => {
  it("redirects unauthenticated /account to /login?next=/account", async () => {
    authState.user = null

    const request = new NextRequest(new URL("http://localhost:3000/account"))
    const response = await proxy(request)

    expect(response.status).toBe(302)
    const location = response.headers.get("location")
    expect(location).not.toBeNull()
    const redirect = new URL(location!)
    expect(redirect.pathname).toBe("/login")
    expect(redirect.searchParams.get("next")).toBe("/account")
  })

  it("lets authenticated users through to /account", async () => {
    authState.user = { id: "user-123", email: "cook@example.com" }

    const request = new NextRequest(new URL("http://localhost:3000/account"))
    const response = await proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get("location")).toBeNull()
  })

  it("redirects unauthenticated /billing to /login?next=/billing", async () => {
    authState.user = null

    const request = new NextRequest(new URL("http://localhost:3000/billing"))
    const response = await proxy(request)

    expect(response.status).toBe(302)
    const redirect = new URL(response.headers.get("location")!)
    expect(redirect.pathname).toBe("/login")
    expect(redirect.searchParams.get("next")).toBe("/billing")
  })

  it("preserves nested paths in the next param", async () => {
    authState.user = null

    const request = new NextRequest(
      new URL("http://localhost:3000/billing/invoices")
    )
    const response = await proxy(request)

    expect(response.status).toBe(302)
    const redirect = new URL(response.headers.get("location")!)
    expect(redirect.searchParams.get("next")).toBe("/billing/invoices")
  })
})
