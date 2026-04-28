import { DayInLocus } from "@/components/sections/day-in-locus"
import { Depth } from "@/components/sections/depth"
import { Faq } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero"
import { Pricing } from "@/components/sections/pricing"
import { Review } from "@/components/sections/review"
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
      <DayInLocus />
      <Review />
      <Depth />
      <Pricing isAuthed={isAuthed} />
      <Faq />
    </>
  )
}
