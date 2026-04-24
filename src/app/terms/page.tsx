import type { Metadata } from "next"

import { LegalPage } from "@/components/sections/legal-page"
import { terms } from "@/content/terms"

export const metadata: Metadata = {
  title: "Terms — Locus",
  description:
    "The terms that govern your use of the Locus app, the website, and Pro subscriptions.",
}

export default function TermsPage() {
  return <LegalPage content={terms} />
}
