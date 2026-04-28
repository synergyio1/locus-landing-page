import { afterEach, describe, it, expect, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

const authState: {
  user: { id: string; email: string } | null
} = { user: null }

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`)
  }),
}))

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
  redirect: redirectMock,
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

import LoginPage from "./page"

describe("LoginPage", () => {
  afterEach(() => {
    cleanup()
    redirectMock.mockClear()
  })

  it("redirects signed-in users to /account", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }

    await expect(
      LoginPage({ searchParams: Promise.resolve({}) })
    ).rejects.toThrow("NEXT_REDIRECT: /account")
  })

  it("redirects signed-in users to the next param when provided", async () => {
    authState.user = { id: "u1", email: "cook@example.com" }

    await expect(
      LoginPage({ searchParams: Promise.resolve({ next: "/billing" }) })
    ).rejects.toThrow("NEXT_REDIRECT: /billing")
  })

  it("renders the magic-link email input for signed-out users", async () => {
    authState.user = null

    const jsx = await LoginPage({ searchParams: Promise.resolve({}) })
    render(jsx)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeTruthy()
    expect(emailInput.getAttribute("type")).toBe("email")
  })

  it("renders Google and Apple sign-in buttons", async () => {
    authState.user = null

    const jsx = await LoginPage({ searchParams: Promise.resolve({}) })
    render(jsx)

    expect(screen.getByRole("button", { name: /google/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /apple/i })).toBeTruthy()
  })

  it("renders a magic-link submit button", async () => {
    authState.user = null

    const jsx = await LoginPage({ searchParams: Promise.resolve({}) })
    render(jsx)

    expect(
      screen.getByRole("button", { name: /send magic link|continue with email/i })
    ).toBeTruthy()
  })

  it("renders the sign-in notice banner when notice=signin", async () => {
    authState.user = null

    const jsx = await LoginPage({
      searchParams: Promise.resolve({ notice: "signin" }),
    })
    render(jsx)

    const banner = screen.getByRole("status")
    expect(banner.textContent).toMatch(/please sign in to continue/i)
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("renders no notice banner when notice is absent", async () => {
    authState.user = null

    const jsx = await LoginPage({ searchParams: Promise.resolve({}) })
    render(jsx)

    expect(screen.queryByRole("status")).toBeNull()
  })

  it("renders no banner when notice is unknown", async () => {
    authState.user = null

    const jsx = await LoginPage({
      searchParams: Promise.resolve({ notice: "somethingelse" }),
    })
    render(jsx)

    expect(screen.queryByRole("status")).toBeNull()
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("still renders the error banner when error param is present", async () => {
    authState.user = null

    const jsx = await LoginPage({
      searchParams: Promise.resolve({ error: "missing_code" }),
    })
    render(jsx)

    const alert = screen.getByRole("alert")
    expect(alert.textContent).toMatch(/couldn't complete your sign-in/i)
  })
})
