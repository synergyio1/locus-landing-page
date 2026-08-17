import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

import { formatPerMonth, Pricing } from "./pricing"

describe("formatPerMonth", () => {
  it("keeps whole-dollar prices bare and shows cents for the yearly equivalent", () => {
    expect(formatPerMonth(3)).toBe("3")
    expect(formatPerMonth(2.5)).toBe("2.50")
  })
})

describe("<Pricing />", () => {
  afterEach(() => cleanup())

  it("renders the headline and subline above the plan card", () => {
    render(<Pricing />)
    expect(
      screen.getByRole("heading", { name: /one plan\. all of locus\./i })
    ).toBeDefined()
    expect(screen.getByText(/30 days free, no card/i)).toBeDefined()
  })

  it("supports h1 rendering for the standalone pricing page", () => {
    render(<Pricing headingLevel="h1" />)
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /one plan\. all of locus\./i,
      })
    ).toBeDefined()
  })

  it("renders a billing-period toggle defaulting to yearly", () => {
    render(<Pricing />)
    const group = screen.getByRole("radiogroup", { name: /billing period/i })
    expect(group).toBeDefined()
    const yearly = screen.getByRole("radio", { name: /yearly/i })
    const monthly = screen.getByRole("radio", { name: /monthly/i })
    expect(yearly.getAttribute("aria-checked")).toBe("true")
    expect(monthly.getAttribute("aria-checked")).toBe("false")
  })

  it("changes billing cadence with arrow keys", () => {
    render(<Pricing />)
    const yearly = screen.getByRole("radio", { name: /yearly/i })
    const monthly = screen.getByRole("radio", { name: /monthly/i })

    fireEvent.keyDown(yearly, { key: "ArrowLeft" })

    expect(monthly.getAttribute("aria-checked")).toBe("true")
    expect(yearly.getAttribute("aria-checked")).toBe("false")
    expect(screen.getByText("3")).toBeDefined()
  })

  it("shows the yearly per-month equivalent and billed note by default", () => {
    const { container } = render(<Pricing />)
    expect(container.querySelector('[aria-live="polite"]')).toBeDefined()
    expect(screen.getByText("2.50")).toBeDefined()
    expect(screen.getByText(/\$30 billed once a year/i)).toBeDefined()
  })

  it("switches to the monthly price when the monthly radio is clicked", () => {
    render(<Pricing />)
    fireEvent.click(screen.getByRole("radio", { name: /monthly/i }))
    expect(screen.getByText("3")).toBeDefined()
    expect(screen.getByText(/billed month to month/i)).toBeDefined()
    expect(
      screen.getByRole("radio", { name: /monthly/i }).getAttribute(
        "aria-checked"
      )
    ).toBe("true")
  })

  it("surfaces the 2-months-free chip on the yearly option", () => {
    render(<Pricing />)
    expect(screen.getByText(/2 months free/i)).toBeDefined()
  })

  it("surfaces the 30-days-free chip and no-card trial note", () => {
    render(<Pricing />)
    expect(screen.getByText(/^30 days free$/i)).toBeDefined()
    expect(screen.getByText(/no card required/i)).toBeDefined()
  })

  it("renders the CTA as an anchor when isAuthed=false", () => {
    render(<Pricing isAuthed={false} />)
    const cta = screen.getByRole("link", { name: /start 30 days free/i })
    expect(cta.tagName).toBe("A")
    expect(cta.getAttribute("href")).toMatch(/\/login\?next=.*notice=signin/)
  })

  it("renders the CTA as a button when isAuthed=true", () => {
    render(<Pricing isAuthed />)
    expect(
      screen.getByRole("button", { name: /start 30 days free/i }).tagName
    ).toBe("BUTTON")
  })

  it("renders the AI choice rail with BYO included and Locus Remote as prepaid credits", () => {
    render(<Pricing />)
    expect(screen.getByText(/bring your own ai/i)).toBeDefined()
    expect(screen.getByText(/^locus remote$/i)).toBeDefined()
    expect(screen.getByText(/optional · prepaid credits/i)).toBeDefined()
    expect(screen.getByText(/^included$/i)).toBeDefined()
    expect(screen.getByText(/any amount, one-off/i)).toBeDefined()
  })

  it("does not render a feature list between the price and the AI rail", () => {
    const { container } = render(<Pricing />)
    expect(container.textContent).not.toMatch(/everything, on day one/i)
    expect(screen.queryByRole("heading", { name: /^focus$/i })).toBeNull()
    expect(screen.queryByRole("heading", { name: /^sentinel$/i })).toBeNull()
    expect(screen.queryByRole("heading", { name: /^review$/i })).toBeNull()
    expect(container.textContent).not.toMatch(/timed sessions/i)
  })

  it("does not render removed pricing feature claims", () => {
    const { container } = render(<Pricing />)
    expect(container.textContent).not.toMatch(/smart plan/i)
    expect(container.textContent).not.toMatch(/routines/i)
    expect(container.textContent).not.toMatch(/memory/i)
    expect(container.textContent).not.toMatch(/the full loop/i)
    expect(container.textContent).not.toMatch(/weekly review/i)
    expect(container.textContent).not.toMatch(/live ai classification/i)
    expect(container.textContent).not.toMatch(/google calendar sync/i)
    expect(container.textContent).not.toMatch(/drift catch/i)
    expect(container.textContent).not.toMatch(/by email/i)
    expect(container.textContent).not.toMatch(/managed ai/i)
    expect(container.textContent).not.toMatch(/\$8\b/)
    expect(container.textContent).not.toMatch(/14 days/i)
  })

  it("renders the tertiary download link pointing to /download", () => {
    render(<Pricing />)
    const link = screen.getByRole("link", {
      name: /download for macos/i,
    })
    expect(link.getAttribute("href")).toBe("/download")
  })
})
