import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"

import checkoutCompletedFixture from "@/lib/stripe/events/__fixtures__/checkout.session.completed.json"

const { constructEvent, recordIfNew, markProcessed, handleStripeEventMock } =
  vi.hoisted(() => ({
    constructEvent: vi.fn(),
    recordIfNew: vi.fn(),
    markProcessed: vi.fn(),
    handleStripeEventMock: vi.fn(),
  }))

vi.mock("@/lib/stripe/client", () => ({
  getStripeClient: () => ({
    webhooks: { constructEvent },
  }),
}))

vi.mock("@/lib/db/stripeEventsRepo", () => ({
  StripeEventsRepo: { recordIfNew, markProcessed },
}))

vi.mock("@/lib/stripe/events/handle", () => ({
  handleStripeEvent: (...args: unknown[]) => handleStripeEventMock(...args),
}))

import { POST } from "./route"

const ORIGINAL_ENV = { ...process.env }

function postWebhook(rawBody: string, signature: string | null = "t=1,v1=sig") {
  const headers = new Headers({ "Content-Type": "application/json" })
  if (signature !== null) headers.set("stripe-signature", signature)
  return new NextRequest(new URL("https://getlocus.tech/api/stripe/webhook"), {
    method: "POST",
    body: rawBody,
    headers,
  })
}

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    constructEvent.mockReset()
    recordIfNew.mockReset()
    markProcessed.mockReset()
    markProcessed.mockResolvedValue({ updated: true })
    handleStripeEventMock.mockReset()
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_123"
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("returns 400 when the stripe-signature header is missing", async () => {
    const response = await POST(
      postWebhook(JSON.stringify(checkoutCompletedFixture), null)
    )
    expect(response.status).toBe(400)
    expect(constructEvent).not.toHaveBeenCalled()
    expect(recordIfNew).not.toHaveBeenCalled()
    expect(handleStripeEventMock).not.toHaveBeenCalled()
  })

  it("returns 400 when signature verification throws", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    constructEvent.mockImplementation(() => {
      throw new Error("No signatures found")
    })

    const response = await POST(
      postWebhook(JSON.stringify(checkoutCompletedFixture))
    )

    expect(response.status).toBe(400)
    expect(recordIfNew).not.toHaveBeenCalled()
    expect(handleStripeEventMock).not.toHaveBeenCalled()
    errSpy.mockRestore()
  })

  it("on the success path: records, dispatches, and stamps processed_at", async () => {
    constructEvent.mockReturnValue(checkoutCompletedFixture)
    recordIfNew.mockResolvedValueOnce({ claimed: true, processedAt: null })
    handleStripeEventMock.mockResolvedValueOnce({
      handled: true,
      type: checkoutCompletedFixture.type,
    })

    const rawBody = JSON.stringify(checkoutCompletedFixture)
    const response = await POST(postWebhook(rawBody, "t=1,v1=valid"))

    expect(response.status).toBe(200)
    expect(constructEvent).toHaveBeenCalledWith(
      rawBody,
      "t=1,v1=valid",
      "whsec_test_123"
    )
    expect(recordIfNew).toHaveBeenCalledWith(
      checkoutCompletedFixture.id,
      checkoutCompletedFixture.type,
      rawBody
    )
    expect(handleStripeEventMock).toHaveBeenCalledWith(checkoutCompletedFixture)
    expect(markProcessed).toHaveBeenCalledWith(checkoutCompletedFixture.id)
  })

  it("on the failure path: dispatcher throws, processed_at is left null, response is 500", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    constructEvent.mockReturnValue(checkoutCompletedFixture)
    recordIfNew.mockResolvedValueOnce({ claimed: true, processedAt: null })
    handleStripeEventMock.mockRejectedValueOnce(new Error("db down"))

    const response = await POST(
      postWebhook(JSON.stringify(checkoutCompletedFixture))
    )

    expect(response.status).toBe(500)
    expect(markProcessed).not.toHaveBeenCalled()
    errSpy.mockRestore()
  })

  it("on retried delivery after a prior success: short-circuits with duplicate:true", async () => {
    constructEvent.mockReturnValue(checkoutCompletedFixture)
    recordIfNew.mockResolvedValueOnce({
      claimed: false,
      processedAt: new Date("2026-04-28T18:00:00Z"),
    })

    const response = await POST(
      postWebhook(JSON.stringify(checkoutCompletedFixture))
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ received: true, duplicate: true })
    expect(handleStripeEventMock).not.toHaveBeenCalled()
    expect(markProcessed).not.toHaveBeenCalled()
  })

  it("on retried delivery while a prior attempt left processed_at null: returns non-200 so Stripe retries again", async () => {
    constructEvent.mockReturnValue(checkoutCompletedFixture)
    recordIfNew.mockResolvedValueOnce({ claimed: false, processedAt: null })

    const response = await POST(
      postWebhook(JSON.stringify(checkoutCompletedFixture))
    )

    expect(response.status).not.toBe(200)
    expect(handleStripeEventMock).not.toHaveBeenCalled()
    expect(markProcessed).not.toHaveBeenCalled()
  })

  it("returns 500 when STRIPE_WEBHOOK_SECRET is not configured", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const response = await POST(
      postWebhook(JSON.stringify(checkoutCompletedFixture))
    )

    expect(response.status).toBe(500)
    expect(constructEvent).not.toHaveBeenCalled()
    errSpy.mockRestore()
  })
})
