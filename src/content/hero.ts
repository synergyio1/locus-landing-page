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
    "Plans the day. Catches the drift. Stacks the wins. Even 10% more consistent is a different year.",
  primaryCta: {
    label: "Download for macOS — free",
    href: "/download",
  },
  secondaryCta: {
    label: "See it in your work",
    href: "#personas",
  },
  screenshot: {
    src: "/screenshots/screens/CommandView_running_dark.png",
    alt: "Locus with a focus session running on the Q2 strategy doc",
    width: 2880,
    height: 1800,
  },
}
