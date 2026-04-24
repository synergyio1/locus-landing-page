import { describe, expect, it } from "vitest"

import { depth } from "./depth"

describe("depth content", () => {
  it("section id is 'depth'", () => {
    expect(depth.id).toBe("depth")
  })

  it("exposes exactly three tiles: Projects, Habits, Tasks", () => {
    expect(depth.tiles).toHaveLength(3)
    expect(depth.tiles.map((t) => t.label)).toEqual([
      "Projects",
      "Habits",
      "Tasks",
    ])
  })

  it("ties each tile to its PRD-prescribed screenshot", () => {
    const byLabel = Object.fromEntries(
      depth.tiles.map((t) => [t.label, t.screenshot.src])
    )
    expect(byLabel["Projects"]).toBe("/screenshots/screens/ProjectDetail_dark.png")
    expect(byLabel["Habits"]).toBe("/screenshots/screens/HabitDetail_dark.png")
    expect(byLabel["Tasks"]).toBe("/screenshots/screens/TasksView_list_dark.png")
  })

  it("screenshots declare width, height, and alt", () => {
    for (const tile of depth.tiles) {
      expect(tile.screenshot.width).toBeGreaterThan(0)
      expect(tile.screenshot.height).toBeGreaterThan(0)
      expect(tile.screenshot.alt.length).toBeGreaterThan(0)
      expect(tile.caption.length).toBeGreaterThan(0)
    }
  })

  it("breaks symmetry: not every tile shares the same rotation", () => {
    const rotations = new Set(depth.tiles.map((t) => t.rotation))
    expect(rotations.size).toBeGreaterThan(1)
  })

  it("has non-empty headline and body", () => {
    expect(depth.headline.length).toBeGreaterThan(0)
    expect(depth.body.length).toBeGreaterThan(0)
  })

  it("does not resurrect the killed 14-day trial copy", () => {
    const all = [depth.headline, depth.body, depth.eyebrow].join(" ")
    expect(all).not.toMatch(/14 days/i)
  })
})
