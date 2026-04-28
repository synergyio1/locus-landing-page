import type { Metadata } from "next"

import { Pricing } from "@/components/sections/pricing"
import { createServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Pricing — Locus",
  description:
    "Locus is free forever for the core loop. Pro is $6 per month or $58 per year.",
}

export default async function PricingPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthed = user !== null

  return <Pricing headingLevel="h1" isAuthed={isAuthed} />
}
