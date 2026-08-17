// The founder statement that replaces the old scroll narrative on the home
// page (2026-08-17). Superlogical-style: one reading column, plain sentences,
// signed. Copy is Luis's — keep his phrasing ("battle / war", "gigantic noise")
// even where it sits a notch outside "engineered calm".
//
// The three app parts mirror the app's own sidebar families
// (LocusUI/SidebarTab.swift: Execution · Inputs · AI) — keep them in lockstep.

export type ManifestoPart = {
  name: string
  text: string
}

export type ManifestoBlock =
  | { kind: "p"; text: string; emphasis?: boolean }
  | { kind: "h"; text: string }
  | { kind: "quote"; text: string; attribution: string }
  | { kind: "parts"; intro: string; items: ManifestoPart[] }

export type ManifestoDecision = {
  id: string
  title: string
  summary: string
}

export type ManifestoContent = {
  id: string
  eyebrow: string
  headline: string
  /** Rotating tail phrases for the headline; the first is the resting state. */
  rotating: string[]
  blocks: ManifestoBlock[]
  decisionsHeading: string
  decisionsIntro: string
  /** Exactly the core design decisions Luis wants named — six as of 2026-08-17. */
  decisions: ManifestoDecision[]
  blog: {
    text: string
    linkLabel: string
    /** Set once the design-ideas blog exists; until then the text renders plain. */
    href?: string
    /** Shown after the label only while `href` is unset. */
    pendingNote?: string
  }
  signature: {
    closing: string
    name: string
  }
}

export const manifesto: ManifestoContent = {
  id: "manifesto",
  eyebrow: "Manifesto",
  headline: "We are building a system you can trust with",
  // Keep every phrase within ~15 characters of the resting one: the headline
  // reserves the widest phrase's box, so a long outlier leaves a blank line
  // (or overflows the sticky column on tablets) whenever a short one shows.
  rotating: [
    "your whole day.",
    "your tasks.",
    "your projects.",
    "your goals.",
    "your plan.",
    "what happened.",
    "the rest of it.",
  ],
  blocks: [
    {
      kind: "p",
      text: "Locus was born out of necessity: a system to help us deal with the intense, super-fast, noisy, high-stress times we increasingly live in.",
    },
    {
      kind: "p",
      text: "The starting point was an old idea from David Allen's Getting Things Done: you need one system you can trust with everything — every to-do, every objective, every thing you already did — so your mind can stop running the meta-strategy in the background and be present in what is in front of you, as fully as possible.",
    },
    { kind: "h", text: "Every day is a battle" },
    {
      kind: "p",
      text: "And there is a paradox in it. To win the day, you have to be as present as possible — head down, in the work. To win the war — the months, the years, the decades — you have to learn as much as possible from each day and improve continuously. Doing one is hard enough.",
    },
    {
      kind: "p",
      text: "What made it harder, in our own days, was fragmentation. There is what you want to achieve: tasks, projects, goals. There is what you plan in order to get there. There is what you actually do. And there is the rest of the day.",
    },
    {
      kind: "p",
      text: "It is all one day, yet today's tools split it into separate apps. A to-do list holds the intent and never sees the outcome. A calendar holds the plan and never learns what happened. A timer counts minutes without knowing what they were for. Nothing holds all of it at once — so nothing can learn from it.",
    },
    {
      kind: "p",
      text: "We did not think there was a good way, or a good app, that used all of this rich context to help us win the day and, day after day, the war. So we built one.",
    },
    { kind: "h", text: "Two ideas behind the design" },
    {
      kind: "p",
      text: "Most of the decisions in Locus come down to two ideas.",
    },
    {
      kind: "p",
      emphasis: true,
      text: "The first is a remarkable effect, at work all around us and all through our lives. A line credited to a famous physics genius captures it best:",
    },
    {
      kind: "quote",
      text: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
      attribution: "Credited to Albert Einstein (unconfirmed)",
    },
    {
      kind: "p",
      emphasis: true,
      text: "Small improvements, repeated, are the whole game.",
    },
    {
      kind: "p",
      emphasis: true,
      text: "The second comes from James Clear:",
    },
    {
      kind: "quote",
      text: "You do not rise to the level of your goals. You fall to the level of your systems.",
      attribution: "Atomic Habits",
    },
    {
      kind: "p",
      emphasis: true,
      text: "For anything that matters, the system decides — not the ambition.",
    },
    {
      kind: "p",
      text: "Put together: the most useful thing we could give you is not a better goal. It is a better system — one you can trust with the whole day, that learns from the day you actually had, and that compounds.",
    },
    { kind: "h", text: "What we're building" },
    {
      kind: "parts",
      intro:
        "Locus is that system: carefully, thoughtfully designed for the productivity side of your life. It lives on your Mac and runs on the AI you already pay for. The app has three parts:",
      items: [
        {
          name: "Execution",
          text: "The live loop: Focus, to plan and steer the day; Watch, to keep the dots connected the rest of the time.",
        },
        {
          name: "Inputs",
          text: "Structured capture: notes, tasks, and commitments — the projects you want to finish and the habits you want to keep.",
        },
        {
          name: "AI",
          text: "What Locus does on its own: Intelligence, routines you can read and edit; Memory, what it knows about you; and the Flywheel, which compounds today into tomorrow.",
        },
      ],
    },
    {
      kind: "p",
      text: "Locus will be there day after day, helping you see a little through the gigantic noise of real life, nudging one tiny change once in a while, and letting the changes compound. If the result is not life-changing, it will at least be much better. That is the bet.",
    },
  ],
  decisionsHeading: "How we made it",
  decisionsIntro: "Six decisions carry most of the weight:",
  decisions: [
    {
      id: "local-first",
      title: "Your day lives on your Mac.",
      summary:
        "Local-first and private by design: your data stays on your device.",
    },
    {
      id: "byo-ai",
      title: "Bring your own AI.",
      summary:
        "Plug in a great harness — Claude Code or Codex — as the brain. Locus is the armor around it: sensors, tools, and UI.",
    },
    {
      id: "choose-your-model",
      title: "Choose your model.",
      summary:
        "Use the subscription you already pay for, an API key from a provider like OpenRouter, or Locus Remote — and pick the model you want.",
    },
    {
      id: "day-feedback-loop",
      title: "The day feedback loop.",
      summary:
        "Observe, interpret, structure, work, adapt — firmly when a pattern is real, gently when the day was just noise.",
    },
    {
      id: "routines-are-files",
      title: "Routines are files.",
      summary:
        "Every AI behavior is a Markdown file you can open, read, and edit.",
    },
    {
      id: "memory-you-can-correct",
      title: "Memory you can correct.",
      summary:
        "What Locus knows about you lives in a wiki on your Mac. If it gets something wrong, you change it.",
    },
  ],
  blog: {
    text: "For the reasoning behind each of these, be sure to check our",
    linkLabel: "design ideas blog",
    // href: "/blog", — set once the blog exists; the pending note drops out by itself.
    pendingNote: "(coming soon)",
  },
  signature: {
    closing: "We hope you enjoy it.",
    name: "Luis",
  },
}
