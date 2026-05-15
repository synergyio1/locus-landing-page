import { describe, expect, it } from "vitest"

import { hero } from "./hero"

describe("hero content", () => {
  it("primary CTA points to /download", () => {
    expect(hero.primaryCta.href).toBe("/download")
  })

  it("secondary CTA anchors to the system demonstration", () => {
    expect(hero.secondaryCta.href).toBe("#day-in-locus")
  })

  it("has non-empty headline and subheadline strings", () => {
    expect(hero.headline.length).toBeGreaterThan(0)
    expect(hero.subheadline.length).toBeGreaterThan(0)
  })

  it("leads with the modern-work OS positioning", () => {
    expect(hero.headline).toMatch(/missing OS for modern work/i)
  })
})
