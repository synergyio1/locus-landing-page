import { describe, expect, it } from "vitest"

import { download } from "./download"

describe("download content", () => {
  it("states the macOS 14 Sonoma requirement", () => {
    expect(download.requirement).toMatch(/macOS\s+14\s+Sonoma/i)
  })

  it("notify CTA uses a mailto: scheme", () => {
    expect(download.notify.href.startsWith("mailto:")).toBe(true)
  })

  it("has non-empty headline and body strings", () => {
    expect(download.headline.length).toBeGreaterThan(0)
    expect(download.body.length).toBeGreaterThan(0)
  })
})
