import { describe, expect, it } from "vitest"

import { isMacUserAgent, refineIsMac } from "./detect"

const MAC_SAFARI =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
// iPadOS in its default desktop mode — byte-identical shape to a real Mac.
const IPAD_DESKTOP_MODE = MAC_SAFARI
const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
const IPAD_MOBILE_MODE =
  "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
const WINDOWS =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

describe("isMacUserAgent", () => {
  it("accepts a real Mac", () => {
    expect(isMacUserAgent(MAC_SAFARI)).toBe(true)
  })

  it("rejects iPhone, which carries 'like Mac OS X'", () => {
    expect(isMacUserAgent(IPHONE)).toBe(false)
  })

  it("rejects an iPad that identifies itself", () => {
    expect(isMacUserAgent(IPAD_MOBILE_MODE)).toBe(false)
  })

  it("rejects Android and Windows", () => {
    expect(isMacUserAgent(ANDROID)).toBe(false)
    expect(isMacUserAgent(WINDOWS)).toBe(false)
  })

  it("rejects a missing user agent rather than guessing", () => {
    expect(isMacUserAgent(null)).toBe(false)
    expect(isMacUserAgent(undefined)).toBe(false)
    expect(isMacUserAgent("")).toBe(false)
  })
})

describe("refineIsMac", () => {
  it("keeps a Mac that has no touchscreen", () => {
    expect(refineIsMac(true, 0)).toBe(true)
  })

  it("demotes an iPad in desktop mode, which the UA cannot catch", () => {
    expect(isMacUserAgent(IPAD_DESKTOP_MODE)).toBe(true)
    expect(refineIsMac(true, 5)).toBe(false)
  })

  it("never promotes a non-Mac", () => {
    expect(refineIsMac(false, 0)).toBe(false)
  })
})
