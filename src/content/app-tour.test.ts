import { describe, expect, it } from "vitest"

import { appTour } from "./app-tour"

describe("app tour content", () => {
  it("describes the six-tab app, not the retired nine-screen one", () => {
    expect(appTour.title).toBe("Locus, on screen.") // pinned by tests/e2e/smoke.spec.ts
    expect(appTour.intro).toMatch(/six tabs/i)
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
