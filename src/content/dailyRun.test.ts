import { describe, expect, it } from "vitest"

import { dailyRun } from "./dailyRun"

describe("dailyRun content", () => {
  it("section id is 'daily-run'", () => {
    expect(dailyRun.id).toBe("daily-run")
  })

  it("exposes exactly two panels: morning plan + menu bar widget", () => {
    expect(dailyRun.panels).toHaveLength(2)
    expect(dailyRun.panels[0].screenshot.src).toBe(
      "/screenshots/screens/CommandView_planning_dark.png"
    )
    expect(dailyRun.panels[1].screenshot.src).toBe(
      "/screenshots/screens/MenuBarWidget_running_dark.png"
    )
  })

  it("screenshots declare width and height", () => {
    for (const panel of dailyRun.panels) {
      expect(panel.screenshot.width).toBeGreaterThan(0)
      expect(panel.screenshot.height).toBeGreaterThan(0)
      expect(panel.screenshot.alt.length).toBeGreaterThan(0)
    }
  })

  it("has non-empty headline and body", () => {
    expect(dailyRun.headline.length).toBeGreaterThan(0)
    expect(dailyRun.body.length).toBeGreaterThan(0)
  })

  it("does not resurrect the killed 14-day trial copy", () => {
    const all = [dailyRun.headline, dailyRun.body, dailyRun.eyebrow].join(" ")
    expect(all).not.toMatch(/14 days/i)
  })
})
