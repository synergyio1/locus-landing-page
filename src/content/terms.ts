import type { LegalContent } from "./privacy"

export const terms: LegalContent = {
  title: "Terms of Service",
  intro:
    "These terms describe what you can expect when you use Locus — the macOS app and the website — and what we expect in return. By using the app or subscribing to Pro, you agree to these terms.",
  lastUpdated: "2026-04-23",
  draft: true,
  sections: [
    {
      heading: "Using Locus",
      body: "You're free to use Locus on any Mac you own or control, for personal or professional focus work. Don't attempt to reverse engineer the app, resell it, or bypass the Pro entitlement check. We ship updates through Sparkle — keeping the app up to date is strongly recommended.",
    },
    {
      heading: "Subscriptions and refunds",
      body: "Pro is billed monthly or yearly via our payment processor. Subscriptions renew automatically until cancelled from your account area. If you're unhappy with Pro within the first 14 days of a new subscription, email us and we'll issue a refund — no questions asked.",
    },
    {
      heading: "Termination",
      body: "You can cancel your Pro subscription at any time; access continues until the end of the paid period. We may suspend accounts that abuse the service or attempt to defraud the payment processor. If we ever shut Locus down, we'll give reasonable notice and honour any prepaid period.",
    },
    {
      heading: "Contact",
      body: "Questions about these terms, billing, or your account can be sent to support@getlocus.tech and we'll respond directly.",
    },
  ],
}
