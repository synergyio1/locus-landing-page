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

  it("leads with the missing-OS category positioning (user-locked 2026-07-06)", () => {
    expect(hero.headline).toMatch(/missing OS for modern work/i)
  })

  it("names the structural differentiators in the subheadline", () => {
    expect(hero.subheadline).toMatch(/on your mac/i)
    expect(hero.subheadline).toMatch(/AI you already pay for/i)
  })

  it("does not call the product free — only the trial is free", () => {
    expect(hero.primaryCta.label).not.toMatch(/free/i)
  })
})
