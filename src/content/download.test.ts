import { describe, expect, it } from "vitest"

import { MAC_DOWNLOAD_URL, download } from "./download"

describe("download content", () => {
  it("states the macOS Tahoe requirement", () => {
    expect(download.requirement).toMatch(/macOS\s+Tahoe/i)
  })

  it("primary CTA points directly to the current macOS DMG", () => {
    expect(download.cta.href).toBe(MAC_DOWNLOAD_URL)
    expect(download.cta.href).toMatch(/\.dmg$/)
    expect(download.cta.href.startsWith("mailto:")).toBe(false)
  })

  it("primary CTA says the macOS download is free", () => {
    expect(download.cta.label).toMatch(/download free for macos/i)
  })

  it("has non-empty headline and body strings", () => {
    expect(download.headline.length).toBeGreaterThan(0)
    expect(download.body.length).toBeGreaterThan(0)
    expect(`${download.headline} ${download.body}`).not.toMatch(/coming soon/i)
  })
})
