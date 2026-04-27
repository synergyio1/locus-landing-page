import { describe, it, expect } from "vitest"
import { render } from "@react-email/render"

import { CancellationEmail } from "./CancellationEmail"

describe("CancellationEmail", () => {
  it("renders for a monthly subscriber with a near-term access-until date", async () => {
    const html = await render(
      <CancellationEmail
        email="ada@example.com"
        accessUntil="2026-05-15T00:00:00.000Z"
      />,
      { pretty: true }
    )
    expect(html).toMatchSnapshot()
  })

  it("renders for a yearly subscriber with a far-future access-until date", async () => {
    const html = await render(
      <CancellationEmail
        email="ada@example.com"
        accessUntil="2027-01-01T00:00:00.000Z"
      />,
      { pretty: true }
    )
    expect(html).toMatchSnapshot()
  })

  it("formats access-until dates as a human-readable UTC date", async () => {
    const html = await render(
      <CancellationEmail
        email="ada@example.com"
        accessUntil="2026-12-25T00:00:00.000Z"
      />
    )
    expect(html).toContain("December 25, 2026")
  })
})
