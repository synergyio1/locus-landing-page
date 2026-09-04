import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import type { NextRequest } from "next/server"

const { notifyNewUserMock, captureServerEventMock } = vi.hoisted(() => ({
  notifyNewUserMock: vi.fn(),
  captureServerEventMock: vi.fn(),
}))

vi.mock("@/lib/slack", () => ({
  notifyNewUser: (...args: unknown[]) => notifyNewUserMock(...args),
}))

vi.mock("@/lib/analytics/server", () => ({
  captureServerEvent: (...args: unknown[]) => captureServerEventMock(...args),
}))

import { POST } from "./route"

const SECRET = "s3cret-value"

/**
 * Duck-typed request: the route reads only `headers.get` and `json`, and
 * building a real NextRequest under jsdom drags in the whole fetch surface.
 */
function request(body: unknown, secret: string | null = SECRET): NextRequest {
  return {
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "x-locus-webhook-secret" ? secret : null,
    },
    json: async () => {
      if (body === "__invalid__") throw new SyntaxError("bad json")
      return body
    },
  } as unknown as NextRequest
}

function confirmedInsert() {
  return {
    type: "INSERT",
    table: "users",
    schema: "auth",
    record: {
      id: "user-1",
      email: "new@example.com",
      email_confirmed_at: "2026-09-04T10:00:00Z",
      raw_app_meta_data: { provider: "google" },
    },
  }
}

describe("POST /api/supabase/user-created", () => {
  beforeEach(() => {
    notifyNewUserMock.mockReset()
    notifyNewUserMock.mockResolvedValue(undefined)
    captureServerEventMock.mockReset()
    captureServerEventMock.mockResolvedValue(undefined)
    process.env.LOCUS_SUPABASE_WEBHOOK_SECRET = SECRET
  })

  afterEach(() => {
    delete process.env.LOCUS_SUPABASE_WEBHOOK_SECRET
  })

  it("announces a confirmed new user and records the analytics event", async () => {
    const response = await POST(request(confirmedInsert()))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      ok: true,
      announced: true,
    })
    expect(notifyNewUserMock).toHaveBeenCalledWith({
      email: "new@example.com",
      provider: "google",
    })
    expect(captureServerEventMock).toHaveBeenCalledWith(
      "user-1",
      "user_signed_up",
      expect.objectContaining({ provider: "google" })
    )
  })

  // The endpoint is public and its payload shape is guessable, so the secret is
  // the only thing standing between a stranger and forged signups in Slack.
  it("rejects a wrong secret without announcing anything", async () => {
    const response = await POST(request(confirmedInsert(), "wrong"))

    expect(response.status).toBe(401)
    expect(notifyNewUserMock).not.toHaveBeenCalled()
  })

  it("rejects a missing secret header", async () => {
    const response = await POST(request(confirmedInsert(), null))

    expect(response.status).toBe(401)
    expect(notifyNewUserMock).not.toHaveBeenCalled()
  })

  it("refuses to run at all when the server has no secret configured", async () => {
    delete process.env.LOCUS_SUPABASE_WEBHOOK_SECRET
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const response = await POST(request(confirmedInsert()))
    errSpy.mockRestore()

    expect(response.status).toBe(500)
    expect(notifyNewUserMock).not.toHaveBeenCalled()
  })

  it("acknowledges without announcing when the row does not qualify", async () => {
    const response = await POST(
      request({
        type: "UPDATE",
        table: "users",
        schema: "auth",
        old_record: { id: "u", email_confirmed_at: "2026-09-01T00:00:00Z" },
        record: {
          id: "u",
          email: "returning@example.com",
          email_confirmed_at: "2026-09-01T00:00:00Z",
        },
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      ok: true,
      skipped: "no_confirmation_transition",
    })
    expect(notifyNewUserMock).not.toHaveBeenCalled()
  })

  it("returns 400 on a malformed body", async () => {
    const response = await POST(request("__invalid__"))

    expect(response.status).toBe(400)
    expect(notifyNewUserMock).not.toHaveBeenCalled()
  })

  // Supabase retries non-2xx. A Slack outage must not turn into a retry storm.
  it("still answers 200 when the announcement itself throws", async () => {
    notifyNewUserMock.mockRejectedValueOnce(new Error("slack exploded"))
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const response = await POST(request(confirmedInsert()))
    errSpy.mockRestore()

    expect(response.status).toBe(200)
  })
})
