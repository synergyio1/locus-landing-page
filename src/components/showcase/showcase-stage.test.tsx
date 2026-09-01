import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
    loading,
  }: {
    src: string
    alt: string
    className?: string
    loading?: "eager" | "lazy"
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} loading={loading} />
  ),
}))

import { appShowcase } from "@/content/app-showcase"
import { ShowcaseStage } from "./showcase-stage"

function visiblePanel() {
  const panels = document.querySelectorAll('[role="tabpanel"][aria-hidden="false"]')
  expect(panels).toHaveLength(1)
  return panels[0] as HTMLElement
}

function visibleAlt(panel: HTMLElement) {
  const pane = panel.querySelector('[data-active="true"] img') as HTMLImageElement | null
  return pane?.alt ?? ""
}

/** jsdom reports "prerender"; the auto-advance keys off "hidden", so say which. */
function pretendVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", { value: state, configurable: true })
  return () => {
    delete (document as unknown as Record<string, unknown>).visibilityState
  }
}

describe("<ShowcaseStage />", () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it("renders one tab per app tab plus Chat, first selected, wired to its panel", () => {
    render(<ShowcaseStage content={appShowcase} idBase="t" />)
    const tabs = screen.getAllByRole("tab")
    expect(tabs).toHaveLength(7)
    expect(tabs.map((t) => t.textContent)).toEqual([
      "HomeHome",
      "VisionVision",
      "PathPath",
      "ExecutionExecution",
      "NotesNotes",
      "SystemSystem",
      "ChatChat",
    ])
    expect(tabs[0].getAttribute("aria-selected")).toBe("true")
    expect(tabs[0].tabIndex).toBe(0)
    for (const tab of tabs.slice(1)) {
      expect(tab.getAttribute("aria-selected")).toBe("false")
      expect(tab.tabIndex).toBe(-1)
    }
    for (const tab of tabs) {
      const panel = document.getElementById(tab.getAttribute("aria-controls")!)
      expect(panel?.getAttribute("role")).toBe("tabpanel")
      expect(panel?.getAttribute("aria-labelledby")).toBe(tab.id)
    }
    expect(visibleAlt(visiblePanel())).toMatch(/home tab/i)
  })

  // The caption swaps through `AnimatePresence mode="wait"`, so its text
  // lands a beat after the click — hence `findBy*` for anything in it.
  it("shows the shortcut chips: ⌘1–⌘6 for the tabs, ⌘J for chat", async () => {
    render(<ShowcaseStage content={appShowcase} idBase="t" />)
    expect(screen.getByText("⌘1")).toBeDefined()
    fireEvent.click(screen.getByRole("tab", { name: /system/i }))
    expect(await screen.findByText("⌘6")).toBeDefined()
    fireEvent.click(screen.getByRole("tab", { name: /chat/i }))
    expect(await screen.findByText("⌘J")).toBeDefined()
    expect(await screen.findByRole("list", { name: /chat controls/i })).toBeDefined()
    expect(visibleAlt(visiblePanel())).toMatch(/^chat expanded/i)
  })

  it("moves selection and focus with the arrow keys, Home and End", () => {
    render(<ShowcaseStage content={appShowcase} idBase="t" />)
    const tablist = screen.getByRole("tablist", { name: /locus tabs/i })
    fireEvent.keyDown(tablist, { key: "ArrowRight" })
    const vision = screen.getByRole("tab", { name: /vision/i })
    expect(vision.getAttribute("aria-selected")).toBe("true")
    expect(document.activeElement).toBe(vision)

    fireEvent.keyDown(tablist, { key: "End" })
    expect(screen.getByRole("tab", { name: /chat/i }).getAttribute("aria-selected")).toBe("true")
    fireEvent.keyDown(tablist, { key: "ArrowRight" }) // wraps
    expect(screen.getByRole("tab", { name: /home/i }).getAttribute("aria-selected")).toBe("true")
    fireEvent.keyDown(tablist, { key: "ArrowLeft" }) // wraps back
    expect(screen.getByRole("tab", { name: /chat/i }).getAttribute("aria-selected")).toBe("true")
    fireEvent.keyDown(tablist, { key: "Home" })
    expect(screen.getByRole("tab", { name: /home/i }).getAttribute("aria-selected")).toBe("true")
  })

  it("gives Path a pane switch that flips the visible capture", () => {
    render(<ShowcaseStage content={appShowcase} idBase="t" />)
    expect(screen.queryByRole("group", { name: /path view/i })).toBeNull()

    fireEvent.click(screen.getByRole("tab", { name: /path/i }))
    const group = screen.getByRole("group", { name: /path view/i })
    expect(group).toBeDefined()
    const commitments = screen.getByRole("button", { name: "Commitments" })
    const tasks = screen.getByRole("button", { name: "Tasks" })
    expect(commitments.getAttribute("aria-pressed")).toBe("true")
    expect(visibleAlt(visiblePanel())).toMatch(/commitments/i)

    fireEvent.click(tasks)
    expect(tasks.getAttribute("aria-pressed")).toBe("true")
    expect(commitments.getAttribute("aria-pressed")).toBe("false")
    expect(visibleAlt(visiblePanel())).toMatch(/tasks/i)

    // Leaving Path resets the pane, so coming back lands on Commitments again.
    fireEvent.click(screen.getByRole("tab", { name: /notes/i }))
    fireEvent.click(screen.getByRole("tab", { name: /path/i }))
    expect(screen.getByRole("button", { name: "Commitments" }).getAttribute("aria-pressed")).toBe("true")
  })

  it("auto-advances while untouched and stops at the first interaction", () => {
    vi.useFakeTimers()
    const restore = pretendVisibility("visible")
    try {
      render(<ShowcaseStage content={appShowcase} idBase="t" autoAdvance />)
      act(() => {
        vi.advanceTimersByTime(appShowcase.autoAdvanceMs)
      })
      expect(screen.getByRole("tab", { name: /vision/i }).getAttribute("aria-selected")).toBe("true")

      fireEvent.click(screen.getByRole("tab", { name: /system/i }))
      act(() => {
        vi.advanceTimersByTime(appShowcase.autoAdvanceMs * 3)
      })
      expect(screen.getByRole("tab", { name: /system/i }).getAttribute("aria-selected")).toBe("true")
    } finally {
      restore()
    }
  })

  it("idles while the document is hidden", () => {
    vi.useFakeTimers()
    const restore = pretendVisibility("hidden")
    try {
      render(<ShowcaseStage content={appShowcase} idBase="t" autoAdvance />)
      act(() => {
        vi.advanceTimersByTime(appShowcase.autoAdvanceMs * 2)
      })
      expect(screen.getByRole("tab", { name: /home/i }).getAttribute("aria-selected")).toBe("true")
    } finally {
      restore()
    }
  })

  it("never auto-advances under reduced motion", () => {
    vi.useFakeTimers()
    const restore = pretendVisibility("visible")
    const original = window.matchMedia
    window.matchMedia = ((query: string) =>
      ({
        matches: query.includes("reduce"),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList) as typeof window.matchMedia
    try {
      render(<ShowcaseStage content={appShowcase} idBase="t" autoAdvance />)
      act(() => {
        vi.advanceTimersByTime(appShowcase.autoAdvanceMs * 2)
      })
      expect(screen.getByRole("tab", { name: /home/i }).getAttribute("aria-selected")).toBe("true")
    } finally {
      window.matchMedia = original
      restore()
    }
  })

  it("keeps the write-up behind a 'More about' toggle in the caption", async () => {
    render(<ShowcaseStage content={appShowcase} idBase="t" />)
    const more = screen.getByRole("button", { name: /more about home/i })
    expect(more.getAttribute("aria-expanded")).toBe("false")
    const region = document.getElementById(more.getAttribute("aria-controls")!)!
    expect(region.firstElementChild!.getAttribute("aria-hidden")).toBe("true")
    expect(region.textContent).toContain(appShowcase.tabs[0].body[0])
    expect(region.textContent).toContain(appShowcase.tabs[0].handoff)

    fireEvent.click(more)
    expect(more.getAttribute("aria-expanded")).toBe("true")
    expect(region.firstElementChild!.getAttribute("aria-hidden")).toBe("false")
    expect(screen.getByRole("button", { name: /^less$/i })).toBeDefined()

    // Changing tab collapses it again, and the toggle names the new tab.
    fireEvent.click(screen.getByRole("tab", { name: /vision/i }))
    const next = await screen.findByRole("button", { name: /more about vision/i })
    expect(next.getAttribute("aria-expanded")).toBe("false")
  })

  it("on md+ shows the write-up as a side panel over the desktop, pinned by click", () => {
    const original = window.matchMedia
    window.matchMedia = ((query: string) =>
      ({
        matches: query.includes("min-width: 768px"),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList) as typeof window.matchMedia
    try {
      render(<ShowcaseStage content={appShowcase} idBase="t" />)
      // RTL won't resolve an aria-hidden landmark by name; address it by id.
      const region = document.getElementById("t-more")!
      expect(region.getAttribute("role")).toBe("region")
      expect(region.getAttribute("aria-label")).toBe("About Home")
      expect(region.getAttribute("aria-hidden")).toBe("true")
      expect(region.hasAttribute("inert")).toBe(true)
      expect(region.textContent).toContain(appShowcase.tabs[0].body[0])
      expect(region.textContent).toContain(appShowcase.tabs[0].handoff)

      // The trigger is a pill at the desktop's top-right, not in the caption.
      expect(screen.queryByRole("button", { name: /more about home/i })).toBeNull()
      const more = screen.getByRole("button", { name: /^about home$/i })
      fireEvent.click(more)
      expect(region.getAttribute("aria-hidden")).toBe("false")
      expect(more.getAttribute("aria-expanded")).toBe("true")

      fireEvent.click(screen.getByRole("button", { name: /^close$/i }))
      expect(region.getAttribute("aria-hidden")).toBe("true")
      expect(more.getAttribute("aria-expanded")).toBe("false")

      // Escape closes it too.
      fireEvent.click(more)
      expect(region.getAttribute("aria-hidden")).toBe("false")
      fireEvent.keyDown(region, { key: "Escape" })
      expect(region.getAttribute("aria-hidden")).toBe("true")
    } finally {
      window.matchMedia = original
    }
  })

  it("loads the first capture eagerly only when told it is above the fold", () => {
    const { unmount } = render(<ShowcaseStage content={appShowcase} idBase="t" eager />)
    const imgs = document.querySelectorAll("img")
    expect(imgs[0].getAttribute("loading")).toBe("eager")
    expect(imgs[1].getAttribute("loading")).toBe("lazy")
    unmount()

    render(<ShowcaseStage content={appShowcase} idBase="u" />)
    expect(document.querySelectorAll("img")[0].getAttribute("loading")).toBe("lazy")
  })
})
