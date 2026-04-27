import { describe, it, expect } from "vitest"
import { render } from "@react-email/render"

import { RenewalReminderEmail } from "./RenewalReminderEmail"

describe("RenewalReminderEmail", () => {
  it("renders for a monthly subscriber", async () => {
    const html = await render(
      <RenewalReminderEmail
        email="ada@example.com"
        renewalDate="2026-05-15T00:00:00.000Z"
        plan="monthly"
      />,
      { pretty: true }
    )
    expect(html).toMatchSnapshot()
  })

  it("renders for a yearly subscriber", async () => {
    const html = await render(
      <RenewalReminderEmail
        email="ada@example.com"
        renewalDate="2027-01-01T00:00:00.000Z"
        plan="yearly"
      />,
      { pretty: true }
    )
    expect(html).toMatchSnapshot()
  })

  it("formats renewal dates as a human-readable UTC date", async () => {
    const html = await render(
      <RenewalReminderEmail
        email="ada@example.com"
        renewalDate="2026-12-25T00:00:00.000Z"
        plan="yearly"
      />
    )
    expect(html).toContain("December 25, 2026")
  })

  it("references the plan cadence in the body", async () => {
    const html = await render(
      <RenewalReminderEmail
        email="ada@example.com"
        renewalDate="2026-05-15T00:00:00.000Z"
        plan="monthly"
      />
    )
    expect(html).toContain("monthly")
  })
})
