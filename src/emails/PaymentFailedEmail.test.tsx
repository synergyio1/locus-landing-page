import { describe, it, expect } from "vitest"
import { render } from "@react-email/render"

import { PaymentFailedEmail } from "./PaymentFailedEmail"

describe("PaymentFailedEmail", () => {
  it("renders the recipient email and the update-payment URL", async () => {
    const html = await render(
      <PaymentFailedEmail
        email="ada@example.com"
        updatePaymentUrl="https://billing.stripe.com/p/session/test_xyz"
      />
    )
    expect(html).toContain("ada@example.com")
    expect(html).toContain("https://billing.stripe.com/p/session/test_xyz")
  })

  it("renders consistent markup for the dunning notice", async () => {
    const html = await render(
      <PaymentFailedEmail
        email="ada@example.com"
        updatePaymentUrl="https://billing.stripe.com/p/session/test_xyz"
      />,
      { pretty: true }
    )
    expect(html).toMatchSnapshot()
  })
})
