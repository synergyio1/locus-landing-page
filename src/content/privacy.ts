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
    "Locus is designed to keep your focus data on your Mac. This page explains what information the app or this website collects, how it's used, and the rights you have over it.",
  lastUpdated: "2026-04-23",
  draft: true,
  sections: [
    {
      heading: "What we collect",
      body: "Locus stores your sessions, projects, habits and tasks locally on your Mac. The website may log basic request metadata (IP, user agent, referrer) for security and analytics. If you subscribe to Pro, our payment processor handles your card details — we never see or store them.",
    },
    {
      heading: "How we use it",
      body: "Local focus data stays on your device and is used only to render your own views inside the app. Request metadata from the website is used to keep the service online and to understand which pages people read. Subscription data is used to manage your account and send receipts.",
    },
    {
      heading: "Your rights",
      body: "You can delete your local data at any time by removing the app. If you hold a Pro subscription, you can ask us to export or delete any account information associated with your email. We will respond within a reasonable window.",
    },
    {
      heading: "Contact",
      body: "Questions about this policy or your data can be sent to support@getlocus.tech and we'll get back to you directly.",
    },
  ],
}
