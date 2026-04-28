import { describe, it, expect } from "vitest"

import { formatTrialDateLine } from "./derive"

describe("formatTrialDateLine", () => {
  it("returns 'Trial expires today' when now equals activeUntil", () => {
    const date = new Date("2026-04-30T12:00:00.000Z")
    expect(formatTrialDateLine(date, date)).toBe("Trial expires today")
  })

  it("returns 'Trial expires today' when activeUntil is within the next 24h (Math.ceil keeps daysLeft at 0)", () => {
    const now = new Date("2026-04-30T00:00:00.000Z")
    const oneMs = new Date("2026-04-30T00:00:00.001Z")
    const almostADay = new Date("2026-04-30T23:59:59.000Z")
    expect(formatTrialDateLine(oneMs, now)).toBe("Trial expires today")
    expect(formatTrialDateLine(almostADay, now)).toBe("Trial expires today")
  })

  it("returns '1 day left · expires …' when activeUntil is exactly 24h away (singular)", () => {
    const now = new Date("2026-04-29T12:00:00.000Z")
    const activeUntil = new Date("2026-04-30T12:00:00.000Z")
    expect(formatTrialDateLine(activeUntil, now)).toBe(
      "1 day left · expires April 30, 2026"
    )
  })

  it("rounds up with Math.ceil — 3 days + a few hours yields '4 days left · expires …'", () => {
    const now = new Date("2026-04-26T08:00:00.000Z")
    const activeUntil = new Date("2026-04-29T12:00:00.000Z")
    expect(formatTrialDateLine(activeUntil, now)).toBe(
      "4 days left · expires April 29, 2026"
    )
  })

  it("formats the date portion in en-US UTC as 'April 30, 2026'", () => {
    const now = new Date("2026-04-23T12:00:00.000Z")
    const activeUntil = new Date("2026-04-30T12:00:00.000Z")
    expect(formatTrialDateLine(activeUntil, now)).toBe(
      "7 days left · expires April 30, 2026"
    )
  })

  it("returns 'Trial expires today' when activeUntil is in the past", () => {
    const now = new Date("2026-05-01T12:00:00.000Z")
    const activeUntil = new Date("2026-04-30T12:00:00.000Z")
    expect(formatTrialDateLine(activeUntil, now)).toBe("Trial expires today")
  })
})
