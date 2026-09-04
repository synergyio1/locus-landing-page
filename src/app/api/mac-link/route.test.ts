import { beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const { sendMacLink } = vi.hoisted(() => ({
  sendMacLink: vi.fn(),
}))

vi.mock("@/lib/mail/sendMacLink", () => ({
  sendMacLink,
}))

import { resetRateLimits } from "@/lib/rate-limit"

import { POST } from "./route"

function request(body: unknown, ip = "203.0.113.1"): NextRequest {
  return new NextRequest("https://www.getlocus.tech/api/mac-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  })
}

describe("POST /api/mac-link", () => {
  beforeEach(() => {
    sendMacLink.mockReset()
    sendMacLink.mockResolvedValue(undefined)
    resetRateLimits()
  })

  it("sends the download link to a valid address", async () => {
    const response = await POST(request({ email: "reader@example.com" }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendMacLink).toHaveBeenCalledWith(
      "reader@example.com",
      expect.objectContaining({ downloadUrl: expect.stringContaining(".dmg") })
    )
  })

  it("normalises the address so casing cannot dodge the per-email limit", async () => {
    await POST(request({ email: "  Reader@Example.com  " }))
    expect(sendMacLink).toHaveBeenCalledWith(
      "reader@example.com",
      expect.anything()
    )
  })

  it("rejects a malformed address without sending", async () => {
    const response = await POST(request({ email: "not-an-email" }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: "invalid_email" })
    expect(sendMacLink).not.toHaveBeenCalled()
  })

  it("rejects a body that is not JSON", async () => {
    const bad = new NextRequest("https://www.getlocus.tech/api/mac-link", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.9" },
      body: "not json",
    })

    const response = await POST(bad)
    expect(response.status).toBe(400)
    expect(sendMacLink).not.toHaveBeenCalled()
  })

  it("limits one caller to five sends a minute", async () => {
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(request({ email: `reader${i}@example.com` }))
      expect(ok.status).toBe(200)
    }

    const blocked = await POST(request({ email: "reader5@example.com" }))
    expect(blocked.status).toBe(429)
    expect(sendMacLink).toHaveBeenCalledTimes(5)
  })

  it("stops one inbox being bombed from many callers, without disclosing it", async () => {
    for (let i = 0; i < 3; i += 1) {
      await POST(request({ email: "target@example.com" }, `198.51.100.${i}`))
    }
    expect(sendMacLink).toHaveBeenCalledTimes(3)

    const response = await POST(
      request({ email: "target@example.com" }, "198.51.100.50")
    )

    // Reported as success on purpose: a 429 here would confirm the address.
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendMacLink).toHaveBeenCalledTimes(3)
  })

  it("reports a send failure instead of claiming success", async () => {
    sendMacLink.mockRejectedValue(new Error("resend is down"))
    vi.spyOn(console, "error").mockImplementation(() => {})

    const response = await POST(request({ email: "reader@example.com" }))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: "send_failed" })
  })
})
