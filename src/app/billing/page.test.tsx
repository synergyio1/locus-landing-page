import { afterEach, describe, it, expect, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

const authState: { user: { id: string; email: string } | null } = { user: null }

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: async () => ({
    auth: {
      getUser: async () => ({
        data: { user: authState.user },
        error: null,
      }),
    },
  }),
}))

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`)
  },
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

import BillingPage from "./page"

describe("BillingPage", () => {
  afterEach(() => {
    cleanup()
    authState.user = null
  })

  it("redirects unauthenticated users to /login?next=/billing", async () => {
    authState.user = null
    await expect(BillingPage()).rejects.toThrow(
      "NEXT_REDIRECT: /login?next=/billing"
    )
  })

  it("renders an enabled 'Manage subscription' button for an authenticated user", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }

    const jsx = await BillingPage()
    render(jsx)

    const button = screen.getByRole("button", {
      name: /manage subscription/i,
    }) as HTMLButtonElement
    expect(button.disabled).toBe(false)
  })

  it("links back to /account", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }

    const jsx = await BillingPage()
    render(jsx)

    const link = screen.getByRole("link", { name: /back to your account/i })
    expect(link.getAttribute("href")).toBe("/account")
  })
})
