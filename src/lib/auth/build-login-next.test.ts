import { describe, expect, it } from "vitest"

import { buildLoginNext } from "./build-login-next"

function sanitizeNext(next: string | undefined): string {
  if (!next) return "/account"
  if (!next.startsWith("/") || next.startsWith("//")) return "/account"
  return next
}

describe("buildLoginNext", () => {
  it("composes homepage with hash to /#pricing", () => {
    expect(buildLoginNext("/", "#pricing")).toBe("/#pricing")
  })

  it("returns /pricing for /pricing without a hash", () => {
    expect(buildLoginNext("/pricing", "")).toBe("/pricing")
  })

  it("preserves query strings on the pathname", () => {
    expect(buildLoginNext("/pricing?ref=email", "")).toBe("/pricing?ref=email")
  })

  it("preserves query strings together with a hash", () => {
    expect(buildLoginNext("/pricing?ref=email", "#pricing")).toBe(
      "/pricing?ref=email#pricing"
    )
  })

  it("prepends a missing # to a hash fragment", () => {
    expect(buildLoginNext("/", "pricing")).toBe("/#pricing")
  })

  it("falls back to / when the pathname is malformed (no leading slash)", () => {
    expect(buildLoginNext("pricing", "")).toBe("/")
  })

  it("falls back to / when the pathname starts with //", () => {
    expect(buildLoginNext("//evil.example.com/path", "")).toBe("/")
  })

  it("falls back to / when the pathname is empty", () => {
    expect(buildLoginNext("", "")).toBe("/")
  })

  it("falls back to / when the pathname is null or undefined", () => {
    expect(buildLoginNext(null, null)).toBe("/")
    expect(buildLoginNext(undefined, undefined)).toBe("/")
  })

  it("ignores a hash that is just '#'", () => {
    expect(buildLoginNext("/pricing", "#")).toBe("/pricing")
  })

  it("falls back to a safe / pathname when malformed even if a hash is provided", () => {
    expect(buildLoginNext("//evil", "#pricing")).toBe("/#pricing")
  })

  it("output round-trips through sanitizeNext for all inputs", () => {
    const cases: Array<[string | null | undefined, string | null | undefined]> = [
      ["/", "#pricing"],
      ["/pricing", ""],
      ["/pricing?ref=email", "#pricing"],
      ["pricing", ""],
      ["//evil", "#pricing"],
      ["", ""],
      [null, null],
      [undefined, undefined],
    ]
    for (const [pathname, hash] of cases) {
      const next = buildLoginNext(pathname, hash)
      expect(sanitizeNext(next)).toBe(next)
    }
  })
})
