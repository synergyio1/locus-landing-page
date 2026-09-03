export type HeroCta = {
  label: string
  href: string
}

export type HeroContent = {
  headline: string
  /** Second line of the headline, rendered under it on its own line. */
  headlineTail: string
  subheadline: string
  primaryCta: HeroCta
  secondaryCta: HeroCta
}

export const hero: HeroContent = {
  headline: "The missing OS for modern work.",
  // Sits under the headline as its own line, same type (Luis, 2026-09-02).
  headlineTail: "For macOS.",
  // The manifesto's spine, and nothing else (Luis, 2026-08-17). Local-first
  // and BYO AI live in the manifesto's decisions list and on the pricing rail.
  // Two sentences of near-equal length; the hero renders one per line from
  // `sm` up (Luis, 2026-09-02) so they read as two balanced lines.
  subheadline:
    "One system you can trust with your whole day. Learn from every day, and let the small changes compound.",
  primaryCta: {
    label: "Download the app",
    href: "/download",
  },
  secondaryCta: {
    label: "Read the manifesto",
    href: "#manifesto",
  },
}

/** The subheadline split at sentence boundaries, for one-sentence-per-line rendering. */
export const heroSubheadlineLines: readonly string[] = hero.subheadline
  .split(/(?<=\.)\s+/)
  .filter(Boolean)
