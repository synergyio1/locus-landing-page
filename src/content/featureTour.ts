export type FeatureTourTabId = "plan" | "run" | "review"

export type FeatureTourTab = {
  id: FeatureTourTabId
  step: string
  label: string
  description: string
  screenshot: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export type FeatureTourContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  tabs: [FeatureTourTab, FeatureTourTab, FeatureTourTab]
}

export const featureTour: FeatureTourContent = {
  id: "tour",
  eyebrow: "A closer look",
  headline: "Three views. One loop.",
  body: "Locus is a single app with three moments. Pick a moment to see it in the product.",
  tabs: [
    {
      id: "plan",
      step: "01",
      label: "Plan the day",
      description:
        "Pull tasks from the catalog, size the session, and commit to the next block of work.",
      screenshot: {
        src: "/screenshots/screens/CommandView_planning_dark.png",
        alt: "Locus Command view with morning planning in progress",
        width: 2880,
        height: 1800,
      },
    },
    {
      id: "run",
      step: "02",
      label: "Run the session",
      description:
        "A live timer, the classifier watching the frontmost window, and today's agenda on the right.",
      screenshot: {
        src: "/screenshots/screens/CommandView_running_dark.png",
        alt: "Locus Command view with a focus session running",
        width: 2880,
        height: 1800,
      },
    },
    {
      id: "review",
      step: "03",
      label: "Review the week",
      description:
        "On Friday, see where the hours actually went — by project, by session, by drift.",
      screenshot: {
        src: "/screenshots/screens/ReviewView_weekly_dark.png",
        alt: "Locus Review view showing the weekly breakdown",
        width: 2880,
        height: 1800,
      },
    },
  ],
}
