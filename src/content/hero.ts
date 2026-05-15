export type HeroCta = {
  label: string
  href: string
}

export type HeroContent = {
  headline: string
  subheadline: string
  primaryCta: HeroCta
  secondaryCta: HeroCta
  screenshot: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export const hero: HeroContent = {
  headline: "The missing OS for modern work.",
  subheadline:
    "Work got faster. Life got fuller. Locus helps you declare intent, see what actually happened, and turn each day into a better tomorrow.",
  primaryCta: {
    label: "Download free for macOS",
    href: "/download",
  },
  secondaryCta: {
    label: "See a day in Locus",
    href: "#day-in-locus",
  },
  screenshot: {
    src: "/screenshots/screens/CommandView_running_dark.png",
    alt: "Locus with a focus session running on the Q2 strategy doc",
    width: 2880,
    height: 1800,
  },
}
