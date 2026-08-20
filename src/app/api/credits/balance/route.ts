import { NextResponse } from "next/server"

import { CreditLedgerRepo } from "@/lib/db/creditLedgerRepo"
import { createServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

// Polled by the account page after a Checkout return: the grant is webhook
// driven, so the balance lands a beat after the redirect.
export async function GET() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  const creditBalanceCents = await CreditLedgerRepo.balanceCents(user.id)
  return NextResponse.json(
    { creditBalanceCents },
    { headers: { "Cache-Control": "no-store" } }
  )
}
