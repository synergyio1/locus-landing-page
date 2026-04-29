import { describe, expect, it } from "vitest"

import { personaSection } from "./personaSection"

describe("persona section content", () => {
  it("ships at least one persona tab", () => {
    expect(personaSection.tabs.length).toBeGreaterThan(0)
  })

  it("never ships more than four tabs (Maya / Dev / Frida / Pim)", () => {
    expect(personaSection.tabs.length).toBeLessThanOrEqual(4)
  })

  it("exposes Maya as the designer tab in PERSONAS-02", () => {
    const designer = personaSection.tabs.find((t) => t.id === "designer")
    expect(designer).toBeDefined()
    expect(designer!.name).toMatch(/maya/i)
    expect(designer!.role).toMatch(/designer/i)
  })

  it("defaults to a tab id that exists", () => {
    const ids = personaSection.tabs.map((t) => t.id)
    expect(ids).toContain(personaSection.defaultTab)
  })

  it("each tab points its anchor + supporting images at /screenshots/...", () => {
    for (const tab of personaSection.tabs) {
      expect(tab.anchor.src).toMatch(/^\/screenshots\//)
      expect(tab.supporting.src).toMatch(/^\/screenshots\//)
    }
  })

  it("each tab routes its screenshots through a persona/theme subpath", () => {
    // PERSONAS-02 layout: `/screenshots/<category>/<persona>/<theme>/<shot>.png`
    // Catches accidental regressions to the cross-audience root paths.
    for (const tab of personaSection.tabs) {
      expect(tab.anchor.src).toMatch(/\/screens\/[a-z]+\/(dark|light)\//)
      expect(tab.supporting.src).toMatch(/\/screens\/[a-z]+\/(dark|light)\//)
    }
  })

  it("each tab has at least one tool pill and non-empty blurb", () => {
    for (const tab of personaSection.tabs) {
      expect(tab.tools.length).toBeGreaterThan(0)
      expect(tab.blurb.length).toBeGreaterThan(0)
    }
  })

  it("each tab has unique initials within the section", () => {
    const initials = personaSection.tabs.map((t) => t.initials)
    expect(new Set(initials).size).toBe(initials.length)
  })

  it("section copy never references a persona that hasn't shipped yet", () => {
    // Headline / body are persona-agnostic; only `tabs` should mention
    // specific names. This catches accidental mentions of Dev / Frida /
    // Pim in the body before PERSONAS-03 / -04 land.
    const nonTabCopy = `${personaSection.eyebrow} ${personaSection.headline} ${personaSection.body}`
    expect(nonTabCopy).not.toMatch(/\bMaya\b/)
    expect(nonTabCopy).not.toMatch(/\bDev\b/)
    expect(nonTabCopy).not.toMatch(/\bFrida\b/)
    expect(nonTabCopy).not.toMatch(/\bPim\b/)
  })
})
