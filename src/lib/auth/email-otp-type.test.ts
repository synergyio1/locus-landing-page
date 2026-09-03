import { describe, expect, it } from "vitest"

import { isVerifyType, toEmailOtpType } from "./email-otp-type"

describe("isVerifyType", () => {
  it("accepts the types an email link can carry", () => {
    for (const type of [
      "magiclink",
      "signup",
      "email",
      "recovery",
      "invite",
      "email_change",
    ]) {
      expect(isVerifyType(type)).toBe(true)
    }
  })

  it("rejects phone types, junk and non-strings", () => {
    expect(isVerifyType("sms")).toBe(false)
    expect(isVerifyType("phone_change")).toBe(false)
    expect(isVerifyType("EMAIL")).toBe(false)
    expect(isVerifyType("")).toBe(false)
    expect(isVerifyType(null)).toBe(false)
    expect(isVerifyType(42)).toBe(false)
  })
})

describe("toEmailOtpType", () => {
  // verifyOtp documents magiclink and signup as deprecated aliases of email.
  it("folds the flow-specific names onto email", () => {
    expect(toEmailOtpType("magiclink")).toBe("email")
    expect(toEmailOtpType("signup")).toBe("email")
    expect(toEmailOtpType("email")).toBe("email")
  })

  it("leaves the types that mean something different alone", () => {
    expect(toEmailOtpType("recovery")).toBe("recovery")
    expect(toEmailOtpType("invite")).toBe("invite")
    expect(toEmailOtpType("email_change")).toBe("email_change")
  })
})
