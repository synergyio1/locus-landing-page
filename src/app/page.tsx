import { AppShowcase } from "@/components/sections/app-showcase"
import { Hero } from "@/components/sections/hero"
import { Manifesto } from "@/components/sections/manifesto"
import { Pricing } from "@/components/sections/pricing"
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
      <AppShowcase />
      <Pricing isAuthed={isAuthed} />
    </>
  )
}
