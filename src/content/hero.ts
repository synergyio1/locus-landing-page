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
  headline: "Finish the things you keep starting.",
  subheadline:
    "An AI plans your day around what matters, catches you the moment you drift, and on Friday shows you what actually moved. One app, every day.",
  primaryCta: {
    label: "Download for macOS — free",
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
