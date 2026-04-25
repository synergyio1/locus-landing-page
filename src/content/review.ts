export type ReviewPanel = {
  caption: string
  screenshot: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export type ReviewContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  panels: [ReviewPanel]
}

export const review: ReviewContent = {
  id: "review",
  eyebrow: "Friday review",
  headline: "Close the week with the receipts in hand.",
  body: "Every Friday, Locus lays the week out flat — the sessions, the projects that moved, the days the chain held. An AI walks you through what the week was actually for: what worked, what slipped, what next week is about.",
  panels: [
    {
      caption: "The weekly view — ready to talk it through when Friday arrives.",
      screenshot: {
        src: "/screenshots/screens/ReviewView_weekly_dark.png",
        alt: "Locus weekly review — the week's sessions laid out with reflection prompts",
        width: 2880,
        height: 1800,
      },
    },
  ],
}
