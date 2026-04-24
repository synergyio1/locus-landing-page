import { afterEach, describe, expect, it } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

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
})
