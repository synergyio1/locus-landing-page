import { describe, it, expect } from "vitest"

import { deriveAccountView } from "./derive"
import type { AccountSnapshot } from "./snapshot"

const baseEmail = "cook@example.com"

describe("deriveAccountView", () => {
  it("returns displayPlan 'free' and trialCta 'start' for a new free user", () => {
    const snapshot: AccountSnapshot = {
      email: baseEmail,
      entitlement: { user_id: "u1", plan: "free", source: null, active_until: null },
      subscription: null,
      proTrial: null,
    }

    const view = deriveAccountView(snapshot)

    expect(view.displayPlan).toBe("free")
    expect(view.planLabel).toBe("Free")
    expect(view.trialCta?.kind).toBe("start")
    expect(view.dateLine).toBeNull()
  })

  it("returns displayPlan 'free' and trialCta 'used' for a free user who consumed their trial", () => {
    const snapshot: AccountSnapshot = {
      email: baseEmail,
      entitlement: { user_id: "u1", plan: "free", source: null, active_until: null },
      subscription: null,
      proTrial: {
        user_id: "u1",
        started_at: "2026-04-01T12:00:00.000Z",
        expires_at: "2026-04-08T12:00:00.000Z",
      },
    }

    const view = deriveAccountView(snapshot)

    expect(view.displayPlan).toBe("free")
    expect(view.trialCta?.kind).toBe("used")
    expect(view.trialCta?.label).toContain("April 1, 2026")
  })

  it("returns displayPlan 'trial' for an active trial (entitlement pro + source trial)", () => {
    const snapshot: AccountSnapshot = {
      email: baseEmail,
      entitlement: {
        user_id: "u1",
        plan: "pro",
        source: "trial",
        active_until: "2026-04-30T12:00:00.000Z",
      },
      subscription: null,
      proTrial: {
        user_id: "u1",
        started_at: "2026-04-23T12:00:00.000Z",
        expires_at: "2026-04-30T12:00:00.000Z",
      },
    }

    const view = deriveAccountView(snapshot, new Date("2026-04-27T12:00:00.000Z"))

    expect(view.displayPlan).toBe("trial")
    expect(view.planLabel).toBe("Trial")
    expect(view.dateLine).toBe("3 days left · expires April 30, 2026")
    expect(view.primaryCta.label).not.toBe("Manage subscription")
  })

  it("returns displayPlan 'pro' for an active subscription (entitlement pro + source subscription)", () => {
    const snapshot: AccountSnapshot = {
      email: baseEmail,
      entitlement: {
        user_id: "u1",
        plan: "pro",
        source: "subscription",
        active_until: "2026-05-25T12:00:00.000Z",
      },
      subscription: {
        user_id: "u1",
        status: "active",
        current_period_end: "2026-05-25T12:00:00.000Z",
        cancel_at: null,
        price_id: "price_monthly",
      },
      proTrial: null,
    }

    const view = deriveAccountView(snapshot)

    expect(view.displayPlan).toBe("pro")
    expect(view.planLabel).toBe("Pro")
    expect(view.primaryCta.label).toBe("Manage subscription")
    expect(view.dateLine).toMatch(/Renews on .+/)
  })

  it("returns 'Pro until <date>, will not renew' for a cancelling subscription", () => {
    const snapshot: AccountSnapshot = {
      email: baseEmail,
      entitlement: {
        user_id: "u1",
        plan: "pro",
        source: "subscription",
        active_until: "2026-05-25T12:00:00.000Z",
      },
      subscription: {
        user_id: "u1",
        status: "active",
        current_period_end: "2026-05-25T12:00:00.000Z",
        cancel_at: "2026-05-25T12:00:00.000Z",
        price_id: "price_monthly",
      },
      proTrial: null,
    }

    const view = deriveAccountView(snapshot)

    expect(view.displayPlan).toBe("pro")
    expect(view.dateLine).toMatch(/Pro until .+, will not renew/)
  })

  it("returns displayPlan 'pro' when subscription active_until is later than trial active_until", () => {
    const snapshot: AccountSnapshot = {
      email: baseEmail,
      entitlement: {
        user_id: "u1",
        plan: "pro",
        source: "subscription",
        active_until: "2026-06-01T12:00:00.000Z",
      },
      subscription: {
        user_id: "u1",
        status: "active",
        current_period_end: "2026-06-01T12:00:00.000Z",
        cancel_at: null,
        price_id: "price_monthly",
      },
      proTrial: {
        user_id: "u1",
        started_at: "2026-04-23T12:00:00.000Z",
        expires_at: "2026-04-30T12:00:00.000Z",
      },
    }

    const view = deriveAccountView(snapshot)

    expect(view.displayPlan).toBe("pro")
    expect(view.primaryCta.label).toBe("Manage subscription")
  })

  it("returns displayPlan 'trial' when trial active_until is later than subscription active_until", () => {
    const snapshot: AccountSnapshot = {
      email: baseEmail,
      entitlement: {
        user_id: "u1",
        plan: "pro",
        source: "trial",
        active_until: "2026-04-30T12:00:00.000Z",
      },
      subscription: {
        user_id: "u1",
        status: "canceled",
        current_period_end: "2026-04-15T12:00:00.000Z",
        cancel_at: null,
        price_id: "price_monthly",
      },
      proTrial: {
        user_id: "u1",
        started_at: "2026-04-23T12:00:00.000Z",
        expires_at: "2026-04-30T12:00:00.000Z",
      },
    }

    const view = deriveAccountView(snapshot)

    expect(view.displayPlan).toBe("trial")
    expect(view.primaryCta.label).not.toBe("Manage subscription")
  })
})
