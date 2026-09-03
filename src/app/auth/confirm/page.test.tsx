import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`)
  }),
}))

vi.mock("next/navigation", () => ({ redirect: redirectMock }))

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co"

import ConfirmPage from "./page"

describe("ConfirmPage", () => {
  afterEach(() => {
    cleanup()
    redirectMock.mockClear()
  })

  // The whole point of this page: opening it must not sign anyone in, because
  // inbox scanners open it first. It only renders a form.
  it("renders a form that posts the token rather than verifying on sight", async () => {
    const jsx = await ConfirmPage({
      searchParams: Promise.resolve({
        token_hash: "hash-123",
        type: "email",
        next: "/billing",
      }),
    })
    const { container } = render(jsx)

    const form = container.querySelector("form")!
    expect(form.getAttribute("method")).toBe("post")
    expect(form.getAttribute("action")).toBe("/auth/confirm/verify")

    const values = Object.fromEntries(
      [...container.querySelectorAll<HTMLInputElement>("input[type=hidden]")].map(
        (input) => [input.name, input.value]
      )
    )
    expect(values).toEqual({
      token_hash: "hash-123",
      type: "email",
      next: "/billing",
    })
    expect(screen.getByRole("button", { name: /confirm sign-in/i })).toBeTruthy()
  })

  it("sends a link with no token back to /login", async () => {
    await expect(
      ConfirmPage({ searchParams: Promise.resolve({ type: "email" }) })
    ).rejects.toThrow("NEXT_REDIRECT: /login?error=missing_token")
  })

  it("sends a link with an unusable token type back to /login", async () => {
    await expect(
      ConfirmPage({
        searchParams: Promise.resolve({ token_hash: "hash", type: "sms" }),
      })
    ).rejects.toThrow("NEXT_REDIRECT: /login?error=missing_token")
  })

  // One email template serves the website and the Mac app. An app link cannot be
  // finished in the browser — the app's session is minted against a verifier in
  // its own keychain — so it goes to Supabase's verify endpoint instead, still
  // behind a click.
  describe("a link that was asked for from the Mac app", () => {
    it("offers Supabase's verify URL rather than a form post", async () => {
      const jsx = await ConfirmPage({
        searchParams: Promise.resolve({
          token_hash: "hash-123",
          type: "magiclink",
          next: "com.locus.app://auth/callback",
        }),
      })
      const { container } = render(jsx)

      expect(container.querySelector("form")).toBeNull()

      const link = screen.getByRole("link", { name: /open locus/i })
      const href = new URL(link.getAttribute("href")!)
      expect(href.origin + href.pathname).toBe(
        "https://project.supabase.co/auth/v1/verify"
      )
      expect(href.searchParams.get("token")).toBe("hash-123")
      expect(href.searchParams.get("redirect_to")).toBe(
        "com.locus.app://auth/callback"
      )
    })

    it("treats a scheme it does not know as an ordinary web sign-in", async () => {
      const jsx = await ConfirmPage({
        searchParams: Promise.resolve({
          token_hash: "hash-123",
          type: "magiclink",
          next: "evil://auth/callback",
        }),
      })
      const { container } = render(jsx)

      expect(container.querySelector("form")).not.toBeNull()
      expect(screen.queryByRole("link", { name: /open locus/i })).toBeNull()
    })
  })
})
