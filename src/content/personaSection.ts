/**
 * PersonaSection content — typed source of truth for the single-persona
 * "Locus in your work" section. We dropped the persona-tab carousel: one
 * relatable persona (Sara) shown across the main app screens reads cleaner
 * than four siloed mini-portfolios. The screenshots are the real running
 * app rendered against Sara's seeded SwiftData store via
 * `MarketingSnapshotTests`, not mockups.
 */

export type PersonaScreenshot = {
  src: string
  alt: string
  width: number
  height: number
}

export type PersonaScreen = {
  /** Stable slug for `id` / anchor links. */
  id: string
  /** Short tag like "Execution", "Tasks", "Commitments", "Review". */
  tag: string
  /** Section headline — 2-6 words, sentence case. */
  headline: string
  /** Caption: 1-2 sentences explaining what Sara's doing in this view. */
  body: string
  screenshot: PersonaScreenshot
}

export type PersonaSectionContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  /** The single persona this section is about. */
  persona: {
    initials: string
    name: string
    role: string
    blurb: string
    tools: string[]
  }
  /** One screen per major surface — order is the tour order down the page. */
  screens: PersonaScreen[]
}

export const personaSection: PersonaSectionContent = {
  id: "personas",
  eyebrow: "A week in Sara's Locus",
  headline: "Same product, your shape of day.",
  body: "Sara is a senior PM at a Series B SaaS. She's learning Spanish, running four mornings a week, and running a billing-v2 launch. The screens below are the real app rendered against her seeded data — no mockups.",
  persona: {
    initials: "SM",
    name: "Sara Mendes",
    role: "Senior Product Manager",
    blurb:
      "A senior product manager at a Series B SaaS. Reaching B2 Spanish by year-end, four-morning-a-week runner, leading a metered-billing launch on a tight ship-by date. Linear, Notion, Figma, Anki.",
    tools: ["Linear", "Notion", "Figma", "Anki"],
  },
  screens: [
    {
      id: "execution",
      tag: "Execution",
      headline: "Run the session, see the room.",
      body: "Sara's 25-minute Spanish block is live. The timer is honest about where she is; the right column shows the rest of her day; the activity ledger reads Anki, Notion, Duolingo — each classified the moment a window opens.",
      screenshot: {
        src: "/screenshots/screens/CommandView_running_dark.png",
        alt: "Locus running a focus session on Sara's 'Reach B2 Spanish' project. Activity ledger shows Anki, Slack, and Duolingo windows with classification dots; the right column shows Sara's planned day from morning run to activation deep-dive.",
        width: 2880,
        height: 1800,
      },
    },
    {
      id: "tasks",
      tag: "Tasks",
      headline: "The shortlist that survives the day.",
      body: "Small actions Sara can clear, schedule, or attach to bigger work. Each task knows the project or habit it serves and when it's due — overdue, today, tomorrow, this week.",
      screenshot: {
        src: "/screenshots/screens/TasksView_list_dark.png",
        alt: "Sara's task list: reply to engineering re: billing v2 invoicing edge cases, Spanish subjunctive drill, trim Q3 OKRs, synthesize customer-interview clips, draft launch-day comms, book physio.",
        width: 2880,
        height: 1800,
      },
    },
    {
      id: "commitments",
      tag: "Commitments",
      headline: "Outcomes to finish. Habits to keep.",
      body: "Outcome projects with finish lines (the billing launch, Q3 OKRs, the activation deep-dive, year-end Spanish) and rhythm habits that return on cadence (daily Spanish, morning runs). One inventory; no fighting about which list a thing belongs in.",
      screenshot: {
        src: "/screenshots/screens/CommitmentsView_dark.png",
        alt: "Sara's commitments grid: four outcome projects with progress strips and focus-day dots, plus rhythm habits with weekly schedule strips.",
        width: 2880,
        height: 1800,
      },
    },
    {
      id: "review",
      tag: "Review",
      headline: "What happened, what to change.",
      body: "End-of-week patterns. The hero insight names where Sara actually spent her focus, the strip surfaces focus time and plan adherence, and the project breakdown shows where the hours landed.",
      screenshot: {
        src: "/screenshots/screens/ReviewView_weekly_dark.png",
        alt: "Sara's weekly review: 'Reach B2 Spanish dominated this period with 3h' hero insight, focus-time and plan-adherence cards, focus trend chart across the week, and project breakdown showing Spanish, Billing v2 launch, and Q3 OKRs.",
        width: 2880,
        height: 1800,
      },
    },
  ],
}
