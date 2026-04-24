export type PricingCadence = "monthly" | "yearly"

export type PlanPrice = {
  amount: number
  unit: string
  note?: string
  savings?: string
}

export type PricingPlan = {
  id: "free" | "pro"
  name: string
  tagline: string
  price: {
    monthly: PlanPrice
    yearly: PlanPrice
  }
  features: string[]
  cta: { label: string; href: string }
  featured?: boolean
}

export type PricingContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  defaultCadence: PricingCadence
  plans: [PricingPlan, PricingPlan]
  unlockNote: string
}

export const pricing: PricingContent = {
  id: "pricing",
  eyebrow: "Pricing",
  headline: "One app. One subscription. No tiers to read.",
  body: "Free keeps the loop — sessions, projects, habits. Pro unlocks on-device activity classification, Plan My Day, and the weekly review chart.",
  defaultCadence: "monthly",
  unlockNote:
    "Want to try Pro without subscribing? A 7-day Try Pro unlock is available from the Mac app — once, per account.",
  plans: [
    {
      id: "free",
      name: "Free",
      tagline: "The loop, forever.",
      price: {
        monthly: { amount: 0, unit: "forever", note: "Free forever" },
        yearly: { amount: 0, unit: "forever", note: "Free forever" },
      },
      features: [
        "Sessions, projects, habits, tasks",
        "Menu bar timer with breathing indicator",
        "Weekly review view",
        "Local-only data, no account needed",
      ],
      cta: { label: "Download for macOS", href: "/download" },
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "Everything, plus the thinking parts.",
      price: {
        monthly: { amount: 6, unit: "/mo" },
        yearly: {
          amount: 58,
          unit: "/yr",
          savings: "Save $14 vs monthly",
        },
      },
      features: [
        "On-device activity classification (on track / off track)",
        "Plan My Day assistant",
        "Weekly review chart and project breakdown",
        "Priority email support",
      ],
      cta: { label: "Get Pro", href: "/download" },
      featured: true,
    },
  ],
}
