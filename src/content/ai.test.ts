import { describe, expect, it } from "vitest"

import { ai } from "./ai"

describe("ai content", () => {
  it("section id is 'ai'", () => {
    expect(ai.id).toBe("ai")
  })

  it("exposes exactly three examples in on-track / unknown / off-track order", () => {
    expect(ai.examples.map((e) => e.state)).toEqual([
      "on-track",
      "unknown",
      "off-track",
    ])
  })

  it("example titles match the PRD-prescribed window titles", () => {
    const byState = Object.fromEntries(
      ai.examples.map((e) => [e.state, e.example])
    )
    expect(byState["on-track"]).toMatch(/chrome.*pull request/i)
    expect(byState["unknown"]).toMatch(/unclassified window title/i)
    expect(byState["off-track"]).toMatch(/chrome.*twitter/i)
  })

  it("grounds AI claims in real capabilities only (banned phrases absent)", () => {
    const all = [
      ai.headline,
      ai.body,
      ...ai.examples.map((e) => `${e.label} ${e.example} ${e.description}`),
    ].join(" ")
    expect(all).not.toMatch(/8[-\s]?second drift/i)
    expect(all).not.toMatch(/40\+/)
    expect(all).not.toMatch(/40 categor/i)
  })

  it("renders the ActivityClassify screenshot with dimensions", () => {
    expect(ai.screenshot.src).toBe(
      "/screenshots/ActivityClassify_card_dark.png"
    )
    expect(ai.screenshot.width).toBeGreaterThan(0)
    expect(ai.screenshot.height).toBeGreaterThan(0)
    expect(ai.screenshot.alt.length).toBeGreaterThan(0)
  })
})
