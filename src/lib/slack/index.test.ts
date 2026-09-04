import { describe, it, expect, vi } from "vitest"

import {
  formatMoney,
  notifyCancellation,
  notifyCreditPurchase,
  notifyNewUser,
  notifySubscription,
} from "./index"

const URL = "https://hooks.slack.test/AAA"

function capture() {
  const transport = vi.fn().mockResolvedValue(undefined)
  return {
    transport,
    text: () => transport.mock.calls[0]?.[1]?.text as string,
    url: () => transport.mock.calls[0]?.[0] as string,
  }
}

describe("notifyNewUser", () => {
  it("posts the email and provider to the injected webhook", async () => {
    const t = capture()
    await notifyNewUser(
      { email: "new@example.com", provider: "google" },
      { webhookUrl: URL, transport: t.transport },
    )

    expect(t.url()).toBe(URL)
    expect(t.text()).toContain("new@example.com")
    expect(t.text()).toContain("google")
    expect(t.text()).toContain("New user")
  })

  it("survives a user with no email", async () => {
    const t = capture()
    await notifyNewUser(
      { email: null, provider: null },
      { webhookUrl: URL, transport: t.transport },
    )

    expect(t.text()).toContain("(no email)")
    expect(t.text()).not.toContain("via")
  })
})

describe("notifySubscription / notifyCreditPurchase", () => {
  it("renders the charged amount", async () => {
    const t = capture()
    await notifySubscription(
      { email: "buyer@example.com", amountMinor: 1200, currency: "usd" },
      { webhookUrl: URL, transport: t.transport },
    )

    expect(t.text()).toContain("buyer@example.com")
    expect(t.text()).toContain("$12.00")
    expect(t.text()).toContain("New subscription")
  })

  it("omits the money clause when Stripe reported no amount", async () => {
    const t = capture()
    await notifySubscription(
      { email: "buyer@example.com", amountMinor: null, currency: null },
      { webhookUrl: URL, transport: t.transport },
    )

    expect(t.text()).not.toContain("$")
    expect(t.text()).toContain("buyer@example.com")
  })

  it("labels a credit pack distinctly from a subscription", async () => {
    const t = capture()
    await notifyCreditPurchase(
      { email: "buyer@example.com", amountMinor: 2000, currency: "usd" },
      { webhookUrl: URL, transport: t.transport },
    )

    expect(t.text()).toContain("Credit pack")
    expect(t.text()).toContain("$20.00")
  })
})

describe("notifyCancellation", () => {
  it("renders the access-until date as a plain day", async () => {
    const t = capture()
    await notifyCancellation(
      { email: "gone@example.com", accessUntil: "2026-10-01T00:00:00.000Z" },
      { webhookUrl: URL, transport: t.transport },
    )

    expect(t.text()).toContain("Cancelled")
    expect(t.text()).toContain("gone@example.com")
    expect(t.text()).toContain("2026-10-01")
    expect(t.text()).not.toContain("T00:00")
  })
})

describe("configuration and failure", () => {
  it("does nothing when no webhook URL is configured", async () => {
    const t = capture()
    const previous = process.env.SLACK_NEWUSERS_WEBHOOK_URL
    delete process.env.SLACK_NEWUSERS_WEBHOOK_URL

    await notifyNewUser(
      { email: "a@b.io", provider: "google" },
      { transport: t.transport },
    )

    expect(t.transport).not.toHaveBeenCalled()
    if (previous !== undefined) process.env.SLACK_NEWUSERS_WEBHOOK_URL = previous
  })

  // The whole point of the module: Slack being down must never fail the
  // Stripe webhook or a signup.
  it("swallows a transport failure rather than throwing", async () => {
    const boom = vi.fn().mockRejectedValue(new Error("slack 503"))
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    await expect(
      notifySubscription(
        { email: "a@b.io", amountMinor: 1200, currency: "usd" },
        { webhookUrl: URL, transport: boom },
      ),
    ).resolves.toBeUndefined()

    expect(boom).toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})

describe("formatMoney", () => {
  it("renders minor units", () => {
    expect(formatMoney(1200, "usd")).toBe("$12.00")
    expect(formatMoney(999, "eur")).toBe("€9.99")
    expect(formatMoney(1000, "brl")).toBe("BRL 10.00")
  })

  it("returns null rather than a misleading zero", () => {
    expect(formatMoney(null, "usd")).toBeNull()
    expect(formatMoney(undefined, "usd")).toBeNull()
  })

  it("defaults a missing currency to USD", () => {
    expect(formatMoney(500, null)).toBe("$5.00")
  })
})
