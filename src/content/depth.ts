export type DepthTile = {
  label: string
  caption: string
  rotation: "left" | "right" | "none"
  screenshot: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export type DepthContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  tiles: [DepthTile, DepthTile, DepthTile]
}

export const depth: DepthContent = {
  id: "depth",
  eyebrow: "The long arc",
  headline: "Not just a timer.",
  body: "A session rolls into a project. A project earns its minutes week after week. Habits keep returning. Tasks stop drifting off the edge of a sticky note. The same app that started your morning carries the shape of your year.",
  tiles: [
    {
      label: "Projects",
      caption: "Every session adds up to a project, with its own trend over weeks.",
      rotation: "left",
      screenshot: {
        src: "/screenshots/screens/ProjectDetail_dark.png",
        alt: "Locus project detail view showing sessions logged against a single project",
        width: 2880,
        height: 1800,
      },
    },
    {
      label: "Habits",
      caption: "A calendar that rewards the chain, not the hours.",
      rotation: "right",
      screenshot: {
        src: "/screenshots/screens/HabitDetail_dark.png",
        alt: "Locus habit detail view with a daily streak calendar",
        width: 2880,
        height: 1800,
      },
    },
    {
      label: "Tasks",
      caption: "A to-do list that survives past the session timer — so nothing important falls through.",
      rotation: "left",
      screenshot: {
        src: "/screenshots/screens/TasksView_list_dark.png",
        alt: "Locus tasks list grouped by project",
        width: 2880,
        height: 1800,
      },
    },
  ],
}
