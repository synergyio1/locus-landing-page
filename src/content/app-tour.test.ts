import { describe, expect, it } from "vitest"

import { appTour } from "./app-tour"
import { manifesto } from "./manifesto"

const PART_NAMES = manifesto.blocks.flatMap((block) =>
  block.kind === "parts" ? block.items.map((item) => item.name) : []
)

describe("app tour content", () => {
  it("groups every screen under one of the manifesto's three parts", () => {
    expect(PART_NAMES.length).toBe(3)
    for (const screen of appTour.screens) {
      expect(PART_NAMES, screen.name).toContain(screen.part)
    }
  })

  it("covers all three parts, in the letter's order", () => {
    const seen: string[] = []
    for (const screen of appTour.screens) {
      if (seen[seen.length - 1] !== screen.part) seen.push(screen.part)
    }
    // Each part appears as one contiguous run, in manifesto order.
    expect(seen).toEqual(PART_NAMES)
  })

  it("names each screen once, with the app's own subtitle", () => {
    const names = appTour.screens.map((s) => s.name)
    expect(new Set(names).size).toBe(names.length)
    for (const screen of appTour.screens) {
      expect(screen.subtitle, screen.name).toBeTruthy()
      expect(screen.subtitle, screen.name).not.toMatch(/\.$/) // sidebar style
      expect(screen.text.length, screen.name).toBeGreaterThan(40)
    }
  })

  it("holds a frame while the recording is missing", () => {
    if (appTour.video === null) {
      expect(appTour.videoPending.length).toBeGreaterThan(40)
    }
  })

  it("keeps the walkthrough inside the 45–75s brief once it lands", () => {
    const video = appTour.video
    if (!video) return
    expect(video.duration).toBeGreaterThanOrEqual(45)
    expect(video.duration).toBeLessThanOrEqual(75)
    expect(video.src).toMatch(/^\/.+\.(mp4|webm)$/)
    expect(video.poster).toMatch(/^\/.+\.(jpg|jpeg|png|webp)$/)
    expect(video.width).toBeGreaterThan(0)
    expect(video.height).toBeGreaterThan(0)
  })

  it("claims no screenshots — the video carries the imagery for now", () => {
    expect(JSON.stringify(appTour)).not.toMatch(/screenshot/i)
  })
})
