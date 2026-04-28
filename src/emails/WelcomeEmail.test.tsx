import { describe, it, expect } from "vitest"
import { render } from "@react-email/render"

import { WelcomeEmail } from "./WelcomeEmail"

describe("WelcomeEmail", () => {
  it("renders for a new user with a name", async () => {
    const html = await render(
      <WelcomeEmail
        name="Ada"
        email="ada@example.com"
        downloadUrl="https://getlocus.tech/download"
      />,
      { pretty: true }
    )
    expect(html).toMatchSnapshot()
  })

  it("renders without a name (falls back to a generic greeting)", async () => {
    const html = await render(
      <WelcomeEmail
        name={null}
        email="someone@example.com"
        downloadUrl="https://getlocus.tech/download"
      />,
      { pretty: true }
    )
    expect(html).toMatchSnapshot()
  })

  it("uses the supplied download URL on the call-to-action", async () => {
    const html = await render(
      <WelcomeEmail
        name="Ada"
        email="ada@example.com"
        downloadUrl="https://preview.getlocus.tech/download?build=42"
      />
    )
    expect(html).toContain("https://preview.getlocus.tech/download?build=42")
  })
})
