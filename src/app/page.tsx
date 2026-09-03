import {
  ReadDepthTracking,
  SectionTracking,
} from "@/components/analytics/section-tracking"
import { AppShowcase } from "@/components/sections/app-showcase"
import { DesignDecisions } from "@/components/sections/design-decisions"
import { Hero } from "@/components/sections/hero"
import { Manifesto } from "@/components/sections/manifesto"
import { Pricing } from "@/components/sections/pricing"
import { appShowcase } from "@/content/app-showcase"
import { designDecisions } from "@/content/design-decisions"
import { manifesto } from "@/content/manifesto"
import { pricing } from "@/content/pricing"

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <DesignDecisions />
      <AppShowcase />
      <Pricing />
      <SectionTracking
        sectionIds={[
          manifesto.id,
          designDecisions.id,
          appShowcase.id,
          pricing.id,
        ]}
      />
      <ReadDepthTracking targetId={manifesto.id} />
    </>
  )
}
