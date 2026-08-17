import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"

vi.mock("@/lib/auth/sign-out", () => ({
  signOutAction: vi.fn(async () => {}),
}))

const pathnameRef: { current: string } = { current: "/" }
vi.mock("next/navigation", () => ({
  usePathname: () => pathnameRef.current,
}))

import { SiteNavClient } from "./site-nav-client"

describe("<SiteNavClient />", () => {
  afterEach(() => {
    cleanup()
    pathnameRef.current = "/"
  })

  it("marks the current route with aria-current and leaves the others unmarked", () => {
    pathnameRef.current = "/pricing"
    render(<SiteNavClient email={null} />)
    const primary = screen.getByRole("navigation", { name: /primary/i })
    const pricing = primary.querySelector('a[href="/pricing"]')
    const changelog = primary.querySelector('a[href="/changelog"]')
    expect(pricing?.getAttribute("aria-current")).toBe("page")
    expect(changelog?.getAttribute("aria-current")).toBeNull()
  })

  it("does not mark any link current on the home page (Manifesto is a hash link)", () => {
    render(<SiteNavClient email={null} />)
    const primary = screen.getByRole("navigation", { name: /primary/i })
    expect(primary.querySelector('[aria-current="page"]')).toBeNull()
  })

  it("renders a Log in link and no Download in the header when logged out (hero owns Download)", () => {
    render(<SiteNavClient email={null} />)
    expect(screen.getAllByRole("link", { name: /log in/i }).length).toBeGreaterThan(0)
    expect(screen.queryByRole("link", { name: /download/i })).toBeNull()
    expect(screen.queryByRole("button", { name: /account menu/i })).toBeNull()
  })

  it("renders an avatar with initials in place of Log in when logged in", () => {
    render(<SiteNavClient email="alice.cooper@example.com" />)
    const trigger = screen.getByRole("button", { name: /account menu/i })
    expect(trigger.textContent).toContain("AC")
    expect(screen.queryByRole("link", { name: /^log in$/i })).toBeNull()
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
