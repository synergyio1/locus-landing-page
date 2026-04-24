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
  panels: [ReviewPanel, ReviewPanel]
}

export const review: ReviewContent = {
  id: "review",
  eyebrow: "Friday review",
  headline: "Close the week with the receipts in hand.",
  body: "Every Friday Locus lays the week out flat — the sessions that happened, the projects that moved, the days the chain held. A short reflection, the minutes of proof, and a clear picture of what next week is actually about.",
  panels: [
    {
      caption: "The weekly review, ready when Friday arrives.",
      screenshot: {
        src: "/screenshots/ReviewView_weekly_dark.png",
        alt: "Locus weekly review view with the week's sessions and reflection prompts",
        width: 2560,
        height: 1706,
      },
    },
    {
      caption: "Your hours, grouped by project and on-track share.",
      screenshot: {
        src: "/screenshots/ReviewChart_card_dark.png",
        alt: "Locus review chart card breaking the week's minutes down by project",
        width: 1896,
        height: 1296,
      },
    },
  ],
}
