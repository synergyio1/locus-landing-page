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
  cta: { label: string; href: string }
  /** Optional: unset while the Packs page is hidden (2026-08-30). */
  secondaryCta?: { label: string; href: string }
}

// Header rewritten 2026-09-02 (Luis: "Locus, on screen." + the tab inventory
// was "very generic"). The headline carries the manifesto's spine — the decade
// down to the day; the intro is Luis's own line: six tabs, one smart copilot
// (chat in the title bar, or voice) that reaches all of them. The closing
// "Everything above runs on your Mac…" paragraph was cut the same day — it
// only repeated the intro's last sentence.
export const appTour: AppTourContent = {
  eyebrow: "The app",
  title: "From your decade down to today.",
  intro:
    "Six tabs, explained below, and one smart copilot — chat in the title bar, or just your voice — that reaches all of them. All of it on your Mac, on the AI you already pay for.",
  video: null,
  videoLabel: "A walk through Locus",
  cta: { label: "Download the app", href: "/download" },
  // secondaryCta: { label: "See the packs", href: "/packs" }, — restore with the nav item.
}
