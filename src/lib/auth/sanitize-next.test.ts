import { describe, expect, it } from "vitest"

import { DEFAULT_NEXT, sanitizeNext } from "./sanitize-next"

describe("sanitizeNext", () => {
  it("keeps a same-site path, query string and hash included", () => {
    expect(sanitizeNext("/billing")).toBe("/billing")
    expect(sanitizeNext("/account?welcome=1")).toBe("/account?welcome=1")
    expect(sanitizeNext("/#pricing")).toBe("/#pricing")
  })

  it("falls back to the account page when nothing usable was given", () => {
    expect(sanitizeNext(undefined)).toBe(DEFAULT_NEXT)
    expect(sanitizeNext(null)).toBe(DEFAULT_NEXT)
    expect(sanitizeNext("")).toBe(DEFAULT_NEXT)
    expect(sanitizeNext("account")).toBe(DEFAULT_NEXT)
  })

  it("refuses anything that could leave the site", () => {
    expect(sanitizeNext("https://evil.example.com/steal")).toBe(DEFAULT_NEXT)
    expect(sanitizeNext("//evil.example.com")).toBe(DEFAULT_NEXT)
    expect(sanitizeNext("/\\evil.example.com")).toBe(DEFAULT_NEXT)
    expect(sanitizeNext("/billing\nLocation: x")).toBe(DEFAULT_NEXT)
  })
})
