import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

import { Pricing } from "./pricing"

describe("<Pricing />", () => {
  afterEach(() => cleanup())

  it("renders Free and Pro plans at monthly price by default", () => {
    render(<Pricing />)
    expect(screen.getByRole("heading", { name: /free/i })).toBeDefined()
    expect(screen.getByRole("heading", { name: /pro/i })).toBeDefined()
    expect(screen.getByText(/\$6/)).toBeDefined()
  })

  it("toggling to yearly swaps Pro price to $58 and surfaces the $14 savings", () => {
    render(<Pricing />)
    const yearlyToggle = screen.getByRole("radio", { name: /yearly/i })
    fireEvent.click(yearlyToggle)
    expect(screen.getByText(/\$58/)).toBeDefined()
    expect(screen.getByText(/save \$14/i)).toBeDefined()
  })

  it("does not surface killed 14-day trial copy", () => {
    const { container } = render(<Pricing />)
    expect(container.textContent).not.toMatch(/14 days/i)
    expect(container.textContent).not.toMatch(/no card required/i)
  })

  it("renders the Pro CTA as an anchor when isAuthed=false", () => {
    render(<Pricing isAuthed={false} />)
    const proLink = screen.getByRole("link", { name: /get pro/i })
    expect(proLink.tagName).toBe("A")
    expect(proLink.getAttribute("href")).toMatch(/\/login\?next=.*notice=signin/)
  })

  it("renders the Pro CTA as a button when isAuthed=true", () => {
    render(<Pricing isAuthed />)
    const proButton = screen.getByRole("button", { name: /get pro/i })
    expect(proButton.tagName).toBe("BUTTON")
    expect(screen.queryByRole("link", { name: /get pro/i })).toBeNull()
  })

  it("keeps the Free plan CTA pointing to /download in both auth states", () => {
    const { rerender } = render(<Pricing isAuthed={false} />)
    expect(
      screen
        .getByRole("link", { name: /download free for macos/i })
        .getAttribute("href")
    ).toBe("/download")

    rerender(<Pricing isAuthed />)
    expect(
      screen
        .getByRole("link", { name: /download free for macos/i })
        .getAttribute("href")
    ).toBe("/download")
  })
})
