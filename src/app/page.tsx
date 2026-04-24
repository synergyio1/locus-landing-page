import { Ai } from "@/components/sections/ai"
import { DailyRun } from "@/components/sections/daily-run"
import { Depth } from "@/components/sections/depth"
import { Faq } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero"
import { Loop } from "@/components/sections/loop"
import { Pricing } from "@/components/sections/pricing"
import { Review } from "@/components/sections/review"

export default function Home() {
  return (
    <>
      <Hero />
      <Loop />
      <DailyRun />
      <Ai />
      <Depth />
      <Review />
      <Pricing />
      <Faq />
    </>
  )
}
