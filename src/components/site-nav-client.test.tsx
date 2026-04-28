import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

vi.mock("@/lib/auth/sign-out", () => ({
  signOutAction: vi.fn(async () => {}),
}))

import { SiteNavClient } from "./site-nav-client"

describe("<SiteNavClient />", () => {
  afterEach(() => cleanup())

  it("renders the Download CTA when logged out", () => {
    render(<SiteNavClient email={null} />)
    const downloads = screen.getAllByRole("link", { name: /download/i })
    expect(downloads.length).toBeGreaterThan(0)
    expect(screen.queryByRole("button", { name: /account menu/i })).toBeNull()
  })

  it("renders an avatar with initials in place of the desktop Download CTA when logged in", () => {
    render(<SiteNavClient email="alice.cooper@example.com" />)
    const trigger = screen.getByRole("button", { name: /account menu/i })
    expect(trigger.textContent).toContain("AC")
    expect(
      screen.queryByRole("link", { name: /^download$/i })
    ).toBeNull()
  })

  it("appends Account and Log out to the mobile sheet when logged in", () => {
    const { container } = render(<SiteNavClient email="alice.cooper@example.com" />)
    const sheet = container.querySelector("#site-nav-sheet")
    expect(sheet).toBeTruthy()
    expect(
      sheet?.querySelector('a[href="/account"]')?.textContent
    ).toMatch(/account/i)
    expect(
      Array.from(sheet?.querySelectorAll("button") ?? []).some((b) =>
        /log out/i.test(b.textContent ?? "")
      )
    ).toBe(true)
  })

  it("leaves the mobile sheet without Account/Log out when logged out", () => {
    const { container } = render(<SiteNavClient email={null} />)
    const sheet = container.querySelector("#site-nav-sheet")
    expect(sheet?.querySelector('a[href="/account"]')).toBeNull()
    expect(
      Array.from(sheet?.querySelectorAll("button") ?? []).some((b) =>
        /log out/i.test(b.textContent ?? "")
      )
    ).toBe(false)
  })
})
