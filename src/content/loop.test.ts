import { describe, expect, it } from "vitest"

import { loop } from "./loop"

describe("loop content", () => {
  it("exposes exactly four verbs in Plan → Focus → Track → Review order", () => {
    expect(loop.verbs.map((v) => v.label)).toEqual([
      "Plan",
      "Focus",
      "Track",
      "Review",
    ])
  })

  it("section id is 'loop' so hero #loop anchor resolves", () => {
    expect(loop.id).toBe("loop")
  })

  it("has a non-empty sentence and Stoic sub-line", () => {
    expect(loop.sentence.length).toBeGreaterThan(0)
    expect(loop.subline.length).toBeGreaterThan(0)
  })
})
