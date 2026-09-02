import { describe, expect, it } from "vitest"

import { appTour } from "./app-tour"

describe("app tour content", () => {
  it("describes the six-tab app, not the retired nine-screen one", () => {
    // Pinned by tests/e2e/smoke.spec.ts. "Locus, on screen." retired 2026-09-02.
    expect(appTour.title).toBe("From your decade down to today.")
    expect(appTour.intro).toMatch(/six tabs/i)
    // Luis's line (2026-09-02): six tabs, one smart copilot by chat or voice.
    expect(appTour.intro).toMatch(/one smart copilot/)
    expect(appTour.intro).toMatch(/chat in the title bar, or just your voice/)
    expect(appTour.intro).toMatch(/on the AI you already pay for\.$/)
    // The closer that repeated the intro's last sentence was cut the same day.
    expect(JSON.stringify(appTour)).not.toMatch(/Everything above runs on your Mac/)
    expect(JSON.stringify(appTour)).not.toMatch(/nine screens|three families|last three screens/i)
  })

  it("keeps the walkthrough inside the 45–75s brief once it lands", () => {
    const video = appTour.video
    if (!video) return
    expect(video.duration).toBeGreaterThanOrEqual(45)
    expect(video.duration).toBeLessThanOrEqual(75)
    expect(video.src).toMatch(/^\/.+\.(mp4|webm)$/)
    expect(video.poster).toMatch(/^\/.+\.(jpg|jpeg|png|webp)$/)
    expect(video.width).toBeGreaterThan(0)
    expect(video.height).toBeGreaterThan(0)
  })
})
