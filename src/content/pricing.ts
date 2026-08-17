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

export type FeatureTab = {
  tab: string
  tagline: string
  items: string[]
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
  featuresEyebrow: string
  featureTabs: FeatureTab[]
  aiChoice: {
    eyebrow: string
    byo: AiChoiceCard
    managed: AiChoiceCard
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
    "Every feature included, nothing gated. 14 days free, no card — then $4 a month if you commit to a year, or $6 month to month.",
  defaultCadence: "yearly",
  billing: {
    monthly: {
      cadence: "monthly",
      toggleLabel: "Monthly",
      perMonth: 6,
      billedNote: "Billed month to month. Cancel anytime.",
    },
    yearly: {
      cadence: "yearly",
      toggleLabel: "Yearly",
      perMonth: 4,
      billedNote: "$48 billed once a year. Cancel anytime.",
      savings: "Save 33%",
    },
  },
  plan: {
    label: "Locus — everything included",
    trialChip: "14 days free",
    ctaLabel: "Start 14 days free",
    ctaNote: "The trial starts inside the app — no card required.",
  },
  featuresEyebrow: "Everything, on day one",
  featureTabs: [
    {
      tab: "Focus",
      tagline: "Declare intent. Work it.",
      items: [
        "Timed sessions with a live focus score",
        "Execution strategies — pomodoro, sprints, deep work",
        "Plan the day around your calendar",
      ],
    },
    {
      tab: "Sentinel",
      tagline: "See where the day really goes.",
      items: [
        "Quiet activity logging between sessions",
        "Budgets for the apps that eat your time",
        "A digest that makes the day legible",
      ],
    },
    {
      tab: "Review",
      tagline: "Learn what actually moved.",
      items: [
        "Daily, weekly, and monthly digests",
        "An AI chat that knows your data",
        "Disagree — it remembers your corrections",
      ],
    },
  ],
  aiChoice: {
    eyebrow: "Choose your AI",
    byo: {
      badge: "Included",
      title: "Bring your own AI",
      body: "Plug in the AI subscription you already pay for — Claude Code, Codex, or any compatible harness. Locus runs on it at no extra cost.",
    },
    managed: {
      badge: "Optional · $8/mo",
      title: "Locus managed AI",
      body: "No harness, or saving your own tokens? Add $8 a month in credits on frontier models. Top up or drop it anytime from your account.",
    },
    note: "Both run the same features — the planning, the classification, the reviews. The only difference is whose AI does the thinking.",
  },
  assurances: ["14-day free trial", "Cancel anytime", "30-day refund"],
  download: {
    label: "Download for macOS — your trial starts in the app",
    href: "/download",
  },
}
