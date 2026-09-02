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
import { createServerClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthed = user !== null

  return (
    <>
      <Hero />
      <Manifesto />
      <DesignDecisions />
      <AppShowcase />
      <Pricing isAuthed={isAuthed} />
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
