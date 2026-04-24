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
  headline: "Know where your hours actually went.",
  subheadline:
    "A macOS focus system for sessions, projects and habits.",
  primaryCta: {
    label: "Download for macOS",
    href: "/download",
  },
  secondaryCta: {
    label: "See how it works",
    href: "#loop",
  },
  screenshot: {
    src: "/screenshots/screens/CommandView_running_dark.png",
    alt: "Locus Command view with a focus session running",
    width: 2880,
    height: 1800,
  },
}
