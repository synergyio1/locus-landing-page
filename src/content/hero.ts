export type HeroCta = {
  label: string
  href: string
}

export type HeroContent = {
  headline: string
  subheadline: string
  primaryCta: HeroCta
  secondaryCta: HeroCta
}

export const hero: HeroContent = {
  headline: "The missing OS for modern work.",
  subheadline:
    "Work got faster. Life got fuller. Locus helps you declare intent, see what actually happened, and turn each day into a better tomorrow — with an AI agent that lives on your Mac and runs on the AI you already pay for.",
  primaryCta: {
    label: "Download for macOS",
    href: "/download",
  },
  secondaryCta: {
    label: "See a day in Locus",
    href: "#day-in-locus",
  },
}
