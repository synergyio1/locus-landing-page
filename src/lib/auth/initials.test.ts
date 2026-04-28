import { describe, expect, it } from "vitest"

import { initialsFromEmail } from "./initials"

describe("initialsFromEmail", () => {
  it("returns the first letter of each token for first.last@", () => {
    expect(initialsFromEmail("alice.cooper@example.com")).toBe("AC")
  })

  it("uses underscore as a token separator", () => {
    expect(initialsFromEmail("alice_cooper@example.com")).toBe("AC")
  })

  it("uses hyphen as a token separator", () => {
    expect(initialsFromEmail("alice-cooper@example.com")).toBe("AC")
  })

  it("falls back to the first two characters for a single-token local", () => {
    expect(initialsFromEmail("alice@example.com")).toBe("AL")
  })

  it("returns a single uppercase character for a single-character local", () => {
    expect(initialsFromEmail("a@example.com")).toBe("A")
  })

  it("uppercases non-ASCII characters via locale rules", () => {
    expect(initialsFromEmail("luís@example.com")).toBe("LU")
    expect(initialsFromEmail("élise.dupont@example.com")).toBe("ÉD")
  })

  it("handles CJK code points without breaking surrogate pairs", () => {
    expect(initialsFromEmail("用户@example.com")).toBe("用户")
  })

  it("skips empty tokens around stray separators", () => {
    expect(initialsFromEmail(".alice.cooper@example.com")).toBe("AC")
    expect(initialsFromEmail("alice..cooper@example.com")).toBe("AC")
  })

  it("returns an empty string for null/undefined/empty input", () => {
    expect(initialsFromEmail("")).toBe("")
    expect(initialsFromEmail(null)).toBe("")
    expect(initialsFromEmail(undefined)).toBe("")
  })

  it("returns an empty string when the local part is missing", () => {
    expect(initialsFromEmail("@example.com")).toBe("")
  })

  it("ignores the domain part", () => {
    expect(initialsFromEmail("a.b@x.y.z")).toBe("AB")
  })
})
