export type DailyRunPanel = {
  caption: string
  screenshot: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export type DailyRunContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  panels: [DailyRunPanel, DailyRunPanel]
}

export const dailyRun: DailyRunContent = {
  id: "daily-run",
  eyebrow: "Daily run",
  headline: "Plan the day. Never leave the app.",
  body: "Mornings happen in the Command view — carve tomorrow into sessions before the day carves you. Then Locus collapses to the menu bar: a breathing dot, the current session, one-click stop. You never lose the thread.",
  panels: [
    {
      caption: "Morning plan in the Command view.",
      screenshot: {
        src: "/screenshots/CommandView_planning_dark.png",
        alt: "Locus Command view laying out the morning's sessions and projects",
        width: 2560,
        height: 1706,
      },
    },
    {
      caption: "Menu bar widget while the session runs.",
      screenshot: {
        src: "/screenshots/MenuBarWidget_running_dark.png",
        alt: "Locus menu bar widget showing a live session, project and remaining time",
        width: 1896,
        height: 1314,
      },
    },
  ],
}
