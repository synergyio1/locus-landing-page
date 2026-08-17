export type FaqId =
  | "who-for"
  | "how-different"
  | "which-ai"
  | "routines"
  | "memory"
  | "keystrokes"
  | "privacy"
  | "missed-session"
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
        "Anyone who relies heavily on personal productivity and works on a Mac. Founders, researchers, writers, engineers — anyone whose calendar is full but whose week doesn't always move. If you set ambitious goals and then lose the plot mid-week, Locus is built to be your accountability partner, not your surveillance camera.",
    },
    {
      id: "how-different",
      question: "How is this different from the trackers and timers I've already tried?",
      answer:
        "Most tools do one thing: timers measure, trackers report, planners schedule. Locus runs the whole loop — it watches how the day actually goes, coaches you through focused sessions, and turns what it learns into tomorrow's structure. And unlike the chatbot bolted onto other tools, this AI remembers you: it keeps a memory you can read, follows routines you can edit, and anything it does on its own can be undone.",
    },
    {
      id: "which-ai",
      question: "Which AI does Locus run on?",
      answer:
        "Yours, if you have one. Plug in the AI subscription you already pay for — Claude Code, Codex, or a compatible API key — and Locus drives it at no extra cost. Prefer zero setup? Add Locus managed AI for $8 a month in credits on frontier models. Same features either way; the only difference is whose AI does the thinking.",
    },
    {
      id: "routines",
      question: "What can the AI do on its own?",
      answer:
        "Exactly as much as you let it. Every behavior — the daily digest, the distraction coach, the notes analysis — is a routine: a plain file you can read, edit, or write yourself. You set the autonomy level, Locus only auto-runs actions that can be cleanly undone, and everything it did shows up with a one-click Undo.",
    },
    {
      id: "memory",
      question: "What does Locus remember about me?",
      answer:
        "Whatever it learns from working with you — your patterns, your projects, the insights you pushed back on — written to a wiki of plain files on your Mac. The Memory tab shows all of it, and it's yours to edit: correct something and the correction sticks. It's stored on your machine, not on our servers.",
    },
    {
      id: "keystrokes",
      question: "Does the AI read what I type or which sites I visit?",
      answer:
        "No. During a session, Locus checks the frontmost app and window title against what you said you were working on — nothing else. It doesn't read what you type, screenshot your screen, or read URLs. And what it sees is for you alone — never a boss, never a dashboard.",
    },
    {
      id: "privacy",
      question: "Where does my data live, and what does the AI see?",
      answer:
        "Your data lives on your Mac. Sessions, projects, habits, tasks, notes, chat history, and the AI's memory of you are a database and plain files on your machine — your account exists to hold your license, not your data. When the AI works, prompts go to the provider you chose: bring your own and they run under your account and your keys. Choose Locus managed AI and they pass through our relay, which doesn't store prompts or responses — only usage totals for billing.",
    },
    {
      id: "missed-session",
      question: "What happens if I miss a session, or lose a whole day?",
      answer:
        "Nothing bad. Sessions that don't start just aren't counted, and a skipped day doesn't break anything — habits in Locus return on a rhythm instead of piling up debt, and the weekly review tells the truth about what happened without a scold.",
    },
    {
      id: "mac-only",
      question: "Is there a Windows, Linux, or mobile app?",
      answer:
        "Not today. Locus is a native macOS app and depends on macOS APIs for window activity and the menu bar. Windows and Linux aren't planned.",
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
        "If Locus isn't for you, email support@getlocus.tech within 30 days of purchase and we'll refund the subscription, no questions asked. And the 14-day trial lets you evaluate everything inside the app before you pay anything.",
    },
    {
      id: "data-export",
      question: "Can I export my data?",
      answer:
        "It's already yours — Locus keeps your data as a database plus readable files sitting on your Mac, and it can reveal the folder in Finder whenever you ask. Even if your subscription lapses, everything stays viewable and exportable. Deleting the app's data folder removes it completely.",
    },
    {
      id: "offline",
      question: "Does Locus work offline?",
      answer:
        "The workspace — sessions, tasks, commitments, notes — works offline. The AI features need a connection to whichever AI you picked, your own or Locus managed. Day planning has a built-in offline fallback, so the morning still gets a draft.",
    },
    {
      id: "sign-in",
      question: "How do I sign in on my Mac?",
      answer:
        "Open Locus → Settings → Account and choose \"Sign in\". A browser tab opens, you authenticate with your email, and the Mac app picks up the session automatically. No password to type into the app.",
    },
  ],
}
