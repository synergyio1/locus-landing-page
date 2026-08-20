import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import {
  CreditPriceConfigurationError,
  createCreditCheckoutSession,
  loadCreditPriceIds,
} from "@/lib/stripe/credits"
import { createServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const Body = z.object({
  priceId: z.string().min(1).max(255),
  purchaseIntentId: z.uuid(),
})

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  const json = await request.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 })
  }

  // Never hand a client-supplied price straight to Stripe — only the
  // configured ladder is purchasable.
  if (!loadCreditPriceIds().includes(parsed.data.priceId)) {
    return NextResponse.json(
      { error: "credit_price_not_allowed" },
      { status: 400 }
    )
  }

  if (!user.email) {
    return NextResponse.json({ error: "missing_email" }, { status: 400 })
  }

  try {
    const { url } = await createCreditCheckoutSession({
      userId: user.id,
      email: user.email,
      priceId: parsed.data.priceId,
      purchaseIntentId: parsed.data.purchaseIntentId,
      origin: request.nextUrl.origin,
    })
    return NextResponse.json({ url })
  } catch (error) {
    if (error instanceof CreditPriceConfigurationError) {
      console.error("Credit price is misconfigured in Stripe", error)
      return NextResponse.json(
        { error: "credit_price_configuration_error" },
        { status: 500 }
      )
    }
    console.error("Failed to create Stripe credit Checkout session", error)
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 })
  }
}
