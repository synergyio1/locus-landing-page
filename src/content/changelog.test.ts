import { describe, expect, it } from "vitest"

import { changelog } from "./changelog"

describe("changelog content", () => {
  it("exposes at least one entry", () => {
    expect(changelog.length).toBeGreaterThan(0)
  })

  it("includes a v0.1.0 placeholder entry", () => {
    const versions = changelog.map((e) => e.version)
    expect(versions).toContain("v0.1.0")
  })

  it("sorts entries newest first by date", () => {
    const dates = changelog.map((e) => e.date)
    const sorted = [...dates].sort((a, b) => b.localeCompare(a))
    expect(dates).toEqual(sorted)
  })

  it("dates are ISO YYYY-MM-DD strings", () => {
    for (const entry of changelog) {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(entry.date))).toBe(false)
    }
  })

  it("each entry has at least one bullet across added/improved/fixed", () => {
    for (const entry of changelog) {
      const total =
        entry.added.length + entry.improved.length + entry.fixed.length
      expect(total).toBeGreaterThan(0)
    }
  })

  it("versions follow a vMAJOR.MINOR.PATCH shape", () => {
    for (const entry of changelog) {
      expect(entry.version).toMatch(/^v\d+\.\d+\.\d+$/)
    }
  })
})
