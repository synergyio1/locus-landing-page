import { describe, expect, it } from "vitest"

import { manifesto } from "./manifesto"

describe("manifesto content", () => {
  it("is the #manifesto anchor the hero CTA and nav point at", () => {
    expect(manifesto.id).toBe("manifesto")
  })

  it("opens with the trust statement and a resting rotating phrase", () => {
    expect(manifesto.headline).toMatch(/system you can trust/i)
    expect(manifesto.rotating[0]).toBe("your whole day.")
    expect(new Set(manifesto.rotating).size).toBe(manifesto.rotating.length)
  })

  it("names the three app parts in the app's own sidebar order", () => {
    const parts = manifesto.blocks.find((b) => b.kind === "parts")
    expect(parts).toBeDefined()
    if (parts?.kind !== "parts") throw new Error("unreachable")
    expect(parts.items.map((p) => p.name)).toEqual(["Execution", "Inputs", "AI"])
    for (const part of parts.items) {
      expect(part.text.length).toBeGreaterThan(20)
    }
  })

  it("carries the two founding ideas as attributed pull-quotes", () => {
    const quotes = manifesto.blocks.filter((b) => b.kind === "quote")
    expect(quotes).toHaveLength(2)
    const [einstein, clear] = quotes
    if (einstein.kind !== "quote" || clear.kind !== "quote") {
      throw new Error("unreachable")
    }
    // Einstein is credited, never confirmed — say so in the attribution.
    expect(einstein.text).toMatch(/eighth wonder of the world/i)
    expect(einstein.attribution).toMatch(/credited to Albert Einstein/i)
    expect(einstein.attribution).toMatch(/unconfirmed/i)
    expect(clear.text).toMatch(/fall to the level of your systems/i)
    expect(clear.attribution.length).toBeGreaterThan(0)
    expect(JSON.stringify(manifesto.blocks)).toMatch(/James Clear/)
  })

  it("lists exactly the five core design decisions", () => {
    expect(manifesto.decisions).toHaveLength(5)
    // Build → borrow → leave-open, then the two things that are yours.
    // The day feedback loop was cut from this list on purpose (2026-08-17),
    // and "Bring your own AI" was folded into "Choose your model" the same day.
    expect(manifesto.decisions.map((d) => d.id)).toEqual([
      "build-the-armor",
      "choose-your-model",
      "routines-are-files",
      "gets-to-know-you",
      "local-first",
    ])
    expect(manifesto.decisions.map((d) => d.id)).not.toContain("day-feedback-loop")
    expect(manifesto.decisions.map((d) => d.id)).not.toContain("byo-ai")
    for (const decision of manifesto.decisions) {
      expect(decision.title.length).toBeGreaterThan(0)
      expect(decision.summary.length).toBeGreaterThan(0)
      // Luis's cap: every summary fits two lines in the letter column at >=1280w.
      expect(decision.summary.length).toBeLessThanOrEqual(170)
    }
  })

  it("points at the design-ideas blog, linking only once an href exists", () => {
    expect(manifesto.blog.linkLabel).toMatch(/design ideas blog/i)
    if (manifesto.blog.href !== undefined) {
      expect(manifesto.blog.href).toMatch(/^(\/|https?:\/\/)/)
    } else {
      expect(manifesto.blog.pendingNote).toBe("(coming soon)")
    }
  })

  it("signs off with the founder's name only", () => {
    expect(manifesto.signature.closing).toBe("We hope you enjoy it.")
    expect(manifesto.signature.name).toBe("Luis")
  })

  it("never promises to optimize or fix the day (Coach voice)", () => {
    const text = JSON.stringify(manifesto)
    expect(text).not.toMatch(/optimi[sz]e your day|fix your day/i)
  })
})
