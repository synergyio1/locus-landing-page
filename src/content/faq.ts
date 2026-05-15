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
        "Anyone who relies heavily on personal productivity and works on a Mac. Founders, researchers, writers, engineers — anyone whose calendar is full but whose week doesn't always move. If you set ambitious goals and then lose the plot mid-week, Locus is trying to be your accountability partner, not your surveillance camera.",
    },
    {
      id: "how-different",
      question: "How is this different from the trackers and timers I've already tried?",
      answer:
        "Most tools do one thing. Locus is the execution layer — an AI plans the day around your goal, catches you when you drift, and on Friday walks you through what actually moved. Three things tied together, all anchored to a single goal you can see across the whole day. The point isn't the timer; it's closing the gap between what you said you'd do and what you did.",
    },
    {
      id: "keystrokes",
      question: "Does the AI read what I type or which sites I visit?",
      answer:
        "No. Locus checks the title of the frontmost window against your session's goal — nothing else. It doesn't read what you type, screenshot your screen, or read URLs. The next answer covers what happens to those window titles themselves.",
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
        "Yes — and we want to be specific about what and why. Window titles, project names and session metadata go through Locus's backend to leading AI models, where they're used to plan your day, classify whether you're on-track, and write your Friday review. We don't store logs, we don't train on the data, and it isn't tied to your account when it's sent. If you'd rather not share any of that, the free Loop tier (sessions, projects, habits, tasks) doesn't need it.",
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
        "Locus requires macOS Tahoe for now. Support for older macOS versions will come later.",
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
        "Mostly. The free Loop — sessions, projects, habits, tasks — works fully offline. The Pro AI features (Plan My Day, drift catch, Friday review) need a connection because they call leading AI models through Locus's backend.",
    },
    {
      id: "sign-in",
      question: "How do I sign in on my Mac?",
      answer:
        "Open Locus → Settings → Account and choose \"Sign in\". A browser tab opens, you authenticate with your email, and the Mac app picks up the session automatically. No password to type into the app.",
    },
  ],
}
