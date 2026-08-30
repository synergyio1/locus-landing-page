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
// The three app parts mirror the app's own sidebar families
// (LocusUI/SidebarTab.swift: Execution · Inputs · AI) — keep them in lockstep.
// The app's onboarding intro quotes each part verbatim as its three screens
// (LocusUI/Onboarding/IntroPhaseView.swift → IntroPillar.headline = the
// "Your ___." lead, .subhead = the rest; pinned by IntroPhaseNavigationTests)
// — edit here and there together.

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
  /**
   * Small print under the sticky headline: what this is and what reading it
   * costs. The minute figure is pinned by a recount in manifesto.test.ts —
   * update it there and here together when the letter changes length.
   */
  letterNote: string
  blocks: ManifestoBlock[]
  /** Anchor for the decisions heading — the mini-TOC's last stop. */
  decisionsId: string
  decisionsHeading: string
  decisionsIntro: string
  /**
   * Exactly the core design decisions Luis wants named — five as of 2026-08-17,
   * reframed the same day around build / borrow / leave-open; six as of
   * 2026-08-20, when "Plug in your own tools" joined the leave-open group
   * (product ADR-0015). The day feedback loop was cut from this list on
   * purpose, and "Bring your own AI" was folded into "Choose your model"
   * (they were redundant); don't re-add either.
   * Every summary must fit two lines in the letter column at >=1280w (~165
   * chars max, verified in-browser) — Luis's cap.
   *
   * A long-form "Architecture decisions" tab — each one argued out as
   * question / choice / why / cost — was built and then pulled the same day
   * (Luis: "it was just to record to do it later"). The draft page and
   * content module are recoverable at commit bb307b6.
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
  // ~1,150 words across the letter column at ~220 wpm → 5 (the tools section
  // grew to four paragraphs on 2026-08-30; 1,210 words is where this rounds
  // to 6). Recount pinned in manifesto.test.ts, so a longer letter fails
  // loudly instead of lying.
  letterNote: "A letter from Luis · 5 min read",
  blocks: [
    {
      kind: "p",
      text: "Locus was born out of necessity: ==a system to help us deal with the fast, noisy, high-stress times we increasingly live in==.",
    },
    {
      kind: "p",
      text: "The starting point was an old idea from David Allen's Getting Things Done: you need one system you can trust with everything — every to-do, every objective, every thing you already did — ==so your mind can stop running the meta-strategy in the background and be present== in what is in front of you, as fully as possible.",
    },
    { kind: "h", id: "the-struggle-never-stops", text: "The struggle never stops" },
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
      text: "==To win the day, you have to be present== — head down, in the work. A soldier. ==To win the decade, you have to lift your head== — set the strategy, learn from the day, connect it to the ones before it. A general.",
    },
    {
      kind: "p",
      text: "You don't get to pick which one you are. You're both, at once, permanently — and neither one covers for the other. A bad plan loses no matter how well you fight it. A good plan loses to a day you never showed up for. Both have to be there, and both have to be good.",
    },
    {
      kind: "p",
      text: "So everything rests on the bridge between them: the weeks and months in between, the projects, the goals you set for them. Follow the plan — and keep checking the plan still leads where you want to go.",
    },
    {
      kind: "p",
      text: "It's a delicate equilibrium. ==Two things can help you hold it: personal discipline, and/or a good system.==",
    },
    {
      kind: "p",
      text: "The best odds come from having both. But only one of them can be built for you. Discipline is yours — nobody can supply it from the outside. The system is ours to build. We count on you for the first. You can count on us for the second.",
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
      text: "We never found what we thought a great solution to this modern productivity problem would look like: one that gathered all of this context and used it to help us win the day and, day after day, the war. So we built one.",
    },
    { kind: "h", id: "two-ideas-behind-the-design", text: "Two ideas behind the design" },
    {
      kind: "p",
      text: "Most of the decisions in Locus come down to two ideas.",
    },
    {
      kind: "p",
      emphasis: true,
      text: "The first is a remarkable effect, at work all around us and all through our lives. A line that made the rounds credited to a famous physics genius — though probably not his — captures it best:",
    },
    {
      kind: "quote",
      text: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
      attribution: "Credited to Albert Einstein",
    },
    {
      kind: "p",
      emphasis: true,
      text: "==Small improvements, repeated, are the whole game.== We want to be on the earning end of that effect.",
    },
    {
      kind: "p",
      emphasis: true,
      text: "The second is what makes the repeating possible. James Clear put it best:",
    },
    {
      kind: "quote",
      text: "You do not rise to the level of your goals. You fall to the level of your systems.",
      attribution: "Atomic Habits",
    },
    {
      kind: "p",
      text: "Put together: the most useful thing we could give you is not a better goal. It is a better system — one you can trust with the whole day, that learns from the day you actually had, and that compounds.",
    },
    // Renamed from "What we're building" / "How we made it" (Luis, 2026-08-19):
    // the last two titles now carry content like the first three do.
    { kind: "h", id: "locus-in-three-parts", text: "Locus, in three parts" },
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
  // Anchor deliberately doesn't count (it was "five-decisions" until the
  // sixth arrived on 2026-08-20) — the next one shouldn't break links again.
  decisionsId: "design-decisions",
  decisionsHeading: "Six decisions",
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
      id: "external-tools",
      title: "Plug in your own tools.",
      summary:
        "The MCP servers you already connected to your harness — Notion, Linear, your own — work in Locus too. You switch on the ones that make sense for your setup.",
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
