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

  it("primary CTA does not call the product free — only the trial is", () => {
    expect(download.cta.label).toMatch(/download for macos/i)
    expect(download.cta.label).not.toMatch(/free/i)
  })

  it("body routes the visitor into the 7-day in-app trial", () => {
    expect(download.body).toMatch(/7-day/i)
    expect(download.body).not.toMatch(/14-day|30-day/i)
    expect(download.body).toMatch(/no card/i)
  })

  it("has non-empty headline and body strings", () => {
    expect(download.headline.length).toBeGreaterThan(0)
    expect(download.body.length).toBeGreaterThan(0)
    expect(`${download.headline} ${download.body}`).not.toMatch(/coming soon/i)
  })
})
