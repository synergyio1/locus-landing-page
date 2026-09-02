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

  it("underlines exactly the thesis lines Luis picked, with balanced marks", () => {
    const paragraphs = manifesto.blocks.flatMap((b) => (b.kind === "p" ? [b.text] : []))
    for (const text of paragraphs) {
      expect(hasBalancedInlineMarks(text), text).toBe(true)
    }
    // Marks are reserved for the letter's thesis lines; Luis picked this set
    // with the "struggle" rewrite (2026-08-19), then trimmed it the same day:
    // clause-length marks only (no whole-paragraph underlines, no restatements).
    // 2026-08-30: "Willpower alone rarely holds it." became "Two things can
    // help you hold it…" (the equilibrium/two-fronts rewrite); the tools
    // section's "Nothing holds all of it at once…" line was cut with its
    // sentence, and the Clear restatement "For anything that matters, the
    // system decides — not the ambition." was cut outright.
    expect(paragraphs.flatMap(listInlineMarks)).toEqual([
      "a system to help us deal with the fast, noisy, high-stress times we increasingly live in",
      "so your mind can stop running the meta-strategy in the background and be present",
      "The days, to win them, you have to be present",
      "The years, to win them, you have to lift your head",
      "personal discipline, and a great system in place.",
      "Small improvements, repeated, are the whole game.",
    ])
    // Nothing else carries the syntax — quotes, parts, the sign-off stay plain.
    const rest = JSON.stringify({
      ...manifesto,
      blocks: manifesto.blocks.filter((b) => b.kind !== "p"),
    })
    expect(rest).not.toContain("==")
  })

  it("advertises an honest reading time in the letter note", () => {
    // Recount everything the letter column renders; ~220 wpm, minimum 1.
    // If the letter grows or shrinks past a minute boundary, this fails and
    // the note in manifesto.ts gets updated by hand — it never silently lies.
    const strings = [
      ...manifesto.blocks.flatMap((b) => {
        switch (b.kind) {
          case "p":
          case "h":
            return [b.text]
          case "quote":
            return [b.text, b.attribution]
          case "parts":
            return [b.intro, ...b.items.flatMap((p) => [p.name, p.text])]
        }
      }),
      manifesto.signature.closing,
    ]
    const words = strings
      .join(" ")
      .replace(/==/g, " ")
      .split(/\s+/)
      .filter(Boolean).length
    const minutes = Math.max(1, Math.round(words / 220))
    expect(manifesto.letterNote).toBe(`A letter from Luis · ${minutes} min read`)
  })

  it("gives every subheading a stable anchor for the mini-TOC", () => {
    const ids = manifesto.blocks.flatMap((b) => (b.kind === "h" ? [b.id] : []))
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
    expect(new Set(ids).size).toBe(ids.length)
    // The rail walks the letter in order. It used to end on the decisions
    // ("How we made it" → "Five decisions" → "Six decisions"); those left the
    // letter for their own section on 2026-09-02 (content/design-decisions.ts).
    expect(ids).toEqual([
      "a-delicate-equilibrium",
      "the-problem-with-todays-tools",
      "two-ideas-behind-the-design",
    ])
    expect(JSON.stringify(manifesto)).not.toMatch(/design-decisions|Six decisions/)
  })

  it("frames the soldier/general struggle at two horizons, the equilibrium, and the two ingredients", () => {
    // Luis, 2026-08-19 ("the struggle never stops" rewrite): present on the
    // day (a soldier), strategy across the years (a general) — both at once,
    // both great. 2026-09-02 (his own rewrite, orthography-only edits): the
    // fight happens at two horizons; the days-to-decade "loop" paragraph was
    // folded into the soldier/general pair and dropped; the noise/emotion tail
    // sits on the "both roles" paragraph; a delicate equilibrium and a tough
    // ordeal (he cut "specially in current times" on 2026-08-19 — don't
    // restore it); high achievers share two ingredients — discipline (the push
    // you apply to the day) and a great system (the friction in your days);
    // discipline only you can supply, we count on you for; the system, Locus,
    // is our mission to build, you can count on us for. Not "fragmentation",
    // no "bridge".
    const paragraphs = manifesto.blocks.flatMap((b) => (b.kind === "p" ? [b.text] : []))
    const rolesIndex = paragraphs.findIndex((t) => /A soldier\./.test(t))
    expect(rolesIndex).toBeGreaterThan(-1)
    expect(paragraphs[rolesIndex]).toMatch(/^And the fight happens at two horizons/)
    expect(paragraphs[rolesIndex]).toMatch(/A general\.$/)
    const roles = paragraphs[rolesIndex + 1]
    expect(roles).toMatch(/^You don't get to pick one role\./)
    expect(roles).toMatch(/Both have to be there, and both have to be great\./)
    expect(roles).toMatch(/a lot of noise, and a lot of emotion\.$/)
    const equilibrium = paragraphs[rolesIndex + 2]
    expect(equilibrium).not.toMatch(/fragmentation|bridge/i)
    expect(equilibrium).toBe(
      "This dynamic rests on a delicate equilibrium, and is a tough ordeal to execute well."
    )
    // The two ingredients — discipline (push) and the system (friction).
    const ingredients = paragraphs[rolesIndex + 3]
    expect(ingredients).toMatch(/^Every high achiever we've come across attacks this/)
    expect(ingredients).toMatch(/==personal discipline, and a great system in place\.==/)
    expect(ingredients).toMatch(/how hard you push on any given day/)
    expect(ingredients).toMatch(/how much friction you meet on all of them\.$/)
    // Discipline (yours) and the system, Locus (ours).
    const ways = paragraphs[rolesIndex + 4]
    expect(ways).toMatch(/^Discipline is yours/)
    expect(ways).toMatch(/The system, Locus, is our mission to build\./)
    expect(ways).toMatch(/We count on you for the first\. You can count on us for the second\.$/)
    // …and the letter still lands on "So we built one".
    expect(JSON.stringify(manifesto.blocks)).toMatch(/So we built one/)
  })

  it("names the problem with today's tools right below the struggle, in four paragraphs", () => {
    // Luis, 2026-08-17: a subheading (not a page section) after the struggle
    // section ("Every day is a battle", renamed "The struggle never stops" on
    // 2026-08-19, then "A delicate equilibrium" on 2026-09-02). Expanded
    // 2026-08-30 from two paragraphs to four: the tools
    // predate AI, so AI-native vs features bolted on; building was slower, so
    // apps stayed narrow (to-do / calendar / timer — Luis cut the "all one
    // day… nothing can learn from it" tail the same day); insight slips
    // through the cracks, and we finally have the tools to gather it and hand
    // back real insight — a paradigm change; then "We didn't find… So we
    // built one."
    const blocks = manifesto.blocks
    const struggle = blocks.findIndex((b) => b.kind === "h" && b.text === "A delicate equilibrium")
    const problem = blocks.findIndex((b) => b.kind === "h" && /today's tools/.test(b.text))
    expect(struggle).toBeGreaterThan(-1)
    expect(problem).toBeGreaterThan(struggle)
    const next = blocks.slice(problem + 1)
    const nextHeading = next.findIndex((b) => b.kind !== "p")
    expect(next.slice(0, nextHeading)).toHaveLength(4)
    const [native, split, cracks, built] = next
    if (
      native.kind !== "p" ||
      split.kind !== "p" ||
      cracks.kind !== "p" ||
      built.kind !== "p"
    ) {
      throw new Error("unreachable")
    }
    expect(native.text).toMatch(/^Most of the tools we rely on were built before AI/)
    expect(native.text).toMatch(/AI-native app and AI features bolted onto a traditional one\.$/)
    expect(split.text).toMatch(/^Building software was also much slower then/)
    expect(split.text).toMatch(/A timer counts minutes without knowing what they were for\.$/)
    expect(split.text).not.toMatch(/all one day|nothing can learn from it/)
    expect(cracks.text).toMatch(/slips through those cracks/)
    expect(cracks.text).toMatch(/hand back real insight/)
    expect(cracks.text).toMatch(/fundamental paradigm change/)
    expect(built.text).toMatch(/^We didn't find what we thought a great solution/)
    // 2026-09-02: "a smart assistant" replaced "gathered all of this context",
    // and the paragraph now ends on being at the beginning of the vision.
    expect(built.text).toMatch(/really felt like a smart assistant/)
    expect(built.text).not.toMatch(/gathered all of this context/)
    expect(built.text).toMatch(/So we built one — though we are still at the beginning of the vision\.$/)
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
