export type StartCreditCheckoutResult =
  | { kind: "ok"; url: string }
  | { kind: "credit_price_not_allowed" }
  | { kind: "malformed_response" }
  | { kind: "network_error" }
  | { kind: "http_error"; status: number }

export async function startCreditCheckout(
  priceId: string,
  // A client-generated id makes the Stripe call idempotent, so a double-tap
  // yields one session rather than two.
  purchaseIntentId: string
): Promise<StartCreditCheckoutResult> {
  let response: Response
  try {
    response = await fetch("/api/credits/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, purchaseIntentId }),
    })
  } catch {
    return { kind: "network_error" }
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    if (
      body?.error === "credit_price_not_allowed" ||
      body?.error === "credit_price_configuration_error"
    ) {
      return { kind: "credit_price_not_allowed" }
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
