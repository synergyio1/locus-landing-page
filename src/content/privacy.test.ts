import { describe, expect, it } from "vitest"

import { privacy } from "./privacy"

describe("privacy content", () => {
  it("is marked as a draft", () => {
    expect(privacy.draft).toBe(true)
  })

  it("exposes the four required placeholder section headings in order", () => {
    const headings = privacy.sections.map((s) => s.heading)
    expect(headings).toEqual([
      "What we collect",
      "How we use it",
      "Your rights",
      "Contact",
    ])
  })

  it("every section has non-empty body copy", () => {
    for (const section of privacy.sections) {
      expect(section.body.trim().length).toBeGreaterThan(0)
    }
  })

  it("exposes a title and a lastUpdated ISO date", () => {
    expect(privacy.title.length).toBeGreaterThan(0)
    expect(privacy.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
