export type FaqId =
  | "privacy"
  | "mac-only"
  | "macos-requirement"
  | "refund"
  | "data-export"
  | "offline"
  | "sign-in"

export type FaqItem = {
  id: FaqId
  question: string
  answer: string
}

export type FaqContent = {
  id: string
  eyebrow: string
  headline: string
  items: FaqItem[]
}

export const faq: FaqContent = {
  id: "faq",
  eyebrow: "Questions",
  headline: "The honest answers.",
  items: [
    {
      id: "privacy",
      question: "Does Locus send my activity to the cloud?",
      answer:
        "No. Activity classification runs on-device — window titles never leave your Mac. The only things we sync to your account are your subscription status and, for Pro accounts, the settings you'd want on a second Mac.",
    },
    {
      id: "mac-only",
      question: "Is there a Windows, Linux, or mobile app?",
      answer:
        "Not today. Locus is a native macOS app and the app model depends on macOS APIs for window activity and the menu bar. A companion iOS app is on the roadmap, but there are no Windows or Linux plans.",
    },
    {
      id: "macos-requirement",
      question: "Which macOS versions are supported?",
      answer:
        "Locus requires macOS 14 Sonoma or later. It runs natively on both Apple Silicon and Intel Macs that can install Sonoma.",
    },
    {
      id: "refund",
      question: "What's the refund policy?",
      answer:
        "If Pro isn't for you, email support@getlocus.tech within 30 days of purchase and we'll refund the subscription, no questions asked. The 7-day Try Pro unlock lets you evaluate Pro features in the app before you pay anything.",
    },
    {
      id: "data-export",
      question: "Can I export my sessions and projects?",
      answer:
        "Yes. Settings → Data lets you export your sessions, projects, habits and tasks as JSON or CSV at any time. The same menu includes a full-delete option that wipes local and synced data.",
    },
    {
      id: "offline",
      question: "Does Locus work offline?",
      answer:
        "Yes. All timing, classification and review happen on-device. An internet connection is only required the first time you sign in with a Pro account and when your subscription renews.",
    },
    {
      id: "sign-in",
      question: "How do I sign in on my Mac?",
      answer:
        "Open Locus → Settings → Account and choose \"Sign in\". A browser tab opens, you authenticate with your email, and the Mac app picks up the session automatically. No password to type into the app.",
    },
  ],
}
