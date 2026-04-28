export type CheckoutCadence = "monthly" | "yearly"

export type StartCheckoutResult =
  | { kind: "ok"; url: string }
  | { kind: "price_not_configured" }
  | { kind: "malformed_response" }
  | { kind: "network_error" }
  | { kind: "http_error"; status: number }

export async function startCheckout(
  cadence: CheckoutCadence
): Promise<StartCheckoutResult> {
  let response: Response
  try {
    response = await fetch("/api/checkout/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: cadence }),
    })
  } catch {
    return { kind: "network_error" }
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    if (body?.error === "price_not_configured") {
      return { kind: "price_not_configured" }
    }
    return { kind: "http_error", status: response.status }
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    return { kind: "malformed_response" }
  }

  const url = (body as { url?: unknown } | null)?.url
  if (typeof url !== "string" || url.length === 0) {
    return { kind: "malformed_response" }
  }

  return { kind: "ok", url }
}
