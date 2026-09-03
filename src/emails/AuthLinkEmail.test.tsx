import { render } from "@react-email/render"
import { describe, expect, it } from "vitest"

import { AuthLinkEmail } from "./AuthLinkEmail"

const props = {
  confirmUrl: "https://getlocus.tech/auth/confirm?token_hash=abc&type=email",
  heading: "Sign in to Locus.",
  intro: "Tap below and you're back where you left off.",
  action: "Sign in to Locus",
  preview: "Your one-time link to sign in to Locus.",
}

describe("AuthLinkEmail", () => {
  it("renders the sign-in email", async () => {
    const html = await render(<AuthLinkEmail {...props} />, { pretty: true })
    expect(html).toMatchSnapshot()
  })

  // The href ships HTML-escaped (`&amp;` between query params), which is correct
  // markup — mail clients decode it back to `&` before following the link.
  it("points the call to action at the supplied URL", async () => {
    const html = await render(<AuthLinkEmail {...props} />)
    expect(html).toContain(props.confirmUrl.replace(/&/g, "&amp;"))
    expect(html).toContain(props.action)
  })

  // The production hrefs are Go templates, not URLs. If rendering ever escaped or
  // rewrote the braces, every recipient would get a dead link.
  it("passes Supabase template placeholders through untouched", async () => {
    const html = await render(
      <AuthLinkEmail
        {...props}
        confirmUrl="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}"
      />
    )
    expect(html).toContain("{{ .SiteURL }}")
    expect(html).toContain("{{ .TokenHash }}")
    expect(html).toContain("{{ .RedirectTo }}")
  })

  // Mail clients hide remote images for senders they are unsure about, and a
  // request to a domain that isn't the sender's is one of the signals that gets
  // branded mail marked as impersonation. Neither is worth a logo on the one
  // email someone needs in order to get in.
  it("asks the mail client to load nothing", async () => {
    const html = await render(<AuthLinkEmail {...props} />)
    expect(html).not.toMatch(/<img/i)
    expect(html).toContain("Locus")
  })
})
