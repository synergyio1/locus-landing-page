// The founder statement that replaces the old scroll narrative on the home
// page (2026-08-17). Superlogical-style: one reading column, plain sentences,
// signed. Copy is Luis's — keep his phrasing ("battle / war", "gigantic noise")
// even where it sits a notch outside "engineered calm".
//
// Inline emphasis: wrap a phrase in ==double equals== and the letter draws an
// ink underline under it (lib/inline-marks.ts → ui/ink-underline.tsx). Reserve
// it for the letter's thesis lines — a couple in the whole piece, never inside
// a pull-quote — or the emphasis stops meaning anything.
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
  /**
   * Exactly the core design decisions Luis wants named — five as of 2026-08-17,
   * reframed the same day around build / borrow / leave-open. The day feedback
   * loop was cut from this list on purpose, and "Bring your own AI" was folded
   * into "Choose your model" (they were redundant); don't re-add either.
   * Every summary must fit two lines in the letter column at >=1280w (~165
   * chars max, verified in-browser) — Luis's cap.
   */
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
      text: "Locus was born out of necessity: ==a system to help us deal with the fast, noisy, high-stress times we increasingly live in==.",
    },
    {
      kind: "p",
      text: "The starting point was an old idea from David Allen's Getting Things Done: you need one system you can trust with everything — every to-do, every objective, every thing you already did — ==so your mind can stop running the meta-strategy in the background and be present== in what is in front of you, as fully as possible.",
    },
    { kind: "h", text: "Every day is a battle" },
    {
      kind: "p",
      text: "And there is a paradox in it. To win the day, you have to be as present as possible — head down, in the work. To win the war — the months, the years, the decades — you have to learn as much as possible from each day and improve continuously. Doing one is hard enough.",
    },
    {
      kind: "p",
      text: "What makes it harder still is that the bridge between the two has to be built in the middle of the daily battleground — from your goals for the months and years ahead to how you are actually performing. There is what you want to achieve: tasks, projects, goals. There is what you plan in order to get there. There is what you actually do.",
    },
    {
      kind: "p",
      text: "It is all one day, yet today's tools split it into separate apps. A to-do list holds the intent and never sees the outcome. A calendar holds the plan and never learns what happened. A timer counts minutes without knowing what they were for. Nothing holds all of it at once — so nothing can learn from it.",
    },
    {
      kind: "p",
      text: "We never found what we thought a great solution would look like: one that used all of this rich context to help us win the day and, day after day, the war. So we built one.",
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
      attribution: "Credited to Albert Einstein",
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
        "Locus is that system, designed for the productivity side of your life. It lives on your Mac and has three parts:",
      // Each item opens with a "Your ___." lead and stays within ~120–150
      // characters of the others, so the three read as one balanced set.
      items: [
        {
          name: "Execution",
          text: "Your time. What you planned to do with the day and what actually happened — intent and outcome, finally in the same place.",
        },
        {
          name: "Inputs",
          text: "Your context. Notes, tasks, projects, habits — everything you mean to do, achieve, or simply keep, structured so the rest of Locus can use it.",
        },
        {
          name: "AI",
          text: "Your smart pal. Routines, the behaviors you want it to have; Memory, everything it learns about you. Together, a flywheel that compounds today into tomorrow.",
        },
      ],
    },
    {
      kind: "p",
      text: "Locus will be there day after day, helping you see a little through the gigantic noise of real life, nudging one tiny change once in a while, and letting the changes compound. If the result is not life-changing, it will at least be much better. That is the bet.",
    },
  ],
  decisionsHeading: "How we made it",
  decisionsIntro:
    "Early on we split the system in three: the parts we should build ourselves, the parts we should borrow, and the parts we should leave open for the community to evolve. Most of what follows comes from that split:",
  decisions: [
    {
      id: "build-the-armor",
      title: "We build the armor, not the brain.",
      summary:
        "Rather than rebuild an agentic core, we lean on the state-of-the-art harnesses and put our craft where we truly add value: the sensors, tools, and UI around them.",
    },
    {
      id: "choose-your-model",
      title: "Choose your model.",
      summary:
        "Your Claude Code or Codex subscription, an API key (say, OpenRouter), or Locus Remote — your choice. Pick the model you prefer, and swap it anytime.",
    },
    {
      id: "routines-are-files",
      title: "Routines are files.",
      summary:
        "Different personalities want different approaches. So we left this part deliberately open: every AI behavior is a Markdown file — read, edit, share, or add your own.",
    },
    {
      id: "gets-to-know-you",
      title: "It gets to know you.",
      summary:
        "The more you use it, the better it adapts — your patterns, your rhythms, what actually works. That picture is a wiki on your Mac; if it's wrong, you fix it.",
    },
    {
      id: "local-first",
      title: "Your day lives on your Mac.",
      summary:
        "Local-first and private by design: your data, your routines, and everything Locus knows about you stay on your device. You only log in for the subscription.",
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
