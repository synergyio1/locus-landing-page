import { describe, expect, it } from "vitest"

import { heroWidget } from "./heroWidget"

describe("heroWidget content", () => {
  it("ships exactly three modes in PRD order", () => {
    expect(heroWidget.modes).toHaveLength(3)
    expect(heroWidget.modes.map((m) => m.id)).toEqual([
      "session-tracking",
      "day-visibility",
      "review-loop",
    ])
  })

  it("uses the approved PRD labels verbatim", () => {
    expect(heroWidget.modes[0].label).toBe("Session Tracking")
    expect(heroWidget.modes[1].label).toBe("Day Visibility")
    expect(heroWidget.modes[2].label).toBe("Review Loop")
  })

  it("every mode carries query, results, meta, preview, and footer copy", () => {
    for (const mode of heroWidget.modes) {
      expect(mode.query.length).toBeGreaterThan(0)
      expect(mode.eyebrow.length).toBeGreaterThan(0)
      expect(mode.resultRows.length).toBeGreaterThan(0)
      expect(mode.meta.length).toBeGreaterThan(0)
      expect(mode.previewImage.src.length).toBeGreaterThan(0)
      expect(mode.previewImage.alt.length).toBeGreaterThan(0)
      expect(mode.footerLabel.length).toBeGreaterThan(0)
      expect(mode.footerAction.length).toBeGreaterThan(0)
    }
  })

  it("preview images resolve to assets under /screenshots/screens/", () => {
    for (const mode of heroWidget.modes) {
      expect(mode.previewImage.src.startsWith("/screenshots/screens/")).toBe(
        true
      )
      expect(mode.previewImage.width).toBeGreaterThan(0)
      expect(mode.previewImage.height).toBeGreaterThan(0)
    }
  })

  it("scenario shows both work and personal goals across the three modes", () => {
    const corpus = heroWidget.modes
      .flatMap((mode) => [
        mode.query,
        ...mode.resultRows.flatMap((row) => [row.title, row.subtitle]),
        ...mode.meta.flatMap(([k, v]) => [k, v]),
      ])
      .join(" ")
      .toLowerCase()

    const workMatch = /q3|memo|onboarding|launch|linear|review/.test(corpus)
    const personalMatch = /french|dentist|run|personal/.test(corpus)

    expect(workMatch).toBe(true)
    expect(personalMatch).toBe(true)
  })

  it("auto-cycle interval is set to a calm, human pace (>= 3s)", () => {
    expect(heroWidget.cycleIntervalMs).toBeGreaterThanOrEqual(3000)
  })

  it("avoids generic AI-purple / glow / magic tropes in mode copy", () => {
    const corpus = heroWidget.modes
      .flatMap((mode) => [mode.label, mode.hint, mode.query])
      .join(" ")
      .toLowerCase()
    expect(corpus.includes("magic")).toBe(false)
    expect(corpus.includes("purple")).toBe(false)
    expect(corpus.includes("glow")).toBe(false)
  })
})
