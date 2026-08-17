export type LegalSection = {
  heading: string
  body: string
}

export type LegalContent = {
  title: string
  intro: string
  lastUpdated: string
  draft: boolean
  sections: LegalSection[]
}

export const privacy: LegalContent = {
  title: "Privacy Policy",
  intro:
    "Locus is local-first: your data lives on your Mac, and your account exists to hold your license — not your data. This page explains what information the app or this website handles, how it's used, and the rights you have over it.",
  lastUpdated: "2026-07-06",
  draft: true,
  sections: [
    {
      heading: "What we collect",
      body: "The app stores your sessions, projects, habits, tasks, notes, chat history, and the AI's memory of you as a database and plain files on your Mac. Our servers hold your account email, license state, and billing status; our payment processor handles card details — we never see or store them. The website may log basic request metadata (IP, user agent, referrer) for security and analytics.",
    },
    {
      heading: "How we use it",
      body: "Local data stays on your device and is used to render your own views and to feed the AI you chose. If you bring your own AI, prompts go directly to your provider under your account and keys — we're not in the path. If you use Locus managed AI, prompts pass through our relay, which does not store prompt or response content; it records only aggregate usage totals for billing. We don't train on your data.",
    },
    {
      heading: "Your rights",
      body: "Your data is already in your hands — Locus can reveal its data folder in Finder, and deleting that folder removes everything. Even if your subscription lapses, your data stays viewable and exportable on your Mac. You can ask us to export or delete the account information associated with your email at any time, and we will respond within a reasonable window.",
    },
    {
      heading: "Contact",
      body: "Questions about this policy or your data can be sent to support@getlocus.tech and we'll get back to you directly.",
    },
  ],
}
