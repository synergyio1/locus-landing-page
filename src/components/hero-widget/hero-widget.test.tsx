import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"

import { heroWidget } from "@/content/heroWidget"

import { HeroWidget } from "./hero-widget"

type MatchMediaMock = ReturnType<typeof vi.fn>

function mockMatchMedia(reducedMotion: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mock: MatchMediaMock = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
    media: query,
    onchange: null,
    addEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => {
      listeners.add(cb)
    },
    removeEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => {
      listeners.delete(cb)
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
  }))
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: mock,
  })
  return mock
}

describe("HeroWidget", () => {
  beforeEach(() => {
    mockMatchMedia(false)
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it("renders three tabs, one per mode, with the correct accessible labels", () => {
    render(<HeroWidget />)
    const tabs = screen.getAllByRole("tab")
    expect(tabs).toHaveLength(heroWidget.modes.length)
    for (const mode of heroWidget.modes) {
      expect(
        screen.getByRole("tab", {
          name: new RegExp(mode.label, "i"),
        })
      ).toBeTruthy()
    }
  })

  it("defaults to Session Tracking as the selected tab", () => {
    render(<HeroWidget />)
    const tab = screen.getByRole("tab", { name: /Session Tracking/i })
    expect(tab.getAttribute("aria-selected")).toBe("true")
  })

  it("switches the visible query when a different tab is clicked", async () => {
    render(<HeroWidget />)
    const reviewTab = screen.getByRole("tab", { name: /Review Loop/i })
    fireEvent.click(reviewTab)
    expect(reviewTab.getAttribute("aria-selected")).toBe("true")
    expect(
      await screen.findByText(heroWidget.modes[2].query, undefined, {
        timeout: 2000,
      })
    ).toBeTruthy()
  })

  it("moves selection with ArrowRight / ArrowLeft / Home / End", () => {
    render(<HeroWidget />)
    const [first, second, third] = screen.getAllByRole("tab")

    first.focus()
    fireEvent.keyDown(first, { key: "ArrowRight" })
    expect(second.getAttribute("aria-selected")).toBe("true")

    fireEvent.keyDown(second, { key: "ArrowRight" })
    expect(third.getAttribute("aria-selected")).toBe("true")

    fireEvent.keyDown(third, { key: "ArrowLeft" })
    expect(second.getAttribute("aria-selected")).toBe("true")

    fireEvent.keyDown(second, { key: "End" })
    expect(third.getAttribute("aria-selected")).toBe("true")

    fireEvent.keyDown(third, { key: "Home" })
    expect(first.getAttribute("aria-selected")).toBe("true")
  })

  it("does not auto-advance while the widget is hovered", () => {
    vi.useFakeTimers()
    render(<HeroWidget />)
    const widget = screen.getByTestId("hero-widget")
    fireEvent.mouseEnter(widget)

    act(() => {
      vi.advanceTimersByTime(heroWidget.cycleIntervalMs + 200)
    })

    const tab = screen.getByRole("tab", { name: /Session Tracking/i })
    expect(tab.getAttribute("aria-selected")).toBe("true")
  })

  it("auto-advances after the cycle interval when not interacted with", () => {
    vi.useFakeTimers()
    render(<HeroWidget />)

    act(() => {
      vi.advanceTimersByTime(heroWidget.cycleIntervalMs + 50)
    })

    const dayTab = screen.getByRole("tab", { name: /Day Visibility/i })
    expect(dayTab.getAttribute("aria-selected")).toBe("true")
  })

  it("renders content statically when reduced-motion is preferred", () => {
    mockMatchMedia(true)
    vi.useFakeTimers()
    render(<HeroWidget />)

    expect(screen.getByText(heroWidget.modes[0].query)).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(heroWidget.cycleIntervalMs + 200)
    })

    const tab = screen.getByRole("tab", { name: /Session Tracking/i })
    expect(tab.getAttribute("aria-selected")).toBe("true")
  })
})
