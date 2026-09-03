import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"

const { signInWithOtpMock, signInWithOAuthMock } = vi.hoisted(() => ({
  signInWithOtpMock: vi.fn(),
  signInWithOAuthMock: vi.fn(),
}))

vi.mock("@/lib/supabase/browser", () => ({
  createBrowserClient: () => ({
    auth: {
      signInWithOtp: signInWithOtpMock,
      signInWithOAuth: signInWithOAuthMock,
    },
  }),
}))

import { LoginForm } from "./login-form"

async function submitEmail(address: string) {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: address },
  })
  fireEvent.submit(screen.getByRole("button", { name: /send magic link/i }))
}

describe("LoginForm", () => {
  beforeEach(() => {
    signInWithOtpMock.mockReset().mockResolvedValue({ error: null })
    signInWithOAuthMock.mockReset().mockResolvedValue({ error: null })
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("offers Google but not Apple — the Apple provider is not configured", () => {
    render(<LoginForm next="/account" />)

    expect(screen.getByRole("button", { name: /continue with google/i })).toBeTruthy()
    expect(screen.queryByRole("button", { name: /apple/i })).toBeNull()
  })

  it("swaps the panel for a confirmation naming the address once the link is sent", async () => {
    render(<LoginForm next="/account" />)
    await submitEmail("cook@example.com")

    await waitFor(() => {
      expect(screen.getByText(/check your inbox/i)).toBeTruthy()
    })
    expect(screen.getByText("cook@example.com")).toBeTruthy()
    // The form is gone, so the page can't look untouched after a successful send.
    expect(screen.queryByRole("button", { name: /send magic link/i })).toBeNull()
  })

  it("lets you go back and use a different address", async () => {
    render(<LoginForm next="/account" />)
    await submitEmail("cook@example.com")

    await waitFor(() => screen.getByText(/check your inbox/i))
    fireEvent.click(screen.getByRole("button", { name: /different address/i }))

    expect(screen.getByRole("button", { name: /send magic link/i })).toBeTruthy()
  })

  it("does not leak raw Supabase error text to the user", async () => {
    signInWithOtpMock.mockResolvedValue({
      error: { message: "AuthApiError: Unsupported provider: provider is not enabled" },
    })
    render(<LoginForm next="/account" />)
    await submitEmail("cook@example.com")

    const alert = await screen.findByRole("alert")
    expect(alert.textContent).toMatch(/couldn't sign you in/i)
    expect(alert.textContent).not.toMatch(/AuthApiError|provider is not enabled/i)
  })

  it("explains a rate-limit rejection in plain language", async () => {
    signInWithOtpMock.mockResolvedValue({
      error: { message: "For security purposes, you can only request this after 54 seconds (rate limit)" },
    })
    render(<LoginForm next="/account" />)
    await submitEmail("cook@example.com")

    const alert = await screen.findByRole("alert")
    expect(alert.textContent).toMatch(/too many attempts/i)
  })

  it("sends the Google flow back through /auth/callback with next preserved", async () => {
    render(<LoginForm next="/billing" />)

    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }))

    await waitFor(() => expect(signInWithOAuthMock).toHaveBeenCalled())
    expect(signInWithOAuthMock.mock.calls[0][0]).toMatchObject({ provider: "google" })
    expect(signInWithOAuthMock.mock.calls[0][0].options.redirectTo).toContain(
      "/auth/callback?next=%2Fbilling"
    )
  })

  // Email links must land on /auth/confirm, never /auth/callback: the callback
  // signs you in on a GET, and inbox scanners issue GETs, which spends the
  // single-use token before the recipient can click it.
  it("sends the magic link to /auth/confirm with next preserved", async () => {
    render(<LoginForm next="/billing" />)

    await submitEmail("cook@example.com")

    await waitFor(() => expect(signInWithOtpMock).toHaveBeenCalled())
    const redirect = signInWithOtpMock.mock.calls[0][0].options.emailRedirectTo
    expect(redirect).toContain("/auth/confirm?next=%2Fbilling")
    expect(redirect).not.toContain("/auth/callback")
  })

  describe("errors Supabase reports in the URL fragment", () => {
    const setHash = (hash: string) => {
      window.history.replaceState(null, "", `/login${hash}`)
    }

    afterEach(() => {
      window.history.replaceState(null, "", "/login")
    })

    it("explains a spent link instead of the server's vaguer message", () => {
      setHash("#error=access_denied&error_code=otp_expired&error_description=x")
      render(<LoginForm next="/account" errorMessage="We couldn't complete your sign-in. Please try again." />)

      const alert = screen.getByRole("alert")
      expect(alert.textContent).toMatch(/already used or has expired/i)
    })

    // Left in the address bar, the fragment would re-raise the error on reload —
    // long after the user has asked for a fresh link.
    it("strips the fragment once it has been read", () => {
      setHash("#error=access_denied&error_code=otp_expired")
      render(<LoginForm next="/account" />)

      expect(window.location.hash).toBe("")
      expect(screen.getByRole("alert")).toBeTruthy()
    })

    it("leaves a clean URL alone", () => {
      render(<LoginForm next="/account" />)

      expect(screen.queryByRole("alert")).toBeNull()
    })
  })
})
