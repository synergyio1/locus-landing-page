import { describe, expect, it } from "vitest"

import { faq } from "./faq"

describe("faq content", () => {
  it("retains all seven original tactical topics", () => {
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

  it("adds the strategic topics introduced by the A.10 redesign", () => {
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

  it("each item has a non-empty question and answer", () => {
    for (const item of faq.items) {
      expect(item.question.length).toBeGreaterThan(0)
      expect(item.answer.length).toBeGreaterThan(0)
    }
  })

  it("privacy answer mentions on-device classification", () => {
    const privacy = faq.items.find((i) => i.id === "privacy")
    expect(privacy!.answer).toMatch(/on[- ]device/i)
  })

  it("macOS requirement answer states Sonoma / 14", () => {
    const req = faq.items.find((i) => i.id === "macos-requirement")
    expect(req!.answer).toMatch(/sonoma|14/i)
  })

  it("does not resurrect killed 14-day trial copy", () => {
    const serialized = JSON.stringify(faq)
    expect(serialized).not.toMatch(/14 days/i)
    expect(serialized).not.toMatch(/no card required/i)
  })
})
