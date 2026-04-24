export type AiExampleState = "on-track" | "unknown" | "off-track"

export type AiExample = {
  state: AiExampleState
  label: string
  example: string
  description: string
}

export type AiContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  examples: [AiExample, AiExample, AiExample]
  screenshot: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export const ai: AiContent = {
  id: "ai",
  eyebrow: "Activity AI",
  headline: "Locus reads the window title. You get the verdict.",
  body: "During a session Locus classifies your frontmost window against the project you're on — on track, off track, or genuinely unclear. You can override any call, and it learns from the override.",
  examples: [
    {
      state: "on-track",
      label: "On track",
      example: "Chrome on a pull request",
      description:
        "The tab title matches this session's project, so the minute counts toward focus.",
    },
    {
      state: "unknown",
      label: "Unknown",
      example: "unclassified window title",
      description:
        "Locus isn't sure, so it asks instead of guessing. Label it once and it remembers.",
    },
    {
      state: "off-track",
      label: "Off track",
      example: "Chrome on Twitter",
      description:
        "The title is plainly unrelated. Locus records the drift so you see it in Friday review.",
    },
  ],
  screenshot: {
    src: "/screenshots/components/ActivityClassify_card_dark.png",
    alt: "Locus activity classification card showing on-track, unknown, and off-track pills",
    width: 1776,
    height: 876,
  },
}
