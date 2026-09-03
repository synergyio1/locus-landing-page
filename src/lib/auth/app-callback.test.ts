import { describe, expect, it } from "vitest"

import { buildAppVerifyUrl, isAppCallback } from "./app-callback"

describe("isAppCallback", () => {
  it("recognises both bundle ids the Mac app can ship under", () => {
    expect(isAppCallback("com.locus.app://auth/callback")).toBe(true)
    expect(isAppCallback("tech.getlocus.app://auth/callback")).toBe(true)
  })

  // A prefix check here would hand any caller a redirect target on a URL that
  // carries a live token.
  it("refuses near-misses and anything else", () => {
    expect(isAppCallback("com.locus.app://auth/callback/../evil")).toBe(false)
    expect(isAppCallback("com.locus.app.evil://auth/callback")).toBe(false)
    expect(isAppCallback("https://getlocus.tech/account")).toBe(false)
    expect(isAppCallback("evil://auth/callback")).toBe(false)
    expect(isAppCallback(null)).toBe(false)
  })
})

describe("buildAppVerifyUrl", () => {
  const SUPABASE = "https://project.supabase.co"
  const APP = "com.locus.app://auth/callback"

  it("rebuilds the verify URL Supabase would have put in the email", () => {
    const url = new URL(buildAppVerifyUrl(SUPABASE, "hash-123", "magiclink", APP))

    expect(url.origin + url.pathname).toBe(`${SUPABASE}/auth/v1/verify`)
    expect(url.searchParams.get("token")).toBe("hash-123")
    expect(url.searchParams.get("type")).toBe("magiclink")
    expect(url.searchParams.get("redirect_to")).toBe(APP)
  })

  // The verify endpoint has no `email` type — that name exists only on verifyOtp.
  it("translates the verifyOtp alias back to the endpoint's own name", () => {
    const url = new URL(buildAppVerifyUrl(SUPABASE, "hash", "email", APP))
    expect(url.searchParams.get("type")).toBe("magiclink")
  })

  it("carries a signup link through as a signup", () => {
    const url = new URL(buildAppVerifyUrl(SUPABASE, "hash", "signup", APP))
    expect(url.searchParams.get("type")).toBe("signup")
  })
})
