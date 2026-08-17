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
  // The manifesto's spine, and nothing else (Luis, 2026-08-17). Local-first
  // and BYO AI live in the manifesto's decisions list and on the pricing rail.
  subheadline:
    "One system you can trust with your whole day. Stay present today, learn from every day, and let the small changes compound.",
  primaryCta: {
    label: "Download for macOS",
    href: "/download",
  },
  secondaryCta: {
    label: "Read the manifesto",
    href: "#manifesto",
  },
}
