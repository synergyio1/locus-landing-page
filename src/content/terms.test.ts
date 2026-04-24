import { describe, expect, it } from "vitest"

import { terms } from "./terms"

describe("terms content", () => {
  it("is marked as a draft", () => {
    expect(terms.draft).toBe(true)
  })

  it("exposes the four required placeholder section headings in order", () => {
    const headings = terms.sections.map((s) => s.heading)
    expect(headings).toEqual([
      "Using Locus",
      "Subscriptions and refunds",
      "Termination",
      "Contact",
    ])
  })

  it("every section has non-empty body copy", () => {
    for (const section of terms.sections) {
      expect(section.body.trim().length).toBeGreaterThan(0)
    }
  })

  it("exposes a title and a lastUpdated ISO date", () => {
    expect(terms.title.length).toBeGreaterThan(0)
    expect(terms.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
