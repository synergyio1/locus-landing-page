export type PricingCadence = "monthly" | "yearly"

export type BillingOption = {
  cadence: PricingCadence
  toggleLabel: string
  perMonth: number
  billedNote: string
  savings?: string
}

export type AiChoiceCard = {
  badge: string
  title: string
  body: string
}

export type PricingContent = {
  id: string
  eyebrow: string
  headline: string
  subline: string
  defaultCadence: PricingCadence
  billing: { monthly: BillingOption; yearly: BillingOption }
  plan: {
    label: string
    trialChip: string
    ctaLabel: string
    ctaNote: string
  }
  aiChoice: {
    eyebrow: string
    byo: AiChoiceCard
    remote: AiChoiceCard
    note: string
  }
  assurances: string[]
  download: { label: string; href: string }
}

export const pricing: PricingContent = {
  id: "pricing",
  eyebrow: "Pricing",
  headline: "One plan. All of Locus.",
  subline:
    "Everything included. 7 days free, no card — then $3 a month or $30 a year: a small fee that keeps the infrastructure running and the app improving.",
  defaultCadence: "yearly",
  billing: {
    monthly: {
      cadence: "monthly",
      toggleLabel: "Monthly",
      perMonth: 3,
      billedNote: "Billed month to month. Cancel anytime.",
    },
    yearly: {
      cadence: "yearly",
      toggleLabel: "Yearly",
      perMonth: 2.5,
      billedNote: "$30 billed once a year. Cancel anytime.",
      savings: "2 months free",
    },
  },
  plan: {
    label: "Locus — everything included",
    trialChip: "7 days free",
    ctaLabel: "Start 7 days free",
    ctaNote: "The trial starts inside the app — no card required.",
  },
  aiChoice: {
    eyebrow: "Choose your AI",
    byo: {
      badge: "Included",
      title: "Bring your own AI",
      body: "Plug in the AI you already pay for — Claude Code, Codex, or an API key. No extra cost.",
    },
    remote: {
      badge: "Optional · Prepaid credits",
      title: "Locus Remote",
      body: "Nothing to connect? Buy Remote credits — any amount, one-off — and Locus spends them as you use the AI. Never part of the plan or the trial.",
    },
    note: "Same features either way. The only difference is whose AI does the thinking.",
  },
  assurances: ["7-day free trial", "Cancel anytime", "30-day refund"],
  download: {
    label: "Download for macOS — your trial starts in the app",
    href: "/download",
  },
}
