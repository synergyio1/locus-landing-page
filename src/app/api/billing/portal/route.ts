import { NextResponse, type NextRequest } from "next/server"

import { createPortalSession } from "@/lib/stripe/portal"
import { createServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  try {
    const { url } = await createPortalSession({
      userId: user.id,
      returnUrl: `${request.nextUrl.origin}/account`,
    })
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Failed to create Stripe Portal session", error)
    if (error instanceof Error && /no stripe customer/i.test(error.message)) {
      return NextResponse.json({ error: "no_customer" }, { status: 409 })
    }
    return NextResponse.json({ error: "portal_failed" }, { status: 500 })
  }
}
