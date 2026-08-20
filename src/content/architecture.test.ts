import { describe, expect, it } from "vitest"

import { architecture, STATUS_LABELS } from "./architecture"
import { manifesto } from "./manifesto"

describe("architecture content", () => {
  it("is the manifesto's decisions list, in the same order, with nothing missing", () => {
    // The letter is the source of the titles and one-liners; this page only
    // adds the argument. If the two ever disagree, one of them is lying.
    expect(architecture.decisions.map((d) => d.id)).toEqual(
      manifesto.decisions.map((d) => d.id)
    )
    for (const [i, decision] of architecture.decisions.entries()) {
      expect(decision.title).toBe(manifesto.decisions[i].title)
      expect(decision.summary).toBe(manifesto.decisions[i].summary)
      expect(decision.index).toBe(i + 1)
    }
  })

  it("argues every decision out — question, choice, why, and a cost", () => {
    for (const decision of architecture.decisions) {
      expect(decision.question, decision.id).toMatch(/\?$/)
      expect(decision.choice.length, decision.id).toBeGreaterThan(60)
      // Two reasons is a preference; three is an argument.
      expect(decision.reasons.length, decision.id).toBeGreaterThanOrEqual(3)
      // A decision with no stated cost is a slogan, not a decision.
      expect(decision.tradeoff.length, decision.id).toBeGreaterThan(60)
    }
  })

  it("says plainly which decisions are shipped and which are only decided", () => {
    // The chip in the letter and the chip on this page come from different
    // files; this is what keeps them from disagreeing. Flip a `status` to
    // "shipped" and the letter's `note` must go with it.
    for (const decision of architecture.decisions) {
      const manifestoNote = manifesto.decisions.find(
        (d) => d.id === decision.id
      )?.note
      if (decision.status === "next") {
        expect(manifestoNote, `${decision.id} is unshipped but unlabelled`).toBeTruthy()
      } else {
        expect(manifestoNote, `${decision.id} ships but carries a chip`).toBeUndefined()
      }
    }
    expect(STATUS_LABELS.next).toMatch(/shipping next/i)
  })

  it("carries the sixth decision: the tools you plug in are your harness's", () => {
    // Product ADR-0015 (2026-08-20): Locus inherits MCP servers from the
    // active harness — it never hosts, installs, or authenticates one — and
    // that makes external tools a bring-your-own-subscription capability.
    // Don't let this drift into "integrations" or "connect your Notion".
    const tools = architecture.decisions.find((d) => d.id === "external-tools")
    expect(tools).toBeDefined()
    if (!tools) throw new Error("unreachable")
    expect(tools.status).toBe("next")
    expect(tools.choice).toMatch(/MCP servers you already connected/i)
    expect(tools.choice).toMatch(/never hosts a server/i)
    expect(tools.tradeoff).toMatch(/bring-your-own-subscription/i)
    // The reason it earns a place beside the other five.
    expect(tools.reasons.join(" ")).toMatch(/operating-system/i)
    expect(tools.reasons.join(" ")).toMatch(/plug your own parts into/i)
  })

  it("points back at the letter, at the anchor the letter actually has", () => {
    expect(architecture.backLink.href).toBe(`/#${manifesto.decisionsId}`)
  })

  it("promises no roadmap and no dates", () => {
    // The page frame is allowed to say the word (it says it isn't one); the
    // decisions themselves are what must never read as a schedule.
    expect(architecture.note).toMatch(/not(hing)? .*roadmap/i)
    const text = JSON.stringify(architecture.decisions)
    expect(text).not.toMatch(/\broadmap\b/i)
    // No quarters, no months, no "by <year>" — a decision page dates nothing.
    expect(text).not.toMatch(/\bQ[1-4]\s*20\d\d\b/)
    expect(text).not.toMatch(/\bby (early |mid |late )?20\d\d\b/i)
  })
})
