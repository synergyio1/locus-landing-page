import type { Metadata } from "next"

import { Pricing } from "@/components/sections/pricing"

export const metadata: Metadata = {
  title: "Pricing — Locus",
  description:
    "One plan, everything included. $3 a month, or $30 a year. 7 days free, no card required.",
}

export default function PricingPage() {
  return <Pricing headingLevel="h1" />
}
