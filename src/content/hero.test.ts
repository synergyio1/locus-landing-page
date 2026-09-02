import { describe, expect, it } from "vitest"

import { hero } from "./hero"

describe("hero content", () => {
  it("primary CTA points to /download", () => {
    expect(hero.primaryCta.href).toBe("/download")
  })

  it("secondary CTA anchors to the manifesto", () => {
    expect(hero.secondaryCta.href).toBe("#manifesto")
    expect(hero.secondaryCta.label).toMatch(/manifesto/i)
  })

  it("has non-empty headline and subheadline strings", () => {
    expect(hero.headline.length).toBeGreaterThan(0)
    expect(hero.subheadline.length).toBeGreaterThan(0)
  })

  it("leads with the missing-OS category positioning (user-locked 2026-07-06)", () => {
    expect(hero.headline).toMatch(/missing OS for modern work/i)
  })

  it("closes the headline with the platform on its own line (Luis, 2026-09-02)", () => {
    expect(hero.headlineTail).toBe("For macOS.")
  })

  it("subheadline is the manifesto's spine, unadorned (Luis, 2026-08-17)", () => {
    expect(hero.subheadline).toBe(
      "One system you can trust with your whole day. Learn from every day, and let the small changes compound."
    )
  })

  it("does not call the product free — only the trial is free", () => {
    expect(hero.primaryCta.label).not.toMatch(/free/i)
  })
})
