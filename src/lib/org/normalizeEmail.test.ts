import { describe, expect, it } from "vitest"

import { isUsableEmail, normalizeEmail, normalizeEmailList } from "./normalizeEmail"

describe("normalizeEmail", () => {
  it("matches the database's lower(btrim(email))", () => {
    expect(normalizeEmail("  Bob@Acme.com ")).toBe("bob@acme.com")
    expect(normalizeEmail("BOB@ACME.COM")).toBe("bob@acme.com")
  })

  it("leaves an already-canonical address untouched", () => {
    expect(normalizeEmail("bob@acme.com")).toBe("bob@acme.com")
  })
})

describe("isUsableEmail", () => {
  it("rejects blanks and obvious paste accidents", () => {
    for (const bad of ["", "   ", "bob", "@acme.com", "bob@", "bob acme@x.com"]) {
      expect(isUsableEmail(bad), bad).toBe(false)
    }
  })

  it("accepts an ordinary address regardless of casing or padding", () => {
    expect(isUsableEmail(" Bob@Acme.com ")).toBe(true)
  })
})

describe("normalizeEmailList", () => {
  it("collapses addresses that differ only by case or whitespace", () => {
    // The buyer typing the same person twice must be charged for one seat.
    expect(normalizeEmailList(["Bob@acme.com", "bob@acme.com ", "BOB@ACME.COM"]))
      .toEqual(["bob@acme.com"])
  })

  it("drops unusable entries without failing the whole list", () => {
    expect(normalizeEmailList(["bob@acme.com", "", "  ", "nope"]))
      .toEqual(["bob@acme.com"])
  })

  it("preserves first-seen order", () => {
    expect(normalizeEmailList(["b@x.com", "a@x.com", "b@x.com"]))
      .toEqual(["b@x.com", "a@x.com"])
  })
})
