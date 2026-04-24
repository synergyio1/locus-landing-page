export type FaqId =
  | "who-for"
  | "how-different"
  | "keystrokes"
  | "missed-session"
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
      id: "who-for",
      question: "Who is Locus actually for?",
      answer:
        "People whose calendar is full but whose week doesn't always move — founders, researchers, writers, engineers, anyone with long-running goals that keep getting crowded out by the urgent stuff. If you set ambitious targets and then lose the plot mid-week, Locus is trying to be your accountability partner, not your surveillance camera.",
    },
    {
      id: "how-different",
      question: "How is this different from the trackers and timers I've already tried?",
      answer:
        "Most tools do one thing. Locus ties three together — a planner that picks the day's work, a monitor that catches you drifting, and a Friday review that tells you what actually moved — all anchored to a single goal you can see across the whole day. The point isn't the timer; it's closing the gap between what you said you'd do and what you did.",
    },
    {
      id: "keystrokes",
      question: "Does the AI monitor see what I type or which websites I visit?",
      answer:
        "No. Locus looks at the title of the frontmost window and classifies it as on-project or off-project on-device — nothing else. It doesn't read keystrokes, doesn't screenshot your screen, doesn't send window titles or URLs anywhere.",
    },
    {
      id: "missed-session",
      question: "What happens if I miss a session, or lose a whole day?",
      answer:
        "Nothing bad. Sessions that don't start just aren't counted, and days you skip don't break anything — the weekly review tells the truth about what happened without a scold. The habit calendar tracks the chain, but chains are meant to break sometimes; Locus doesn't shame you for it.",
    },
    {
      id: "privacy",
      question: "Does Locus send my activity to the cloud?",
      answer:
        "No. Activity classification runs on-device — window titles never leave your Mac. The only things that sync to your account are your subscription status and, for Pro, the settings you'd want on a second Mac.",
    },
    {
      id: "mac-only",
      question: "Is there a Windows, Linux, or mobile app?",
      answer:
        "Not today. Locus is a native macOS app and depends on macOS APIs for window activity and the menu bar. An iOS companion is on the roadmap; Windows and Linux aren't planned.",
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
        "If Pro isn't for you, email support@getlocus.tech within 30 days of purchase and we'll refund the subscription, no questions asked. The 7-day Try Pro unlock lets you evaluate Pro features inside the app before you pay anything.",
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
        "Yes. All timing, classification and review happen on-device. An internet connection is only required the first time you sign in with a Pro account, and when your subscription renews.",
    },
    {
      id: "sign-in",
      question: "How do I sign in on my Mac?",
      answer:
        "Open Locus → Settings → Account and choose \"Sign in\". A browser tab opens, you authenticate with your email, and the Mac app picks up the session automatically. No password to type into the app.",
    },
  ],
}
