import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { startCheckout } from "./start-checkout"

const fetchMock = vi.fn()

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock)
  fetchMock.mockReset()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("startCheckout", () => {
  it("posts the cadence to /api/checkout/create and returns ok with the URL", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ url: "https://checkout.stripe.com/c/pay/cs_test" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )

    const result = await startCheckout("monthly")

    expect(result).toEqual({
      kind: "ok",
      url: "https://checkout.stripe.com/c/pay/cs_test",
    })
    expect(fetchMock).toHaveBeenCalledWith("/api/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "monthly" }),
    })
  })

  it("returns price_not_configured when the API responds with that error code", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "price_not_configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    )

    const result = await startCheckout("yearly")

    expect(result).toEqual({ kind: "price_not_configured" })
  })

  it("returns http_error for a non-2xx status that isn't price_not_configured", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "checkout_failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    )

    const result = await startCheckout("monthly")

    expect(result).toEqual({ kind: "http_error", status: 500 })
  })

  it("returns http_error when the non-2xx body is not JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("<!doctype html>", { status: 502 })
    )

    const result = await startCheckout("monthly")

    expect(result).toEqual({ kind: "http_error", status: 502 })
  })

  it("returns malformed_response when a 2xx body is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("not json", { status: 200 }))

    const result = await startCheckout("monthly")

    expect(result).toEqual({ kind: "malformed_response" })
  })

  it("returns malformed_response when a 2xx JSON body has no url field", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )

    const result = await startCheckout("monthly")

    expect(result).toEqual({ kind: "malformed_response" })
  })

  it("returns network_error when fetch rejects", async () => {
    fetchMock.mockRejectedValue(new TypeError("offline"))

    const result = await startCheckout("monthly")

    expect(result).toEqual({ kind: "network_error" })
  })
})
