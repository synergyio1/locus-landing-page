import type { LegalContent } from "./privacy"

export const terms: LegalContent = {
  title: "Terms of Service",
  intro:
    "These terms describe what you can expect when you use Locus — the macOS app and the website — and what we expect in return. By using the app or buying a subscription, you agree to these terms.",
  lastUpdated: "2026-08-17",
  draft: true,
  sections: [
    {
      heading: "Using Locus",
      body: "You're free to use Locus on any Mac you own or control, for personal or professional work. Don't attempt to reverse engineer the app, resell it, or bypass the license check. We ship updates through Sparkle — keeping the app up to date is strongly recommended.",
    },
    {
      heading: "Subscriptions and refunds",
      body: "Locus is one plan, billed monthly or yearly via our payment processor. Remote credits for Locus Remote are optional, prepaid, bought separately in any amount, and are never part of the subscription or the trial. Subscriptions renew automatically until cancelled from your account area. If Locus isn't for you within the first 30 days of a new subscription, email us and we'll issue a refund — no questions asked.",
    },
    {
      heading: "Termination",
      body: "You can cancel your subscription at any time; access continues until the end of the paid period, and your data stays on your Mac either way. We may suspend accounts that abuse the service or attempt to defraud the payment processor. If we ever shut Locus down, we'll give reasonable notice and honour any prepaid period.",
    },
    {
      heading: "Contact",
      body: "Questions about these terms, billing, or your account can be sent to support@getlocus.tech and we'll respond directly.",
    },
  ],
}
