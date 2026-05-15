import { describe, expect, it } from "vitest"

import { personaSection } from "./personaSection"

describe("persona section content", () => {
  it("ships at least one screen", () => {
    expect(personaSection.screens.length).toBeGreaterThan(0)
  })

  it("each screen points its screenshot at /screenshots/...", () => {
    for (const screen of personaSection.screens) {
      expect(screen.screenshot.src).toMatch(/^\/screenshots\//)
    }
  })

  it("each screen routes its screenshot through /screens/<file>.png (single-persona, no persona/theme subpath)", () => {
    // We retired the per-persona subdirectories; the single-persona shots
    // live directly under `/screenshots/screens/`. This catches accidental
    // regressions back to the persona/theme nesting.
    for (const screen of personaSection.screens) {
      expect(screen.screenshot.src).toMatch(/^\/screenshots\/screens\/[^/]+\.png$/)
    }
  })

  it("each screen has a non-empty tag, headline, body, and alt", () => {
    for (const screen of personaSection.screens) {
      expect(screen.tag.length).toBeGreaterThan(0)
      expect(screen.headline.length).toBeGreaterThan(0)
      expect(screen.body.length).toBeGreaterThan(0)
      expect(screen.screenshot.alt.length).toBeGreaterThan(0)
    }
  })

  it("each screen has a unique slug for in-page anchoring", () => {
    const ids = personaSection.screens.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("the single persona has initials, name, role, blurb, and at least one tool", () => {
    const { persona } = personaSection
    expect(persona.initials.length).toBeGreaterThan(0)
    expect(persona.name.length).toBeGreaterThan(0)
    expect(persona.role.length).toBeGreaterThan(0)
    expect(persona.blurb.length).toBeGreaterThan(0)
    expect(persona.tools.length).toBeGreaterThan(0)
  })
})
