import { describe, expect, it } from "vitest"

import { flywheel } from "./flywheel"

describe("flywheel content", () => {
  it("section id is 'flywheel'", () => {
    expect(flywheel.id).toBe("flywheel")
  })

  it("stages are indexed 01 → 03: sensors, capture, brains", () => {
    expect(flywheel.sensors.index).toBe("01")
    expect(flywheel.capture.index).toBe("02")
    expect(flywheel.brains.index).toBe("03")
  })

  it("sensors stage runs Focus then Sentinel, both with real screenshot posters", () => {
    expect(flywheel.sensors.rows.map((row) => row.id)).toEqual([
      "focus",
      "sentinel",
    ])
    for (const row of flywheel.sensors.rows) {
      expect(row.clip.poster).not.toBeNull()
      expect(row.clip.poster?.src).toMatch(/^\/screenshots\/screens\//)
    }
  })

  it("capture stage toggles Tasks, Habits, Notes", () => {
    expect(flywheel.capture.clips.map((clip) => clip.id)).toEqual([
      "tasks",
      "habits",
      "notes",
    ])
  })

  it("brains stage toggles Chat, Routines, Memory", () => {
    expect(flywheel.brains.clips.map((clip) => clip.id)).toEqual([
      "chat",
      "routines",
      "memory",
    ])
  })

  it("every clip declares an alt and a two-part caption", () => {
    for (const clip of [...flywheel.capture.clips, ...flywheel.brains.clips]) {
      expect(clip.alt.length).toBeGreaterThan(0)
      expect(clip.caption.lead.length).toBeGreaterThan(0)
      expect(clip.caption.rest.length).toBeGreaterThan(0)
    }
  })

  it("posters, when present, declare real dimensions", () => {
    const posters = [
      ...flywheel.sensors.rows.map((row) => row.clip.poster),
      ...flywheel.capture.clips.map((clip) => clip.poster),
      ...flywheel.brains.clips.map((clip) => clip.poster),
    ].filter((poster) => poster !== null)

    expect(posters.length).toBeGreaterThan(0)
    for (const poster of posters) {
      expect(poster.width).toBeGreaterThan(0)
      expect(poster.height).toBeGreaterThan(0)
    }
  })

  it("brains clips are still awaiting captures (no posters exist yet)", () => {
    // Routines/Memory/Chat screenshots don't exist yet — see
    // product-marketing-context "new screenshots needed". When captures
    // land, update this test alongside the posters.
    for (const clip of flywheel.brains.clips) {
      expect(clip.poster).toBeNull()
    }
  })
})
