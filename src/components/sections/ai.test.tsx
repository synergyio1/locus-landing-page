import { afterEach, describe, expect, it } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"

import { Ai } from "./ai"

describe("<Ai />", () => {
  afterEach(() => cleanup())


  it("renders all three classification pills as tabs", () => {
    render(<Ai />)
    expect(screen.getByRole("tab", { name: /on track/i })).toBeDefined()
    expect(screen.getByRole("tab", { name: /unknown/i })).toBeDefined()
    expect(screen.getByRole("tab", { name: /off track/i })).toBeDefined()
  })

  it("swaps the example copy when the user hovers a different pill", () => {
    render(<Ai />)

    const offTrack = screen.getByRole("tab", { name: /off track/i })
    fireEvent.mouseEnter(offTrack)
    expect(screen.getByText(/chrome on twitter/i)).toBeDefined()

    const unknown = screen.getByRole("tab", { name: /unknown/i })
    fireEvent.mouseEnter(unknown)
    expect(screen.getByText(/unclassified window title/i)).toBeDefined()

    const onTrack = screen.getByRole("tab", { name: /on track/i })
    fireEvent.mouseEnter(onTrack)
    expect(screen.getByText(/chrome on a pull request/i)).toBeDefined()
  })

  it("marks the hovered pill as selected via aria-selected", () => {
    render(<Ai />)
    const offTrack = screen.getByRole("tab", { name: /off track/i })
    fireEvent.mouseEnter(offTrack)
    expect(offTrack.getAttribute("aria-selected")).toBe("true")

    const onTrack = screen.getByRole("tab", { name: /on track/i })
    expect(onTrack.getAttribute("aria-selected")).toBe("false")
  })
})
