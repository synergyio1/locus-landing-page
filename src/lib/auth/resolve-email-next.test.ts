import { describe, expect, it } from "vitest"

import { resolveEmailNext } from "./resolve-email-next"

const HERE = "https://getlocus.tech/auth/confirm"

describe("resolveEmailNext", () => {
  it("passes a plain same-site path straight through", () => {
    expect(resolveEmailNext("/billing", HERE)).toBe("/billing")
  })

  it("reduces a same-origin URL to its path", () => {
    expect(resolveEmailNext("https://getlocus.tech/billing?tab=plan", HERE)).toBe(
      "/billing?tab=plan"
    )
  })

  // {{ .RedirectTo }} is the emailRedirectTo we sent, which points at the confirm
  // route itself — landing there again would ask the user to confirm a spent token.
  it("unwraps the nested next when the URL points back at an auth route", () => {
    expect(
      resolveEmailNext(
        "https://getlocus.tech/auth/confirm?next=%2Fbilling",
        HERE
      )
    ).toBe("/billing")
  })

  it("falls back to /account when an auth route carries no next", () => {
    expect(resolveEmailNext("https://getlocus.tech/auth/confirm", HERE)).toBe(
      "/account"
    )
  })

  // Supabase substitutes the Site URL when emailRedirectTo is not allow-listed.
  it("treats a bare site URL as the account page", () => {
    expect(resolveEmailNext("https://getlocus.tech/", HERE)).toBe("/")
    expect(resolveEmailNext(undefined, HERE)).toBe("/account")
    expect(resolveEmailNext("", HERE)).toBe("/account")
  })

  it("refuses another origin", () => {
    expect(resolveEmailNext("https://evil.example.com/steal", HERE)).toBe(
      "/account"
    )
    expect(resolveEmailNext("//evil.example.com", HERE)).toBe("/account")
    expect(resolveEmailNext("not a url", HERE)).toBe("/account")
  })
})
