import { describe, expect, it } from "vitest"

import { designDecisions } from "./design-decisions"

describe("design decisions content", () => {
  it("keeps the count-free anchor under a six-count heading", () => {
    // The anchor was "five-decisions" until the sixth arrived on 2026-08-20;
    // it stays count-free so the next one breaks no links. The heading gained
    // "design" on 2026-09-02, when the list left the manifesto letter.
    expect(designDecisions.id).toBe("design-decisions")
    expect(designDecisions.id).not.toMatch(/five|six/)
    expect(designDecisions.heading).toBe("Six design decisions")
    expect(designDecisions.eyebrow.length).toBeGreaterThan(0)
    expect(designDecisions.intro).toMatch(/build ourselves.*borrow.*leave open/)
  })

  it("lists exactly the six core design decisions", () => {
    expect(designDecisions.items).toHaveLength(6)
    // Build → borrow → leave-open (routines, then external tools), then the
    // two things that are yours. The day feedback loop was cut from this list
    // on purpose (2026-08-17), and "Bring your own AI" was folded into
    // "Choose your model" the same day. "Plug in your own tools" joined the
    // leave-open pair on 2026-08-20 (product ADR-0015) — it sits beside
    // "Routines are files" because both are the part left open for you.
    // Note it names a decision, not a shipped surface: ADR-0015 is accepted,
    // the Settings allowance isn't built yet (Luis's call to state it plainly
    // anyway; the "Shipping next" chip that hedged it was cut the same day).
    const ids = designDecisions.items.map((d) => d.id)
    expect(ids).toEqual([
      "build-the-armor",
      "choose-your-model",
      "routines-are-files",
      "external-tools",
      "gets-to-know-you",
      "local-first",
    ])
    expect(ids).not.toContain("day-feedback-loop")
    expect(ids).not.toContain("byo-ai")
    for (const decision of designDecisions.items) {
      expect(decision.title.length).toBeGreaterThan(0)
      expect(decision.summary.length).toBeGreaterThan(0)
      // Luis's cap from the letter column; about eight short lines on a card.
      expect(decision.summary.length).toBeLessThanOrEqual(170)
    }
  })

  it("gives every card its own bespoke emblem", () => {
    const emblems = designDecisions.items.map((d) => d.emblem)
    expect(new Set(emblems).size).toBe(emblems.length)
    expect(emblems).toEqual(["armor", "dial", "files", "modules", "portrait", "device"])
  })

  it("points at the design-ideas blog, linking only once an href exists", () => {
    expect(designDecisions.blog.linkLabel).toMatch(/design ideas blog/i)
    if (designDecisions.blog.href !== undefined) {
      expect(designDecisions.blog.href).toMatch(/^(\/|https?:\/\/)/)
    } else {
      expect(designDecisions.blog.pendingNote).toBe("(coming soon)")
    }
  })
})
