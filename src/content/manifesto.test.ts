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
      "To win the day, you have to be present",
      "To win the decade, you have to lift your head",
      "Two things can help you hold it: personal discipline, and/or a good system.",
      "Small improvements, repeated, are the whole game.",
    ])
    // Nothing else carries the syntax — quotes, parts, decisions stay plain.
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
      manifesto.decisionsHeading,
      manifesto.decisionsIntro,
      ...manifesto.decisions.flatMap((d) => [d.title, d.summary]),
      manifesto.blog.text,
      manifesto.blog.linkLabel,
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
    ids.push(manifesto.decisionsId)
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
    expect(new Set(ids).size).toBe(ids.length)
    // The rail walks the letter in order and ends on the decisions. Last two
    // renamed 2026-08-19 (Luis): "What we're building" → "Locus, in three
    // parts", "How we made it" → "Five decisions" (now "Six decisions", on a
    // count-free anchor since 2026-08-20 so the next one breaks no links).
    expect(ids).toEqual([
      "the-struggle-never-stops",
      "the-problem-with-todays-tools",
      "two-ideas-behind-the-design",
      "design-decisions",
    ])
    expect(manifesto.decisionsHeading).toBe("Six decisions")
    expect(manifesto.decisionsId).not.toMatch(/five|six/)
  })

  it("frames the soldier/general struggle, its bridge, and the two ways to hold it", () => {
    // Luis, 2026-08-19 ("the struggle never stops" rewrite): present on the
    // day (a soldier), strategy across the decade (a general) — both at once,
    // both good; the bridge is the weeks and months in between; a delicate
    // equilibrium (he cut "specially in current times" later that day — don't
    // restore it) held by two things — discipline and a good system
    // (2026-08-30, replacing "willpower alone rarely holds it"): discipline
    // only you can supply, we count on you for; the system is ours to build,
    // you can count on us for. Not "fragmentation".
    const paragraphs = manifesto.blocks.flatMap((b) => (b.kind === "p" ? [b.text] : []))
    const rolesIndex = paragraphs.findIndex((t) => /A soldier\./.test(t))
    expect(rolesIndex).toBeGreaterThan(-1)
    expect(paragraphs[rolesIndex]).toMatch(/A general\./)
    expect(paragraphs[rolesIndex + 1]).toMatch(/Both have to be there, and both have to be good\./)
    const bridge = paragraphs[rolesIndex + 2]
    expect(bridge).not.toMatch(/fragmentation/i)
    expect(bridge).toMatch(/bridge between them/)
    expect(bridge).toMatch(/keep checking the plan still leads/)
    const equilibrium = paragraphs[rolesIndex + 3]
    expect(equilibrium).toMatch(/delicate equilibrium/)
    expect(equilibrium).toMatch(
      /^It's a delicate equilibrium\. ==Two things can help you hold it: personal discipline, and\/or a good system\.==$/
    )
    expect(equilibrium).not.toMatch(/specially in current times/)
    // The two — discipline (yours) and the system (ours); have both.
    const ways = paragraphs[rolesIndex + 4]
    expect(ways).toMatch(/^The best odds come from having both\./)
    expect(ways).toMatch(/Discipline is yours/)
    expect(ways).toMatch(/The system is ours to build\./)
    expect(ways).toMatch(/We count on you for the first\. You can count on us for the second\.$/)
    // …and the letter still lands on "So we built one."
    expect(JSON.stringify(manifesto.blocks)).toMatch(/So we built one\./)
  })

  it("names the problem with today's tools right below the struggle, in four paragraphs", () => {
    // Luis, 2026-08-17: a subheading (not a page section) after the struggle
    // section ("Every day is a battle", renamed "The struggle never stops" on
    // 2026-08-19). Expanded 2026-08-30 from two paragraphs to four: the tools
    // predate AI, so AI-native vs features bolted on; building was slower, so
    // apps stayed narrow (to-do / calendar / timer — Luis cut the "all one
    // day… nothing can learn from it" tail the same day); insight slips
    // through the cracks, and we finally have the tools to gather it and hand
    // back real insight — a paradigm change; then "We never found… So we
    // built one."
    const blocks = manifesto.blocks
    const struggle = blocks.findIndex((b) => b.kind === "h" && b.text === "The struggle never stops")
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
    expect(built.text).toMatch(/^We never found what we thought a great solution/)
    expect(built.text).toMatch(/gathered all of this context/)
    expect(built.text).toMatch(/So we built one\.$/)
  })

  it("lists exactly the six core design decisions", () => {
    expect(manifesto.decisions).toHaveLength(6)
    // Build → borrow → leave-open (routines, then external tools), then the
    // two things that are yours. The day feedback loop was cut from this list
    // on purpose (2026-08-17), and "Bring your own AI" was folded into
    // "Choose your model" the same day. "Plug in your own tools" joined the
    // leave-open pair on 2026-08-20 (product ADR-0015) — it sits beside
    // "Routines are files" because both are the part left open for you.
    // Note it names a decision, not a shipped surface: ADR-0015 is accepted,
    // the Settings allowance isn't built yet (Luis's call to state it plainly
    // anyway; the "Shipping next" chip that hedged it was cut the same day).
    expect(manifesto.decisions.map((d) => d.id)).toEqual([
      "build-the-armor",
      "choose-your-model",
      "routines-are-files",
      "external-tools",
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
