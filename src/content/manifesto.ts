// The founder statement that replaces the old scroll narrative on the home
// page (2026-08-17; "struggle" section rewritten 2026-08-19; "tools" section
// expanded to four paragraphs 2026-08-30). Superlogical-
// style: one reading column, plain sentences, signed. Copy is Luis's — keep
// his phrasing ("the struggle never stops", "gigantic noise") even where it
// sits a notch outside "engineered calm". ("specially in current times" was
// his too, until he cut it himself later on 2026-08-19.)
//
// Inline emphasis: wrap a phrase in ==double equals== and the letter draws an
// ink underline under it (lib/inline-marks.ts → ui/ink-underline.tsx). Luis
// picks the marked lines — the exact set is pinned in manifesto.test.ts;
// never inside a pull-quote, never outside the letter body. (A rail-side
// "skim the underlines" note existed for a few hours on 2026-08-19; Luis
// cut it — the underlines speak for themselves.)
//
// The "Locus, in three parts" block (Execution · Inputs · AI) was cut on
// 2026-08-31 — the app showcase right under the letter shows the parts with
// real screens. The `parts` block kind stays in the type for the app's
// onboarding, which still quotes that copy (LocusUI/Onboarding/IntroPhaseView.swift).
//
// The six design decisions (and the design-ideas blog note) left the letter
// on 2026-09-02 (Luis: remove the six from the middle of the manifesto) for
// their own small section right under it — content/design-decisions.ts and
// sections/design-decisions.tsx. The letter now ends on the sign-off.

export type ManifestoPart = {
  name: string
  text: string
}

export type ManifestoBlock =
  | { kind: "p"; text: string; emphasis?: boolean }
  /** `id` is the anchor the left rail's mini-TOC jumps to — keep it stable. */
  | { kind: "h"; id: string; text: string }
  | { kind: "quote"; text: string; attribution: string }
  | { kind: "parts"; intro: string; items: ManifestoPart[] }

