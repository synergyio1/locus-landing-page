import { afterEach, describe, it, expect, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

import type { AccountSnapshot } from "@/lib/account/snapshot"

const authState: { user: { id: string; email: string } | null } = { user: null }
const snapshotState: { snapshot: AccountSnapshot | null } = { snapshot: null }

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

vi.mock("@/lib/account/snapshot", () => ({
  loadAccountSnapshot: async () => snapshotState.snapshot,
}))

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`)
  },
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

import AccountPage from "./page"

const baseUser = { id: "u1", email: "cook@example.com" }

function setSnapshot(snapshot: AccountSnapshot) {
  authState.user = baseUser
  snapshotState.snapshot = snapshot
}

describe("AccountPage", () => {
  afterEach(() => {
    cleanup()
    authState.user = null
    snapshotState.snapshot = null
  })

  it("redirects unauthenticated users to /login?next=/account", async () => {
    authState.user = null
    await expect(AccountPage()).rejects.toThrow(
      "NEXT_REDIRECT: /login?next=/account"
    )
  })

  it("renders Free chip + Monthly/Yearly upgrade buttons + disabled trial for a new free user", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "free",
        source: null,
        active_until: null,
      },
      subscription: null,
      proTrial: null,
    })

    const jsx = await AccountPage()
    render(jsx)

    expect(screen.getByText("cook@example.com")).toBeTruthy()
    expect(screen.getByTestId("plan-chip").textContent).toBe("Free")

    const monthly = screen.getByRole("button", {
      name: /upgrade to pro — monthly/i,
    }) as HTMLButtonElement
    const yearly = screen.getByRole("button", {
      name: /upgrade to pro — yearly/i,
    }) as HTMLButtonElement
    expect(monthly.disabled).toBe(false)
    expect(yearly.disabled).toBe(false)

    const trialButton = screen.getByRole("button", {
      name: /start 7-day pro trial/i,
    }) as HTMLButtonElement
    expect(trialButton.disabled).toBe(false)
    expect(trialButton.textContent).toMatch(
      /Free for 7 days, no card needed/i
    )
  })

  it("renders 'Trial used on <date>' for a free user who consumed their trial", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "free",
        source: null,
        active_until: null,
      },
      subscription: null,
      proTrial: {
        user_id: "u1",
        started_at: "2026-04-01T12:00:00.000Z",
        expires_at: "2026-04-08T12:00:00.000Z",
      },
    })

    const jsx = await AccountPage()
    render(jsx)

    expect(screen.getByTestId("plan-chip").textContent).toBe("Free")
    const trialButton = screen.getByRole("button", {
      name: /trial used on/i,
    }) as HTMLButtonElement
    expect(trialButton.disabled).toBe(true)
    expect(trialButton.textContent).toContain("April 1, 2026")
    expect(
      screen.queryByRole("button", { name: /start 7-day pro trial/i })
    ).toBeNull()
  })

  it("renders Trial chip with day-granular countdown for an active trial", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "pro",
        source: "trial",
        active_until: "2026-04-30T12:00:00.000Z",
      },
      subscription: null,
      proTrial: {
        user_id: "u1",
        started_at: "2026-04-23T12:00:00.000Z",
        expires_at: "2026-04-30T12:00:00.000Z",
      },
    })

    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-04-27T12:00:00.000Z"))
    try {
      const jsx = await AccountPage()
      render(jsx)

      expect(screen.getByTestId("plan-chip").textContent).toBe("Trial")
      expect(
        screen.getByText(/3 days left · expires april 30, 2026/i)
      ).toBeTruthy()
      expect(
        screen.queryByRole("button", { name: /start 7-day pro trial/i })
      ).toBeNull()
      expect(
        screen.queryByRole("button", { name: /trial used on/i })
      ).toBeNull()
      expect(
        screen.queryByRole("button", { name: /manage subscription/i })
      ).toBeNull()
      expect(
        screen.getByRole("button", { name: /upgrade to pro — monthly/i })
      ).toBeTruthy()
      expect(
        screen.getByRole("button", { name: /upgrade to pro — yearly/i })
      ).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })

  it("renders Pro chip with renewal date for an active subscription", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "pro",
        source: "subscription",
        active_until: "2026-05-25T12:00:00.000Z",
      },
      subscription: {
        user_id: "u1",
        status: "active",
        current_period_end: "2026-05-25T12:00:00.000Z",
        cancel_at: null,
        price_id: "price_monthly",
      },
      proTrial: null,
    })

    const jsx = await AccountPage()
    render(jsx)

    expect(screen.getByTestId("plan-chip").textContent).toBe("Pro")
    expect(screen.getByText(/renews on may 25, 2026/i)).toBeTruthy()
    expect(
      (screen.getByRole("button", {
        name: /manage subscription/i,
      }) as HTMLButtonElement).disabled
    ).toBe(false)
    expect(
      screen.queryByRole("button", { name: /upgrade to pro/i })
    ).toBeNull()
  })

  it("renders 'Pro until <date>, will not renew' when subscription is cancelling", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "pro",
        source: "subscription",
        active_until: "2026-05-25T12:00:00.000Z",
      },
      subscription: {
        user_id: "u1",
        status: "active",
        current_period_end: "2026-05-25T12:00:00.000Z",
        cancel_at: "2026-05-25T12:00:00.000Z",
        price_id: "price_monthly",
      },
      proTrial: null,
    })

    const jsx = await AccountPage()
    render(jsx)

    expect(screen.getByTestId("plan-chip").textContent).toBe("Pro")
    expect(
      screen.getByText(/pro until may 25, 2026, will not renew/i)
    ).toBeTruthy()
  })

  it("links to /download", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "free",
        source: null,
        active_until: null,
      },
      subscription: null,
      proTrial: null,
    })

    const jsx = await AccountPage()
    render(jsx)

    const link = screen.getByRole("link", { name: /download locus for mac/i })
    expect(link.getAttribute("href")).toBe("/download")
  })

  it("renders the paid Pro welcome banner with latency disclaimer when ?welcome=1 is set", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "free",
        source: null,
        active_until: null,
      },
      subscription: null,
      proTrial: null,
    })

    const jsx = await AccountPage({
      searchParams: Promise.resolve({ welcome: "1" }),
    })
    render(jsx)

    const banner = screen.getByTestId("welcome-banner")
    expect(banner.textContent).toMatch(/welcome to pro/i)
    expect(banner.textContent).toMatch(/refresh in a moment/i)
  })

  it("renders the trial welcome banner with Coach copy when ?welcome=trial is set", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "pro",
        source: "trial",
        active_until: "2026-05-04T12:00:00.000Z",
      },
      subscription: null,
      proTrial: {
        user_id: "u1",
        started_at: "2026-04-27T12:00:00.000Z",
        expires_at: "2026-05-04T12:00:00.000Z",
      },
    })

    const jsx = await AccountPage({
      searchParams: Promise.resolve({ welcome: "trial" }),
    })
    render(jsx)

    const banner = screen.getByTestId("welcome-banner")
    expect(banner.textContent).toMatch(
      /you're on pro for the next 7 days\. make it count\./i
    )
    expect(banner.textContent).not.toMatch(/welcome to pro/i)
    expect(banner.textContent).not.toMatch(/refresh in a moment/i)
  })

  it("does not render the welcome banner without a ?welcome= param", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "free",
        source: null,
        active_until: null,
      },
      subscription: null,
      proTrial: null,
    })

    const jsx = await AccountPage()
    render(jsx)

    expect(screen.queryByTestId("welcome-banner")).toBeNull()
  })

  it("retains the 'Sign out everywhere' button", async () => {
    setSnapshot({
      email: "cook@example.com",
      entitlement: {
        user_id: "u1",
        plan: "free",
        source: null,
        active_until: null,
      },
      subscription: null,
      proTrial: null,
    })

    const jsx = await AccountPage()
    render(jsx)

    expect(
      screen.getByRole("button", { name: /sign out everywhere/i })
    ).toBeTruthy()
  })
})
