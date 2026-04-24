import type { Metadata } from "next"

import { LegalPage } from "@/components/sections/legal-page"
import { privacy } from "@/content/privacy"

export const metadata: Metadata = {
  title: "Privacy — Locus",
  description:
    "How Locus handles your focus data, website metadata, and subscription information.",
}

export default function PrivacyPage() {
  return <LegalPage content={privacy} />
}