export type ManifestoContent = {
  id: string
  eyebrow: string
  headline: string
  /** Rotating tail phrases for the headline; the first is the resting state. */
  rotating: string[]
  /**
   * Small print under the sticky headline: what this is and what reading it
   * costs. The minute figure is pinned by a recount in manifesto.test.ts —
   * update it there and here together when the letter changes length.
   */
  letterNote: string
  blocks: ManifestoBlock[]
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
  // ~1,150 words across the letter column at ~220 wpm → 5 (the tools section
  // grew to four paragraphs on 2026-08-30; 1,210 words is where this rounds
  // to 6). Recount pinned in manifesto.test.ts, so a longer letter fails
  // loudly instead of lying.
  letterNote: "A letter from Luis · 4 min read",
  blocks: [
    {
      kind: "p",
      text: "Locus was born out of necessity: ==a system to help us deal with the fast, noisy, high-stress times we increasingly live in==.",
    },
    {
      kind: "p",
      text: "The starting point was an old idea from David Allen's Getting Things Done: you need one system you can trust with everything — every to-do, every objective, every thing you already did — ==so your mind can stop running the meta-strategy in the background and be present== in what is in front of you, as fully as possible.",
    },
    { kind: "h", id: "a-delicate-equilibrium", text: "A delicate equilibrium" },
    {
      kind: "p",
      text: "Runner friends of mine say it half as a joke, but it's true: the struggle never stops. The pace only gets faster.",
    },
    {
      kind: "p",
      text: "That's running. It's also life. If you're working at the level you're capable of, you are always in a fight.",
    },
    {
      kind: "p",
      text: "And the fight happens at two horizons that require different approaches. ==The days, to win them, you have to be present== — head down, in the work. A soldier. ==The years, to win them, you have to lift your head== — set the strategy, learn from each day, connect it to the ones before it, and continuously adapt the strategy if necessary. A general.",
    },
    {
      kind: "p",
      text: "You don't get to pick one role. You're both, at once, permanently — and neither one covers for the other. A bad plan loses no matter how well you follow it. A good plan loses to a day you never showed up for. Both have to be there, and both have to be great. To top it all, you have to be careful to understand, from the days, the patterns and the new information that really matter and would be important to adapt the strategy — and there is a lot of noise, and a lot of emotion.",
    },
    {
      kind: "p",
      text: "This dynamic rests on a delicate equilibrium, and is a tough ordeal to execute well.",
    },
    {
      kind: "p",
      text: "Every high achiever we've come across attacks this with the same two ingredients: ==personal discipline, and a great system in place.== Discipline is how hard you push on any given day. The system is how much friction you meet on all of them.",
    },
    {
      kind: "p",
      text: "Discipline is yours — nobody can supply it from the outside. The system, Locus, is our mission to build. We count on you for the first. You can count on us for the second.",
    },
    { kind: "h", id: "the-problem-with-todays-tools", text: "The problem with today's tools" },
    {
      kind: "p",
      text: "Most of the tools we rely on were built before AI — so they were never designed around what is now possible. That idea drove many of our decisions, and it is the difference between an AI-native app and AI features bolted onto a traditional one.",
    },
    {
      kind: "p",
      text: "Building software was also much slower then, so apps kept their ambitions small: one job each, done in isolation. A to-do list holds the intent and never sees the outcome. A calendar holds the plan and never learns what happened. A timer counts minutes without knowing what they were for.",
    },
    {
      kind: "p",
      text: "We believe a lot of insight, and a lot of improvement, slips through those cracks. And for the first time we have the tools to do something about it: to build a system robust enough to hold the whole day, and to take everything it gathers, process it, and hand back real insight. It is a fundamental paradigm change — in how our systems are built, and in how they run.",
    },
    {
      kind: "p",
      text: "We didn't find what we thought a great solution to this modern productivity problem would look like: one that really felt like a smart assistant, and that helped us win day after day. So we built one — though we are still at the beginning of the vision.",
    },
    { kind: "h", id: "two-ideas-behind-the-design", text: "Two ideas behind our solution" },
    {
      kind: "p",
      text: "Most of the decisions in Locus come down to two ideas.",
    },
    {
      kind: "p",
      emphasis: true,
      text: "The first is the idea of compounding, an effect that is at work all around us and all through our lives, and it basically states that far down the line, what you reach is not the linear day-by-day sum, but actually the exponential day-by-day multiplication. An idea that is easy to understand logically, but way harder to really absorb and implement.",
    },
    {
      kind: "p",
      emphasis: true,
      text: "And it doesn't care if we are attentive to it; it happens, as time does. One line that we think captures this well:",
    },
    {
      kind: "quote",
      text: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
      attribution: "Credited to Albert Einstein",
    },
    {
      kind: "p",
      emphasis: true,
      text: "==Small improvements, repeated, are the whole game.==",
    },
    {
      kind: "p",
      emphasis: true,
      text: "The second is what we hinted at in the last section, but James Clear put it best:",
    },
    {
      kind: "quote",
      text: "You do not rise to the level of your goals. You fall to the level of your systems.",
      attribution: "Atomic Habits",
    },
    {
      kind: "p",
      text: "Put together: the most useful thing we could create is a better system that helps people be on the earning side of the first idea — one that they can trust with everything, that learns from their plans and from the day they actually had, that helps them discern the important things.",
    },
    // "Locus, in three parts" (heading + the Execution · Inputs · AI block)
    // was cut on 2026-08-31 (Luis: the least important part; the app showcase
    // right under the letter now shows the parts with real screens). The
    // app's onboarding keeps its own copy of that copy (IntroPhaseView.swift).
    {
      kind: "p",
      text: "Locus will be there day after day, helping you see a little through the gigantic noise of real life, nudging you once in a while, helping you stay on track and, no matter what, keep compounding.",
    },
  ],
  signature: {
    closing: "We hope you enjoy it.",
    name: "Luis",
  },
}
