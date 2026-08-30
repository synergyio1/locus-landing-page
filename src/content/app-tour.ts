// The /app tab (new 2026-08-20) — a video walkthrough of the main screens.
//
// GROUND TRUTH for the screen list is the app's own sidebar:
//   /Users/cippa/Desktop/fly/pomodoro-preview/Locus/Packages/LocusUI/Sources/
//   LocusUI/SidebarTab.swift — `SidebarGroup`, `displayTitle`, `subtitle`.
// Each `subtitle` below is transcribed verbatim from that file, so the site
// and the app describe a screen with the same words. Note the raw case names
// differ from what the user sees (command → "Focus", sentinel → "Watch",
// review → "Flywheel", routines → "Intelligence", memory → "Portrait"); the
// display titles are what belong on a marketing page.
//
// The three families are the same three parts the manifesto names, so
// `screens` is validated against `manifesto.parts` at import — if the letter
// is ever re-cut, this page fails loudly instead of drifting.
//
// NO PRODUCT STILLS (Luis, 2026-08-20). The 8 marketing screenshots in the
// product repo are dark-theme and predate July; they show a sidebar that no
// longer matches the one above. The video carries the imagery; the screen
// list carries the words. Don't add stills until fresh captures exist.

import { manifesto } from "./manifesto"

export type TourVideo = {
  src: string
  poster: string
  /** Intrinsic pixel size — reserves the aspect box so nothing shifts on load. */
  width: number
  height: number
  /** Seconds. Pinned to the 45–75s brief in app-tour.test.ts. */
  duration: number
  /** WebVTT path, when captions exist. */
  captions?: string
}

export type TourScreen = {
  /** Must name one of `manifesto.parts`. */
  part: string
  /** The sidebar's `displayTitle`. */
  name: string
  /** The sidebar's `subtitle`, verbatim. */
  subtitle: string
  text: string
}

export type AppTourContent = {
  eyebrow: string
  title: string
  intro: string
  /** null until the recording lands — the page renders a held frame instead. */
  video: TourVideo | null
  videoLabel: string
  videoPending: string
  screensIntro: string
  screens: TourScreen[]
  closer: string
  cta: { label: string; href: string }
  /** Optional: unset while the Packs page is hidden (2026-08-30). */
  secondaryCta?: { label: string; href: string }
}

const SCREENS: TourScreen[] = [
  {
    part: "Execution",
    name: "Home",
    subtitle: "Your why and what's now",
    text: "The one screen that answers “what am I meant to be doing right now”, with the reason underneath it.",
  },
  {
    part: "Execution",
    name: "Focus",
    subtitle: "Plan and steer focus",
    text: "Where the day gets shaped and a session gets launched — the plan on one side, the clock and the live timeline on the other.",
  },
  {
    part: "Execution",
    name: "Watch",
    subtitle: "Keep the dots connected",
    text: "What actually happened while you weren't in a session: apps, windows, and the honest gap between intent and outcome.",
  },
  {
    part: "Inputs",
    name: "Notes",
    subtitle: "Capture and analyze",
    text: "Somewhere to put the thought now and let Locus pull the tasks and commitments out of it later.",
  },
  {
    part: "Inputs",
    name: "Tasks",
    subtitle: "Next actions",
    text: "The next actions, tied to the project or habit they belong to rather than floating in a list.",
  },
  {
    part: "Inputs",
    name: "Commitments",
    subtitle: "Projects and habits",
    text: "The things you've said you'll do — outcomes you're driving and rhythms you're keeping, in one place.",
  },
  {
    part: "AI",
    name: "Flywheel",
    subtitle: "Compound for tomorrow",
    text: "The digests and the chat: what Locus noticed, what it might mean, and what's worth trying next.",
  },
  {
    part: "AI",
    name: "Intelligence",
    subtitle: "How Locus acts on its own",
    text: "Every routine Locus runs, readable and editable — and where you pick the pack that sets the method.",
  },
  {
    part: "AI",
    name: "Portrait",
    subtitle: "What Locus knows about you",
    text: "The picture it's built of how you work, kept on your Mac as plain files you can read and correct.",
  },
]

/**
 * The three families in the sidebar are the three parts of the letter. If a
 * screen ever names a part the manifesto doesn't have, that is drift between
 * two surfaces describing the same product — fail at import, not in review.
 */
const PART_NAMES = new Set(
  manifesto.blocks.flatMap((block) =>
    block.kind === "parts" ? block.items.map((item) => item.name) : []
  )
)

for (const screen of SCREENS) {
  if (!PART_NAMES.has(screen.part)) {
    throw new Error(
      `app-tour: screen "${screen.name}" names part "${screen.part}", which isn't one of the manifesto's parts (${[...PART_NAMES].join(", ")}).`
    )
  }
}

export const appTour: AppTourContent = {
  eyebrow: "The app",
  title: "Locus, on screen.",
  intro:
    "Nine screens in three families: what you did with your time, everything you mean to do, and the agent that reads both. This is the whole app in about a minute.",
  video: null,
  videoLabel: "A walk through Locus",
  videoPending:
    "The walkthrough is being recorded. It lands here — about a minute, every screen below, no narration you have to sit through.",
  screensIntro: "What you're looking at",
  screens: SCREENS,
  closer:
    "Everything above runs on your Mac. The agent behind the last three screens runs on whichever AI you already pay for.",
  cta: { label: "Download Locus", href: "/download" },
  // secondaryCta: { label: "See the packs", href: "/packs" }, — restore with the nav item.
}
