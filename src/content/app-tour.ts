// The /app tab — the showcase (six tabs + chat, from `app-showcase.ts`; the
// per-tab write-ups live inside it) and, once Luis records it, a walkthrough.
//
// The screen list used to live here as nine screens in three families; the
// app's Execution re-org (2026-08-27/28) flattened the sidebar to six tabs
// with chat in the titlebar, and the list moved to `app-showcase.ts` so `/`
// and `/app` describe the product with the same words. This module only
// holds what is specific to the page.

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

export type AppTourContent = {
  eyebrow: string
  title: string
  intro: string
  /** null until the recording lands — the page simply omits the player. */
  video: TourVideo | null
  videoLabel: string
  closer: string
  cta: { label: string; href: string }
  /** Optional: unset while the Packs page is hidden (2026-08-30). */
  secondaryCta?: { label: string; href: string }
}

export const appTour: AppTourContent = {
  eyebrow: "The app",
  title: "Locus, on screen.",
  intro:
    "Six tabs and one conversation. Each tab does one job; chat, in the title bar, talks to all of them. Everything runs on your Mac, on the AI you already pay for.",
  video: null,
  videoLabel: "A walk through Locus",
  closer:
    "Everything above runs on your Mac. The agent behind System and Chat runs on whichever AI you already pay for.",
  cta: { label: "Download Locus", href: "/download" },
  // secondaryCta: { label: "See the packs", href: "/packs" }, — restore with the nav item.
}
