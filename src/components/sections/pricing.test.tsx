import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

import { Pricing } from "./pricing"

describe("<Pricing />", () => {
  afterEach(() => cleanup())

  it("renders the headline and subline above the plan card", () => {
    render(<Pricing />)
    expect(
      screen.getByRole("heading", { name: /one plan\. all of locus\./i })
    ).toBeDefined()
    expect(screen.getByText(/14 days free, no card/i)).toBeDefined()
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
    expect(screen.getByText("6")).toBeDefined()
  })

  it("shows the yearly per-month price and billed note by default", () => {
    const { container } = render(<Pricing />)
    expect(container.querySelector('[aria-live="polite"]')).toBeDefined()
    expect(screen.getByText("4")).toBeDefined()
    expect(screen.getByText(/\$48 billed once a year/i)).toBeDefined()
  })

  it("switches to the monthly price when the monthly radio is clicked", () => {
    render(<Pricing />)
    fireEvent.click(screen.getByRole("radio", { name: /monthly/i }))
    expect(screen.getByText("6")).toBeDefined()
    expect(screen.getByText(/billed month to month/i)).toBeDefined()
    expect(
      screen.getByRole("radio", { name: /monthly/i }).getAttribute(
        "aria-checked"
      )
    ).toBe("true")
  })

  it("surfaces the Save 33% chip on the yearly option", () => {
    render(<Pricing />)
    expect(screen.getByText(/save 33%/i)).toBeDefined()
  })

  it("surfaces the 14-days-free chip and no-card trial note", () => {
    render(<Pricing />)
    expect(screen.getByText(/^14 days free$/i)).toBeDefined()
    expect(screen.getByText(/no card required/i)).toBeDefined()
  })

  it("renders the CTA as an anchor when isAuthed=false", () => {
    render(<Pricing isAuthed={false} />)
    const cta = screen.getByRole("link", { name: /start 14 days free/i })
    expect(cta.tagName).toBe("A")
    expect(cta.getAttribute("href")).toMatch(/\/login\?next=.*notice=signin/)
  })

  it("renders the CTA as a button when isAuthed=true", () => {
    render(<Pricing isAuthed />)
    expect(
      screen.getByRole("button", { name: /start 14 days free/i }).tagName
    ).toBe("BUTTON")
  })

  it("renders the AI choice rail with BYO included and managed as an add-on", () => {
    render(<Pricing />)
    expect(screen.getByText(/bring your own ai/i)).toBeDefined()
    expect(screen.getByText(/locus managed ai/i)).toBeDefined()
    expect(screen.getByText(/optional · \$8\/mo/i)).toBeDefined()
    expect(screen.getByText(/^included$/i)).toBeDefined()
  })

  it("renders the three feature tabs and their decided feature lines", () => {
    render(<Pricing />)
    expect(screen.getByText(/everything, on day one/i)).toBeDefined()
    expect(screen.getByRole("heading", { name: /^focus$/i })).toBeDefined()
    expect(screen.getByRole("heading", { name: /^sentinel$/i })).toBeDefined()
    expect(screen.getByRole("heading", { name: /^review$/i })).toBeDefined()
    expect(screen.getByText(/declare intent\. work it\./i)).toBeDefined()
    expect(screen.getByText(/see where the day really goes\./i)).toBeDefined()
    expect(screen.getByText(/learn what actually moved\./i)).toBeDefined()
    expect(
      screen.getByText(/timed sessions with a live focus score/i)
    ).toBeDefined()
    expect(screen.getByText(/plan the day around your calendar/i)).toBeDefined()
    expect(
      screen.getByText(/quiet activity logging between sessions/i)
    ).toBeDefined()
    expect(
      screen.getByText(/budgets for the apps that eat your time/i)
    ).toBeDefined()
    expect(
      screen.getByText(/daily, weekly, and monthly digests/i)
    ).toBeDefined()
    expect(
      screen.getByText(/disagree — it remembers your corrections/i)
    ).toBeDefined()
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
  })

  it("renders the tertiary download link pointing to /download", () => {
    render(<Pricing />)
    const link = screen.getByRole("link", {
      name: /download for macos/i,
    })
    expect(link.getAttribute("href")).toBe("/download")
  })
})
