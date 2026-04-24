import { Ai } from "@/components/sections/ai"
import { DailyRun } from "@/components/sections/daily-run"
import { Depth } from "@/components/sections/depth"
import { Hero } from "@/components/sections/hero"
import { Loop } from "@/components/sections/loop"
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
    </>
  )
}
