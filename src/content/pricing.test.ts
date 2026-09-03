import { describe, expect, it } from "vitest"

import { pricing } from "./pricing"

describe("pricing content", () => {
  it("exposes monthly and yearly billing options for the single plan", () => {
    expect(pricing.billing.monthly.cadence).toBe("monthly")
    expect(pricing.billing.yearly.cadence).toBe("yearly")
  })

  it("prices the plan at $3/mo monthly and $2.50/mo billed yearly ($30/yr)", () => {
    expect(pricing.billing.monthly.perMonth).toBe(3)
    expect(pricing.billing.yearly.perMonth).toBe(2.5)
    expect(pricing.billing.yearly.billedNote).toMatch(/\$30 billed once a year/)
    // The per-month equivalent must actually add up to the yearly charge.
    expect(pricing.billing.yearly.perMonth * 12).toBe(30)
    // "2 months free": a year costs ten monthly payments.
    expect(pricing.billing.monthly.perMonth * 10).toBe(30)
  })

  it("defaults to the yearly cadence so the lower per-month price leads", () => {
    expect(pricing.defaultCadence).toBe("yearly")
  })

  it("surfaces the yearly savings on the yearly option only", () => {
    expect(pricing.billing.yearly.savings).toMatch(/2 months free/i)
    expect(pricing.billing.monthly.savings).toBeUndefined()
  })

  it("attaches the 7-day no-card trial to the plan", () => {
    expect(pricing.plan.trialChip).toMatch(/7 days/i)
    expect(pricing.plan.ctaNote).toMatch(/7-day/i)
    expect(pricing.plan.ctaNote).toMatch(/no card/i)
    expect(pricing.assurances).toContain("7-day free trial")
  })

  it("frames the fee as upkeep, not premium", () => {
    expect(pricing.subline).toMatch(/\$3 a month/)
    expect(pricing.subline).toMatch(/\$30 a year/)
    expect(pricing.subline).toMatch(/infrastructure/i)
  })

  it("does not surface killed free-tier, 30-day trial, or pre-August pricing copy", () => {
    const serialized = JSON.stringify(pricing)
    expect(serialized).not.toMatch(/free forever/i)
    expect(serialized).not.toMatch(/free tier/i)
    // The 30-day *refund* assurance is live copy; only trial phrasings died.
    expect(serialized).not.toMatch(/30[- ]day (free |pro )?trial|30 days free/i)
    expect(serialized).not.toMatch(/\bpro\b/i)
    expect(serialized).not.toMatch(/14[- ]day/i)
    expect(serialized).not.toMatch(/\$8\b/)
    expect(serialized).not.toMatch(/\$48\b/)
    expect(serialized).not.toMatch(/33%/)
    expect(serialized).not.toMatch(/managed/i)
  })

  it("carries no feature list — the section is price + AI choice only", () => {
    expect("featureTabs" in pricing).toBe(false)
    expect("featuresEyebrow" in pricing).toBe(false)
    const serialized = JSON.stringify(pricing)
    expect(serialized).not.toMatch(/on day one/i)
    expect(serialized).not.toMatch(/sentinel/i)
    expect(serialized).not.toMatch(/timed sessions/i)
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

  it("offers bring-your-own AI as included and Locus Remote as prepaid credits", () => {
    expect(pricing.aiChoice.byo.badge).toMatch(/included/i)
    expect(pricing.aiChoice.byo.body).toMatch(/no extra cost/i)
    expect(pricing.aiChoice.remote.title).toMatch(/locus remote/i)
    expect(pricing.aiChoice.remote.badge).toMatch(/optional/i)
    expect(pricing.aiChoice.remote.badge).toMatch(/credits/i)
    expect(pricing.aiChoice.remote.body).toMatch(/buy remote credits/i)
    expect(pricing.aiChoice.remote.body).toMatch(/any amount/i)
    expect(pricing.aiChoice.remote.body).toMatch(/one-off/i)
    expect(pricing.aiChoice.remote.body).toMatch(
      /never part of the plan or the trial/i
    )
  })

  it("the plan CTA is the download, with no login in front of it (Luis, 2026-09-02)", () => {
    expect(pricing.plan.ctaLabel).toBe("Download the app")
    expect(pricing.plan.ctaHref).toBe("/download")
    expect(pricing.plan.ctaHref).not.toMatch(/login|signup/)
  })
})
