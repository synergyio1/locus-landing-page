import { describe, expect, it } from "vitest"

import { pricing } from "./pricing"

describe("pricing content", () => {
  it("exposes exactly two plans: Free and Pro", () => {
    expect(pricing.plans).toHaveLength(2)
    const [free, pro] = pricing.plans
    expect(free.id).toBe("free")
    expect(pro.id).toBe("pro")
  })

  it("Pro plan prices at $6/mo and $58/yr with $14 savings", () => {
    const pro = pricing.plans.find((p) => p.id === "pro")
    expect(pro).toBeDefined()
    expect(pro!.price.monthly.amount).toBe(6)
    expect(pro!.price.yearly.amount).toBe(58)
    expect(pro!.price.yearly.savings).toMatch(/\$14/)
  })

  it("Free plan is priced at 0", () => {
    const free = pricing.plans.find((p) => p.id === "free")
    expect(free).toBeDefined()
    expect(free!.price.monthly.amount).toBe(0)
    expect(free!.price.yearly.amount).toBe(0)
  })

  it("each plan exposes at least one feature bullet and a CTA", () => {
    for (const plan of pricing.plans) {
      expect(plan.features.length).toBeGreaterThan(0)
      expect(plan.cta.label.length).toBeGreaterThan(0)
    }
  })

  it("mentions the 7-day Try Pro unlock and not a 14-day trial", () => {
    const serialized = JSON.stringify(pricing)
    expect(serialized).toMatch(/7[- ]day/i)
    expect(serialized).not.toMatch(/14 days/i)
    expect(serialized).not.toMatch(/no card required/i)
  })

  it("exposes a default cadence of 'monthly'", () => {
    expect(pricing.defaultCadence).toBe("monthly")
  })
})
