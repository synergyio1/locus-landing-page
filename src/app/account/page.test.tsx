import { afterEach, describe, it, expect, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

const authState: {
  user: { id: string; email: string } | null
} = { user: null }

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

import AccountPage from "./page"

describe("AccountPage", () => {
  afterEach(cleanup)

  it("renders the signed-in user's email", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }

    const jsx = await AccountPage()
    render(jsx)

    expect(screen.getByText("cook@example.com")).toBeTruthy()
  })

  it("renders a 'Sign out everywhere' button", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }

    const jsx = await AccountPage()
    render(jsx)

    const button = screen.getByRole("button", { name: /sign out everywhere/i })
    expect(button).toBeTruthy()
  })
})
