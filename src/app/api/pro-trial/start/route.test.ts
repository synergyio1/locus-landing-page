import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"

const authState: { user: { id: string; email: string | null } | null } = {
  user: null,
}
const fakeSupabase = {
  auth: {
    getUser: async () => ({
      data: { user: authState.user },
      error: null,
    }),
  },
}

const { queryRaw } = vi.hoisted(() => ({
  queryRaw: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: async () => fakeSupabase,
}))

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    $queryRaw: queryRaw,
  },
}))

import { POST } from "./route"

describe("POST /api/pro-trial/start", () => {
  beforeEach(() => {
    authState.user = null
    queryRaw.mockReset()
  })

  afterEach(() => {
    queryRaw.mockReset()
  })

  it("returns 401 when the user is unauthenticated", async () => {
    const response = await POST()
    expect(response.status).toBe(401)
    expect(queryRaw).not.toHaveBeenCalled()
  })

  it("inserts a row and returns started:true with expiresAt for a fresh user", async () => {
    authState.user = { id: "user_fresh", email: "fresh@example.com" }
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    queryRaw.mockResolvedValueOnce([{ expires_at: expiresAt }])

    const response = await POST()
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.started).toBe(true)
    expect(typeof body.expiresAt).toBe("string")
    const returned = new Date(body.expiresAt).getTime()
    const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000
    expect(Math.abs(returned - sevenDaysFromNow)).toBeLessThan(60_000)

    expect(queryRaw).toHaveBeenCalledTimes(1)
  })

  it("returns started:false with reason 'already-used' when the user already has a row", async () => {
    authState.user = { id: "user_returning", email: "returning@example.com" }
    queryRaw.mockResolvedValueOnce([])

    const response = await POST()
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      started: false,
      reason: "already-used",
    })
    expect(queryRaw).toHaveBeenCalledTimes(1)
  })

  it("only one of two parallel requests for the same user returns started:true", async () => {
    authState.user = { id: "user_concurrent", email: "race@example.com" }
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    queryRaw
      .mockResolvedValueOnce([{ expires_at: expiresAt }])
      .mockResolvedValueOnce([])

    const [r1, r2] = await Promise.all([POST(), POST()])
    const [b1, b2] = await Promise.all([r1.json(), r2.json()])

    const started = [b1, b2].filter((b) => b.started === true)
    const notStarted = [b1, b2].filter((b) => b.started === false)
    expect(started).toHaveLength(1)
    expect(notStarted).toHaveLength(1)
    expect(notStarted[0]).toEqual({
      started: false,
      reason: "already-used",
    })
    expect(queryRaw).toHaveBeenCalledTimes(2)
  })

  it("returns 500 when the DB call throws", async () => {
    authState.user = { id: "user_db_down", email: "down@example.com" }
    queryRaw.mockRejectedValueOnce(new Error("connection refused"))

    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const response = await POST()
    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body.error).toBe("trial_failed")
    errSpy.mockRestore()
  })
})
