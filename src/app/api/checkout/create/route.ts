import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import { createCheckoutSession } from "@/lib/stripe/checkout"
import { createServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const Body = z.object({
  priceId: z.enum(["monthly", "yearly"]),
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

  const stripePriceId =
    parsed.data.priceId === "monthly"
      ? process.env.STRIPE_PRICE_MONTHLY
      : process.env.STRIPE_PRICE_YEARLY

  if (!stripePriceId) {
    return NextResponse.json(
      { error: "price_not_configured" },
      { status: 500 }
    )
  }

  if (!user.email) {
    return NextResponse.json({ error: "missing_email" }, { status: 400 })
  }

  try {
    const { url } = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      priceId: stripePriceId,
      origin: request.nextUrl.origin,
    })
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Failed to create Stripe Checkout session", error)
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 })
  }
}
