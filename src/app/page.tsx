import { Ai } from "@/components/sections/ai"
import { DailyRun } from "@/components/sections/daily-run"
import { Hero } from "@/components/sections/hero"
import { Loop } from "@/components/sections/loop"

export default function Home() {
  return (
    <>
      <Hero />
      <Loop />
      <DailyRun />
      <Ai />
    </>
  )
}
