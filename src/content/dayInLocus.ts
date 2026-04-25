export type DayInLocusMonitor = {
  verdict: "on-track" | "off-track"
  window: string
  detail: string
}

export type DayInLocusStage = {
  id: "plan" | "focus" | "catch" | "close"
  time: string
  label: string
  title: string
  caption: string
  screenshot: {
    src: string
    alt: string
    width: number
    height: number
  }
  monitor?: DayInLocusMonitor
  placeholder?: boolean
}

export type DayInLocusContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  goalAnchor: string
  stages: [DayInLocusStage, DayInLocusStage, DayInLocusStage, DayInLocusStage]
}

export const dayInLocus: DayInLocusContent = {
  id: "day-in-locus",
  eyebrow: "A day in Locus",
  headline: "One goal. A whole day. You see it travel.",
  body: "Pick one thing that actually matters today. Locus plans the day around it, stays with you while you work, and catches the moment you drift. Here is one of those days.",
  goalAnchor: "Finish the Q2 strategy doc",
  stages: [
    {
      id: "plan",
      time: "Monday, 9:12 AM",
      label: "Morning plan",
      title: "Your day gets shape before it starts.",
      caption:
        "Locus asks what matters today, blocks time for it, and keeps the rest of your calendar honest. You start the morning with a plan you'd actually follow.",
      screenshot: {
        src: "/screenshots/screens/CommandView_planning_dark.png",
        alt: "Locus planning view — a morning plan with a focus block reserved for the Q2 strategy doc",
        width: 2880,
        height: 1800,
      },
    },
    {
      id: "focus",
      time: "10:45 AM",
      label: "In the work",
      title: "A session on the thing you actually care about.",
      caption:
        "The timer runs. The menu bar breathes. The goal from this morning is still visible — right next to the minutes you're spending on it.",
      screenshot: {
        src: "/screenshots/screens/CommandView_running_dark.png",
        alt: "Locus with a focus session actively running on the Q2 strategy doc",
        width: 2880,
        height: 1800,
      },
      monitor: {
        verdict: "on-track",
        window: "Pages — Q2 Strategy.pages",
        detail:
          "The active window matches the session's project. Locus stays quiet — the work is the work.",
      },
    },
    {
      id: "catch",
      time: "2:28 PM",
      label: "Drift caught",
      title: "Locus catches the drift before you do.",
      caption:
        "You flicked over to read one thing. Locus saw the active window, recognised it wasn't the work, and nudged you back — gently, once. No shaming.",
      screenshot: {
        src: "/screenshots/components/ActivityClassify_card_dark.png",
        alt: "Locus activity classification card flagging a Safari window as off-project",
        width: 1896,
        height: 1296,
      },
      placeholder: true,
      monitor: {
        verdict: "off-track",
        window: "Safari — X (formerly Twitter)",
        detail:
          "Locus checks the window title against the session goal. It doesn't read what you type, screenshot your screen, or read URLs.",
      },
    },
    {
      id: "close",
      time: "6:04 PM",
      label: "End of the day",
      title: "The day adds up — without you doing the math.",
      caption:
        "Sessions, minutes, the projects that moved. You close the laptop knowing exactly what the day was for, and what you'll start tomorrow with.",
      screenshot: {
        src: "/screenshots/components/DayTimeline_card_dark.png",
        alt: "Locus end-of-day timeline card showing how the day's minutes broke down across projects",
        width: 1896,
        height: 1296,
      },
      placeholder: true,
    },
  ],
}
