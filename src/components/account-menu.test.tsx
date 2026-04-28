import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

vi.mock("@/lib/auth/sign-out", () => ({
  signOutAction: vi.fn(async () => {}),
}))

import { AccountMenu } from "./account-menu"

describe("AccountMenu", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders an avatar button with initials derived from the email", () => {
    render(<AccountMenu email="alice.cooper@example.com" />)
    const trigger = screen.getByRole("button", { name: /account menu/i })
    expect(trigger.textContent).toContain("AC")
  })

  it("does not render menu items until the trigger is clicked", () => {
    render(<AccountMenu email="alice.cooper@example.com" />)
    expect(screen.queryByRole("menuitem", { name: /account/i })).toBeNull()
    expect(screen.queryByRole("menuitem", { name: /log out/i })).toBeNull()
  })

  it("opens a dropdown with Account and Log out items when clicked", () => {
    render(<AccountMenu email="alice.cooper@example.com" />)
    fireEvent.click(screen.getByRole("button", { name: /account menu/i }))

    const accountItem = screen.getByRole("menuitem", { name: /account/i })
    const logoutItem = screen.getByRole("menuitem", { name: /log out/i })
    expect(accountItem.getAttribute("href")).toBe("/account")
    expect(logoutItem).toBeTruthy()
  })

  it("closes when Escape is pressed and returns focus to the trigger", () => {
    render(<AccountMenu email="alice.cooper@example.com" />)
    const trigger = screen.getByRole("button", { name: /account menu/i })
    fireEvent.click(trigger)
    expect(screen.getByRole("menu")).toBeTruthy()

    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("menu")).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it("closes when clicking outside the dropdown", () => {
    render(
      <div>
        <AccountMenu email="alice.cooper@example.com" />
        <button type="button">outside</button>
      </div>
    )
    fireEvent.click(screen.getByRole("button", { name: /account menu/i }))
    expect(screen.getByRole("menu")).toBeTruthy()

    fireEvent.mouseDown(screen.getByRole("button", { name: /outside/i }))
    expect(screen.queryByRole("menu")).toBeNull()
  })

  it("moves focus into the dropdown when it opens", () => {
    render(<AccountMenu email="alice.cooper@example.com" />)
    fireEvent.click(screen.getByRole("button", { name: /account menu/i }))
    const accountItem = screen.getByRole("menuitem", { name: /account/i })
    expect(document.activeElement).toBe(accountItem)
  })
})
