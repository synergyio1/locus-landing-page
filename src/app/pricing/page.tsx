import type { Metadata } from "next"

import { Pricing } from "@/components/sections/pricing"

export const metadata: Metadata = {
  title: "Pricing — Locus",
  description:
    "Locus is free forever for the core loop. Pro is $6 per month or $58 per year.",
}

export default function PricingPage() {
  return <Pricing />
}
