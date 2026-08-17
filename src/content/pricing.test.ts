import { describe, expect, it } from "vitest"

import { pricing } from "./pricing"

describe("pricing content", () => {
  it("exposes monthly and yearly billing options for the single plan", () => {
    expect(pricing.billing.monthly.cadence).toBe("monthly")
    expect(pricing.billing.yearly.cadence).toBe("yearly")
  })

  it("prices the plan at $6/mo monthly and $4/mo billed yearly", () => {
    expect(pricing.billing.monthly.perMonth).toBe(6)
    expect(pricing.billing.yearly.perMonth).toBe(4)
    expect(pricing.billing.yearly.billedNote).toMatch(/\$48/)
  })

  it("defaults to the yearly cadence so the lower per-month price leads", () => {
    expect(pricing.defaultCadence).toBe("yearly")
  })

  it("surfaces the yearly savings on the yearly option only", () => {
    expect(pricing.billing.yearly.savings).toMatch(/33%/)
    expect(pricing.billing.monthly.savings).toBeUndefined()
  })

  it("attaches the 14-day no-card trial to the plan", () => {
    expect(pricing.plan.trialChip).toMatch(/14 days/i)
    expect(pricing.plan.ctaLabel).toMatch(/14 days free/i)
    expect(pricing.plan.ctaNote).toMatch(/no card/i)
  })

  it("does not surface killed free-tier or 7-day trial copy", () => {
    const serialized = JSON.stringify(pricing)
    expect(serialized).not.toMatch(/free forever/i)
    expect(serialized).not.toMatch(/free tier/i)
    expect(serialized).not.toMatch(/7[- ]day/i)
    expect(serialized).not.toMatch(/\bpro\b/i)
  })

  it("exposes three app-tab feature groups with three terse lines each", () => {
    expect(pricing.featureTabs.map((tab) => tab.tab)).toEqual([
      "Focus",
      "Sentinel",
      "Review",
    ])

    for (const tab of pricing.featureTabs) {
      expect(tab.tagline.length).toBeGreaterThan(0)
      expect(tab.items).toHaveLength(3)
    }
  })

  it("matches the decided feature tab copy", () => {
    expect(pricing.featureTabs).toEqual([
      {
        tab: "Focus",
        tagline: "Declare intent. Work it.",
        items: [
          "Timed sessions with a live focus score",
          "Execution strategies — pomodoro, sprints, deep work",
          "Plan the day around your calendar",
        ],
      },
      {
        tab: "Sentinel",
        tagline: "See where the day really goes.",
        items: [
          "Quiet activity logging between sessions",
          "Budgets for the apps that eat your time",
          "A digest that makes the day legible",
        ],
      },
      {
        tab: "Review",
        tagline: "Learn what actually moved.",
        items: [
          "Daily, weekly, and monthly digests",
          "An AI chat that knows your data",
          "Disagree — it remembers your corrections",
        ],
      },
    ])
  })

  it("does not surface removed feature claims", () => {
    const serialized = JSON.stringify(pricing)
    expect(serialized).not.toMatch(/smart plan/i)
    expect(serialized).not.toMatch(/routines/i)
    expect(serialized).not.toMatch(/memory/i)
    expect(serialized).not.toMatch(/the full loop/i)
    expect(serialized).not.toMatch(/weekly review/i)
    expect(serialized).not.toMatch(/live ai classification/i)
    expect(serialized).not.toMatch(/google calendar sync/i)
    expect(serialized).not.toMatch(/by email/i)
    expect(serialized).not.toMatch(/friday/i)
    expect(serialized).not.toMatch(/drift catch/i)
  })

  it("offers bring-your-own AI as included and managed AI as an $8/mo add-on", () => {
    expect(pricing.aiChoice.byo.badge).toMatch(/included/i)
    expect(pricing.aiChoice.byo.body).toMatch(/no extra cost/i)
    expect(pricing.aiChoice.managed.badge).toMatch(/\$8\/mo/)
    expect(pricing.aiChoice.managed.badge).toMatch(/optional/i)
    expect(pricing.aiChoice.managed.body).toMatch(/top up/i)
  })

  it("provides a tertiary download link to /download", () => {
    expect(pricing.download.href).toBe("/download")
    expect(pricing.download.label.length).toBeGreaterThan(0)
  })
})
