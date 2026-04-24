import { DayInLocus } from "@/components/sections/day-in-locus"
import { Depth } from "@/components/sections/depth"
import { Faq } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero"
import { Pricing } from "@/components/sections/pricing"
import { Review } from "@/components/sections/review"

export default function Home() {
  return (
    <>
      <Hero />
      <DayInLocus />
      <Review />
      <Depth />
      <Pricing />
      <Faq />
    </>
  )
}
