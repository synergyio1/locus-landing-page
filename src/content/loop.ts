export type LoopVerb = {
  label: string
  icon: "plan" | "focus" | "track" | "review"
}

export type LoopContent = {
  id: string
  verbs: [LoopVerb, LoopVerb, LoopVerb, LoopVerb]
  sentence: string
  subline: string
}

export const loop: LoopContent = {
  id: "loop",
  verbs: [
    { label: "Plan", icon: "plan" },
    { label: "Focus", icon: "focus" },
    { label: "Track", icon: "track" },
    { label: "Review", icon: "review" },
  ],
  sentence: "Plan → Focus → Track → Review. Four verbs, one app, every day.",
  subline: "Execute on what's in your control. Great things follow.",
}
