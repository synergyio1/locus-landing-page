import type { Metadata } from "next"

import { Pricing } from "@/components/sections/pricing"
import { createServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Pricing — Locus",
  description:
    "One plan, everything included. $4 a month billed yearly, or $6 month to month. 14 days free, no card required.",
}

export default async function PricingPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthed = user !== null

  return <Pricing headingLevel="h1" isAuthed={isAuthed} />
}
