import { describe, expect, it } from "vitest"

import { faq } from "./faq"

describe("faq content", () => {
  it("retains the tactical topics", () => {
    const ids = faq.items.map((item) => item.id)
    expect(ids).toEqual(
      expect.arrayContaining([
        "privacy",
        "mac-only",
        "macos-requirement",
        "refund",
        "data-export",
        "offline",
        "sign-in",
      ])
    )
  })

  it("retains the strategic topics introduced by the A.10 redesign", () => {
    const ids = faq.items.map((item) => item.id)
    expect(ids).toEqual(
      expect.arrayContaining([
        "who-for",
        "how-different",
        "keystrokes",
        "missed-session",
      ])
    )
  })

  it("covers the agent-era topics introduced by the A.11 truth alignment", () => {
    const ids = faq.items.map((item) => item.id)
    expect(ids).toEqual(
      expect.arrayContaining(["which-ai", "routines", "memory"])
    )
  })

  it("each item has a non-empty question and answer", () => {
    for (const item of faq.items) {
      expect(item.question.length).toBeGreaterThan(0)
      expect(item.answer.length).toBeGreaterThan(0)
    }
  })

  it("privacy answer leads with local-first and the license-not-data account", () => {
    const privacy = faq.items.find((i) => i.id === "privacy")
    expect(privacy!.answer).toMatch(/on your mac/i)
    expect(privacy!.answer).toMatch(/license/i)
  })

  it("privacy answer states the managed-AI no-storage claim", () => {
    const privacy = faq.items.find((i) => i.id === "privacy")
    expect(privacy!.answer).toMatch(/doesn't store|don't store|not stored/i)
  })

  it("which-ai answer names the BYO harnesses and the $8 add-on", () => {
    const whichAi = faq.items.find((i) => i.id === "which-ai")
    expect(whichAi!.answer).toMatch(/claude code/i)
    expect(whichAi!.answer).toMatch(/codex/i)
    expect(whichAi!.answer).toMatch(/\$8/)
  })

  it("routines answer carries the read-edit-undo trust story", () => {
    const routines = faq.items.find((i) => i.id === "routines")
    expect(routines!.answer).toMatch(/file/i)
    expect(routines!.answer).toMatch(/undo/i)
  })

  it("memory answer keeps the wiki on the user's Mac", () => {
    const memory = faq.items.find((i) => i.id === "memory")
    expect(memory!.answer).toMatch(/wiki|files/i)
    expect(memory!.answer).toMatch(/your mac|your machine/i)
  })

  it("names user-side harnesses only — never backend model vendors", () => {
    const serialized = JSON.stringify(faq)
    expect(serialized).not.toMatch(/openai|gpt-?\d|fireworks|openrouter|\bglm\b/i)
    // "Claude Code" (the harness) is allowed; the bare vendor name is not.
    expect(serialized).not.toMatch(/claude(?!\s+code)/i)
    expect(serialized).not.toMatch(/anthropic/i)
  })

  it("macOS requirement answer states Tahoe", () => {
    const req = faq.items.find((i) => i.id === "macos-requirement")
    expect(req!.answer).toMatch(/tahoe/i)
    expect(req!.answer).toMatch(/older macOS versions/i)
  })

  it("does not promise unverified platforms", () => {
    const serialized = JSON.stringify(faq)
    expect(serialized).not.toMatch(/ios companion|iphone|ipad/i)
  })
})
