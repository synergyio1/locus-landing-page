import { describe, expect, it } from "vitest"

import { review } from "./review"

describe("review content", () => {
  it("section id is 'review'", () => {
    expect(review.id).toBe("review")
  })

  it("exposes exactly two panels: weekly view + chart card", () => {
    expect(review.panels).toHaveLength(2)
    expect(review.panels[0].screenshot.src).toBe(
      "/screenshots/screens/ReviewView_weekly_dark.png"
    )
    expect(review.panels[1].screenshot.src).toBe(
      "/screenshots/components/ReviewChart_card_dark.png"
    )
  })

  it("screenshots declare width, height, and alt", () => {
    for (const panel of review.panels) {
      expect(panel.screenshot.width).toBeGreaterThan(0)
      expect(panel.screenshot.height).toBeGreaterThan(0)
      expect(panel.screenshot.alt.length).toBeGreaterThan(0)
      expect(panel.caption.length).toBeGreaterThan(0)
    }
  })

  it("frames the weekly reflection in headline or body", () => {
    const all = `${review.headline} ${review.body} ${review.eyebrow}`
    expect(all).toMatch(/week|friday/i)
  })

  it("does not resurrect the killed 14-day trial copy", () => {
    const all = [review.headline, review.body, review.eyebrow].join(" ")
    expect(all).not.toMatch(/14 days/i)
  })
})
