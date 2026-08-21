import { describe, expect, it } from "vitest"

import { findPack, packs, type Pack } from "./packs"

/**
 * The pack folders that ship in the app, in sidebar order. Ground truth:
 * Locus/Packages/LocusData/Sources/LocusData/Resources/RoutinePacks/ in the
 * product repo. If a pack is added there, add it here first — the failure is
 * the reminder.
 */
const SHIPPED_IDS = [
  "general",
  "quiet",
  "deep-work",
  "relentless",
  "compound",
  "process",
] as const

/** The built-in routine slugs a pack is allowed to stand in for. */
const STOCK_SLUGS = new Set([
  "morning-brief",
  "daily-digest",
  "weekly-digest",
  "monthly-digest",
  "distraction-coach",
  "memory-ingest",
  "chat-reply",
])

/**
 * ADR-0012, decision 12: method names + an `inspired_by` credit, never a real
 * name or a book title as the pack's name. This is trademark and publicity
 * exposure on a shipped feature, not a stylistic preference — so it is a test,
 * not a comment.
 */
const NAMES_AND_TITLES =
  /kobe|bryant|phelps|bowman|newport|james clear|atomic habits|deep work is/i

const SERIALIZED = JSON.stringify(packs)

describe("packs content", () => {
  it("is the six packs that ship in the app, in order", () => {
    expect(packs.packs.map((p) => p.id)).toEqual([...SHIPPED_IDS])
  })

  it("uses the app's own folder slugs, uniquely", () => {
    const ids = packs.packs.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const pack of packs.packs) {
      expect(pack.id, pack.name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }
  })

  it("never names a pack after a person or a book", () => {
    for (const pack of packs.packs) {
      expect(pack.name, `pack name "${pack.name}"`).not.toMatch(
        NAMES_AND_TITLES
      )
    }
  })

  it("keeps every real-world lineage in the credit line instead", () => {
    const credited = packs.packs.filter((p) => p.inspiredBy)
    expect(credited.map((p) => p.id)).toEqual([
      "deep-work",
      "relentless",
      "compound",
      "process",
    ])
    // The first-party methods claim no lineage.
    expect(findPack("general")?.inspiredBy).toBeUndefined()
    expect(findPack("quiet")?.inspiredBy).toBeUndefined()
  })

  it("gives every borrowed method a coach's stance, and the plain ones none", () => {
    for (const pack of packs.packs) {
      if (pack.inspiredBy) {
        expect(pack.stance, pack.id).toBeTruthy()
        expect(pack.stance!.length, pack.id).toBeGreaterThan(120)
      } else {
        expect(pack.stance, pack.id).toBeUndefined()
      }
    }
  })

  it("only stands in for routines that actually exist", () => {
    for (const pack of packs.packs) {
      for (const routine of pack.routines) {
        if (routine.change === "replaces") {
          expect(STOCK_SLUGS.has(routine.slug), `${pack.id}/${routine.slug}`).toBe(
            true
          )
          expect(routine.replaces, `${pack.id}/${routine.slug}`).toBeTruthy()
        }
        if (routine.change === "adds") {
          // An addition brings a new slug with it; if it collided with a
          // built-in it would be a replacement, not an addition.
          expect(STOCK_SLUGS.has(routine.slug), `${pack.id}/${routine.slug}`).toBe(
            false
          )
        }
      }
    }
  })

  it("describes each routine once, with a description", () => {
    for (const pack of packs.packs) {
      const slugs = pack.routines.map((r) => r.slug)
      expect(new Set(slugs).size, pack.id).toBe(slugs.length)
      for (const routine of pack.routines) {
        expect(routine.name, `${pack.id}/${routine.slug}`).toBeTruthy()
        expect(
          routine.description.length,
          `${pack.id}/${routine.slug}`
        ).toBeGreaterThan(20)
        if (routine.time) {
          expect(routine.time, `${pack.id}/${routine.slug}`).toMatch(
            /^\d{2}:\d{2}$/
          )
        }
      }
    }
  })

  it("gives every pack a summary that fits a card, and a closer", () => {
    for (const pack of packs.packs) {
      expect(pack.summary.length, pack.id).toBeLessThanOrEqual(100)
      expect(pack.summary, pack.id).not.toContain("\n")
      expect(pack.lede.length, pack.id).toBeGreaterThan(80)
      expect(pack.closer.length, pack.id).toBeGreaterThan(20)
    }
  })

  it("writes principles as a titled claim plus an argument", () => {
    for (const pack of packs.packs) {
      for (const principle of pack.principles) {
        expect(principle.title, pack.id).toMatch(/\.$/)
        expect(principle.body.length, `${pack.id} — ${principle.title}`)
          .toBeGreaterThan(60)
      }
    }
  })

  it("marks exactly one pack as the baseline", () => {
    const baselines = packs.packs.filter((p: Pack) => p.baseline)
    expect(baselines.map((p) => p.id)).toEqual(["general"])
  })

  it("says a pack is one at a time and edits win", () => {
    expect(SERIALIZED).toMatch(/one at a time/i)
    expect(SERIALIZED).toMatch(/never stack|they never stack/i)
    expect(packs.layering).toMatch(/your own edits/i)
  })

  it("promises no gallery, ratings, or uploads — none of that is built", () => {
    for (const pattern of [
      /\bstars?\b/i,
      /\bratings?\b/i,
      /\breviews?\b/i,
      /\bupload/i,
      /\bsign up\b/i,
      /\bwaitlist\b/i,
    ]) {
      expect(SERIALIZED, `packs copy promises ${pattern}`).not.toMatch(pattern)
    }
  })

  it("links no external repo — the packs repo is private", () => {
    expect(SERIALIZED).not.toMatch(/https?:\/\//)
    expect(SERIALIZED).not.toMatch(/github/i)
  })

  it("finds a pack by id, and nothing by a bad one", () => {
    expect(findPack("relentless")?.name).toBe("Relentless")
    expect(findPack("nope")).toBeUndefined()
  })
})
