import { Faq } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero"
import { Pricing } from "@/components/sections/pricing"
import { SystemDemonstrationPlaceholder } from "@/components/sections/system-demonstration-placeholder"
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
      <SystemDemonstrationPlaceholder />
      <Pricing isAuthed={isAuthed} />
      <Faq />
    </>
  )
}
