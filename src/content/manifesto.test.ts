import { describe, expect, it } from "vitest"

import { hasBalancedInlineMarks, listInlineMarks } from "@/lib/inline-marks"

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
    // "Credited to" is the whole hedge — Luis dropped the "(unconfirmed)"
    // tag on 2026-08-17; don't bring it back.
    expect(einstein.text).toMatch(/eighth wonder of the world/i)
    expect(einstein.attribution).toBe("Credited to Albert Einstein")
    expect(clear.text).toMatch(/fall to the level of your systems/i)
    expect(clear.attribution.length).toBeGreaterThan(0)
    expect(JSON.stringify(manifesto.blocks)).toMatch(/James Clear/)
  })

  it("underlines exactly the two thesis lines, with balanced marks", () => {
    const paragraphs = manifesto.blocks.flatMap((b) => (b.kind === "p" ? [b.text] : []))
    for (const text of paragraphs) {
      expect(hasBalancedInlineMarks(text), text).toBe(true)
    }
    // Marks are reserved for the letter's thesis lines (Luis, 2026-08-17).
    expect(paragraphs.flatMap(listInlineMarks)).toEqual([
      "a system to help us deal with the fast, noisy, high-stress times we increasingly live in",
      "so your mind can stop running the meta-strategy in the background and be present",
    ])
    // Nothing else carries the syntax — quotes, parts, decisions stay plain.
    const rest = JSON.stringify({ ...manifesto, blocks: manifesto.blocks.filter((b) => b.kind !== "p") })
    expect(rest).not.toContain("==")
  })

  it("frames the day/war bridge as a delicate equilibrium, then the two ways to hold it", () => {
    // Luis, 2026-08-17: fight the battle with the war in mind — be present on
    // the day, don't lose grip of the months and years, follow the plan but
    // keep checking it still leads to the goal. A delicate equilibrium, very
    // hard on brute-force discipline alone; the alternative is a great system
    // (ours). Not "fragmentation".
    const paragraphs = manifesto.blocks.flatMap((b) => (b.kind === "p" ? [b.text] : []))
    const bridgeIndex = paragraphs.findIndex((t) => /bridge between the two/.test(t))
    expect(bridgeIndex).toBeGreaterThan(-1)
    const bridge = paragraphs[bridgeIndex]
    expect(bridge).not.toMatch(/fragmentation/i)
    expect(bridge).toMatch(/keep checking that the plan/)
    expect(bridge).toMatch(/delicate equilibrium/)
    // The two ways — discipline (yours) or a great system (ours) — come next.
    const ways = paragraphs[bridgeIndex + 1]
    expect(ways).toMatch(/brute-force self-discipline, or a great system/)
    expect(ways).toMatch(/One is in your hands\. The other is in ours\.$/)
    // …and the letter still lands on "So we built one."
    expect(JSON.stringify(manifesto.blocks)).toMatch(/So we built one\./)
  })

  it("names the problem with today's tools right below the battle, in two paragraphs", () => {
    // Luis, 2026-08-17: a subheading (not a page section) after "Every day is
    // a battle" — the tools predate AI and don't use its power to take in huge
    // context and hand back insight; one day split into separate apps; then
    // "We never found… So we built one."
    const blocks = manifesto.blocks
    const battle = blocks.findIndex((b) => b.kind === "h" && b.text === "Every day is a battle")
    const problem = blocks.findIndex((b) => b.kind === "h" && /today's tools/.test(b.text))
    expect(battle).toBeGreaterThan(-1)
    expect(problem).toBeGreaterThan(battle)
    const next = blocks.slice(problem + 1)
    const nextHeading = next.findIndex((b) => b.kind !== "p")
    expect(next.slice(0, nextHeading)).toHaveLength(2)
    const [tools, built] = next
    if (tools.kind !== "p" || built.kind !== "p") throw new Error("unreachable")
    expect(tools.text).toMatch(/built before AI/)
    expect(tools.text).toMatch(/context/)
    expect(tools.text).toMatch(/insight/)
    expect(tools.text).toMatch(/It is all one day, yet today's tools split it into separate apps\./)
    expect(tools.text).toMatch(/so nothing can learn from it\.$/)
    expect(built.text).toMatch(/^We never found what we thought a great solution would look like/)
    expect(built.text).toMatch(/So we built one\.$/)
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
