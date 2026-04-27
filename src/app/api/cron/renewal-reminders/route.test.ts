import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"

const sqlFn = vi.fn()
const sendRenewalReminderMock = vi.fn()

vi.mock("@/lib/db/client", () => ({
  getDb: () => sqlFn,
}))

vi.mock("@/lib/mail/sendRenewalReminder", () => ({
  sendRenewalReminder: (...args: unknown[]) =>
    sendRenewalReminderMock(...args),
}))

import { POST } from "./route"

const ORIGINAL_ENV = { ...process.env }

function postReq(authHeader?: string | null): NextRequest {
  const headers = new Headers({ "Content-Type": "application/json" })
  if (authHeader) headers.set("authorization", authHeader)
  return new NextRequest(
    new URL("https://getlocus.tech/api/cron/renewal-reminders"),
    { method: "POST", headers }
  )
}

const SECRET = "cron_secret_test"

const seedRow = {
  id: "sub_1",
  email: "ada@example.com",
  current_period_end: "2026-05-04T00:00:00.000Z",
  price_id: "price_yearly_test",
}

describe("POST /api/cron/renewal-reminders", () => {
  beforeEach(() => {
    sqlFn.mockReset()
    sendRenewalReminderMock.mockReset()
    process.env.CRON_SECRET = SECRET
    process.env.STRIPE_PRICE_YEARLY = "price_yearly_test"
    process.env.STRIPE_PRICE_MONTHLY = "price_monthly_test"
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("returns 401 when the Authorization header is missing", async () => {
    const response = await POST(postReq(null))
    expect(response.status).toBe(401)
    expect(sqlFn).not.toHaveBeenCalled()
    expect(sendRenewalReminderMock).not.toHaveBeenCalled()
  })

  it("returns 401 when the bearer token does not match CRON_SECRET", async () => {
    const response = await POST(postReq("Bearer wrong_secret"))
    expect(response.status).toBe(401)
    expect(sqlFn).not.toHaveBeenCalled()
    expect(sendRenewalReminderMock).not.toHaveBeenCalled()
  })

  it("returns 500 when CRON_SECRET is not configured", async () => {
    delete process.env.CRON_SECRET
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const response = await POST(postReq(`Bearer ${SECRET}`))
    expect(response.status).toBe(500)
    expect(sqlFn).not.toHaveBeenCalled()
    errSpy.mockRestore()
  })

  it("sends a reminder for each due subscription, flips the flag, and returns the count", async () => {
    sqlFn.mockResolvedValueOnce([seedRow]) // SELECT
    sqlFn.mockResolvedValueOnce([]) // UPDATE
    sendRenewalReminderMock.mockResolvedValueOnce(undefined)

    const response = await POST(postReq(`Bearer ${SECRET}`))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ sent: 1 })

    expect(sendRenewalReminderMock).toHaveBeenCalledTimes(1)
    expect(sendRenewalReminderMock).toHaveBeenCalledWith(
      { email: "ada@example.com" },
      {
        renewalDate: "2026-05-04T00:00:00.000Z",
        plan: "yearly",
      }
    )

    expect(sqlFn).toHaveBeenCalledTimes(2)
    const updateArgs = sqlFn.mock.calls[1]
    expect(updateArgs).toContain(seedRow.id)
  })

  it("returns 0 reminders sent when no subscriptions match the window (re-run / dedupe path)", async () => {
    sqlFn.mockResolvedValueOnce([])

    const response = await POST(postReq(`Bearer ${SECRET}`))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ sent: 0 })
    expect(sendRenewalReminderMock).not.toHaveBeenCalled()
    expect(sqlFn).toHaveBeenCalledTimes(1)
  })

  it("treats non-yearly price IDs as monthly", async () => {
    sqlFn.mockResolvedValueOnce([
      { ...seedRow, price_id: "price_monthly_test" },
    ])
    sqlFn.mockResolvedValueOnce([])
    sendRenewalReminderMock.mockResolvedValueOnce(undefined)

    await POST(postReq(`Bearer ${SECRET}`))
    expect(sendRenewalReminderMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ plan: "monthly" })
    )
  })

  it("does not flip the flag when the email send throws — Stripe-style retry on next cron tick", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    sqlFn.mockResolvedValueOnce([seedRow]) // SELECT
    sendRenewalReminderMock.mockRejectedValueOnce(new Error("resend down"))

    const response = await POST(postReq(`Bearer ${SECRET}`))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ sent: 0 })
    expect(sqlFn).toHaveBeenCalledTimes(1) // only the SELECT, no UPDATE
    errSpy.mockRestore()
  })
})
