import { describe, expect, it } from "vitest"

import { hero } from "./hero"

describe("hero content", () => {
  it("primary CTA points to /download", () => {
    expect(hero.primaryCta.href).toBe("/download")
  })

  it("secondary CTA anchors to #loop", () => {
    expect(hero.secondaryCta.href).toBe("#loop")
  })

  it("screenshot resolves to the downscaled CommandView wallpaper", () => {
    expect(hero.screenshot.src).toBe(
      "/screenshots/CommandView_running_dark.png"
    )
    expect(hero.screenshot.width).toBeGreaterThan(0)
    expect(hero.screenshot.height).toBeGreaterThan(0)
  })

  it("has non-empty headline and subheadline strings", () => {
    expect(hero.headline.length).toBeGreaterThan(0)
    expect(hero.subheadline.length).toBeGreaterThan(0)
  })
})
