import { describe, it, expect } from "vitest"

import { decideSignupPing } from "./signup-event"

const CONFIRMED = "2026-09-04T10:00:00Z"

function payload(
  over: Partial<Parameters<typeof decideSignupPing>[0]> = {},
): Parameters<typeof decideSignupPing>[0] {
  return { type: "INSERT", table: "users", schema: "auth", ...over }
}

describe("decideSignupPing — the four cases that matter", () => {
  it("pings on an INSERT that is already confirmed (Mac app Google sign-in)", () => {
    const decision = decideSignupPing(
      payload({
        type: "INSERT",
        record: {
          id: "user-1",
          email: "new@example.com",
          email_confirmed_at: CONFIRMED,
          raw_app_meta_data: { provider: "google" },
        },
      }),
    )

    expect(decision).toEqual({
      ping: true,
      user: { id: "user-1", email: "new@example.com", provider: "google" },
    })
  })

  it("stays silent on an INSERT that is not yet confirmed (email code requested, never entered)", () => {
    const decision = decideSignupPing(
      payload({
        type: "INSERT",
        record: {
          id: "user-2",
          email: "maybe@example.com",
          email_confirmed_at: null,
          raw_app_meta_data: { provider: "email" },
        },
      }),
    )

    expect(decision).toEqual({ ping: false, reason: "unconfirmed" })
  })

  it("pings on the unconfirmed→confirmed UPDATE (email code entered)", () => {
    const decision = decideSignupPing(
      payload({
        type: "UPDATE",
        old_record: { id: "user-2", email_confirmed_at: null },
        record: {
          id: "user-2",
          email: "maybe@example.com",
          email_confirmed_at: CONFIRMED,
          raw_app_meta_data: { provider: "email" },
        },
      }),
    )

    expect(decision).toEqual({
      ping: true,
      user: { id: "user-2", email: "maybe@example.com", provider: "email" },
    })
  })

  it("stays silent when an already-confirmed row is updated — this is every returning sign-in", () => {
    const decision = decideSignupPing(
      payload({
        type: "UPDATE",
        old_record: { id: "user-1", email_confirmed_at: CONFIRMED },
        record: {
          id: "user-1",
          email: "new@example.com",
          email_confirmed_at: CONFIRMED,
          raw_app_meta_data: { provider: "google" },
        },
      }),
    )

    expect(decision).toEqual({
      ping: false,
      reason: "no_confirmation_transition",
    })
  })
})

describe("decideSignupPing — guards", () => {
  it("ignores DELETE", () => {
    expect(
      decideSignupPing(
        payload({ type: "DELETE", old_record: { id: "gone" }, record: null }),
      ),
    ).toEqual({ ping: false, reason: "delete" })
  })

  it("ignores a webhook mis-scoped to another table", () => {
    expect(
      decideSignupPing(
        payload({
          table: "subscriptions",
          schema: "app",
          record: { id: "x", email_confirmed_at: CONFIRMED },
        }),
      ),
    ).toEqual({ ping: false, reason: "wrong_table" })
  })

  it("ignores an anonymous user", () => {
    expect(
      decideSignupPing(
        payload({
          record: {
            id: "anon",
            email_confirmed_at: CONFIRMED,
            is_anonymous: true,
          },
        }),
      ),
    ).toEqual({ ping: false, reason: "anonymous" })
  })

  it("ignores a soft-deleted user", () => {
    expect(
      decideSignupPing(
        payload({
          record: {
            id: "x",
            email_confirmed_at: CONFIRMED,
            deleted_at: "2026-09-04T11:00:00Z",
          },
        }),
      ),
    ).toEqual({ ping: false, reason: "deleted_user" })
  })

  it("ignores a payload with no record", () => {
    expect(decideSignupPing(payload({ record: null }))).toEqual({
      ping: false,
      reason: "missing_record",
    })
  })

  it("accepts phone confirmation as a confirmation", () => {
    const decision = decideSignupPing(
      payload({
        record: {
          id: "p1",
          email: null,
          phone_confirmed_at: CONFIRMED,
          raw_app_meta_data: { provider: "phone" },
        },
      }),
    )

    expect(decision).toEqual({
      ping: true,
      user: { id: "p1", email: null, provider: "phone" },
    })
  })

  it("falls back to the generated confirmed_at when per-channel columns are absent", () => {
    const decision = decideSignupPing(
      payload({ record: { id: "g1", email: "g@x.io", confirmed_at: CONFIRMED } }),
    )

    expect(decision).toEqual({
      ping: true,
      user: { id: "g1", email: "g@x.io", provider: null },
    })
  })
})
