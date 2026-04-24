import { Ai } from "@/components/sections/ai"
import { CtaBand } from "@/components/sections/cta-band"
import { DailyRun } from "@/components/sections/daily-run"
import { Depth } from "@/components/sections/depth"
import { Faq } from "@/components/sections/faq"
import { FeatureTour } from "@/components/sections/feature-tour"
import { Hero } from "@/components/sections/hero"
import { Loop } from "@/components/sections/loop"
import { Pricing } from "@/components/sections/pricing"
import { Review } from "@/components/sections/review"
import { TrustStrip } from "@/components/sections/trust-strip"

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Loop />
      <FeatureTour />
      <DailyRun />
      <Ai />
      <Depth />
      <Review />
      <Pricing />
      <Faq />
      <CtaBand />
    </>
  )
}
