import { AppDemo } from "@/components/sections/app-demo"
import { ArmorReactor } from "@/components/sections/armor-reactor"
import { Faq } from "@/components/sections/faq"
import { Flywheel } from "@/components/sections/flywheel"
import { Hero } from "@/components/sections/hero"
import { Pricing } from "@/components/sections/pricing"
import { SystemDemonstrationPlaceholder } from "@/components/sections/system-demonstration-placeholder"
import { Transformation } from "@/components/sections/transformation"
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
      <Transformation />
      <AppDemo />
      <Flywheel />
      <SystemDemonstrationPlaceholder />
      <ArmorReactor />
      <Pricing isAuthed={isAuthed} />
      <Faq />
    </>
  )
}
