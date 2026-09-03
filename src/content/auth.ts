/**
 * Copy for the three auth surfaces (`/login`, `/signup`, `/auth/confirm`).
 *
 * Lives in `src/content` — and is registered in `deadVocabulary.test.ts` — so the
 * retired pre-pivot vocabulary lint covers it like every other content module.
 *
 * All three share one editorial split (see `app/login/auth-layout.tsx`): the left
 * rail states where you are, the right rail is the form. The reassurance points are
 * deliberately about *how sign-in works*, not product features — this is the last
 * screen before the app, not another pitch.
 */

export type AuthCopy = {
  eyebrow: string
  title: string
  subline: string
  points: readonly string[]
  submitLabel: string
}

export const authCopy = {
  login: {
    eyebrow: "Access",
    title: "Sign in to Locus.",
    subline: "Welcome back — pick up where you left off.",
    points: [
      "No passwords. Sign in with Google, or we send a one-time link to your inbox.",
      "The same account signs you in to the macOS app.",
    ],
    submitLabel: "Send magic link",
  },
  signup: {
    eyebrow: "Get started",
    title: "Create your Locus account.",
    subline:
      "Your account carries your plan and your billing. Everything you actually do lives on your Mac.",
    points: [
      "7 days free, no card required.",
      "No passwords. Sign in with Google, or we send a one-time link to your inbox.",
    ],
    submitLabel: "Send magic link",
  },
  // The click that actually spends the one-time token. Mail scanners fetch every
  // link in an email before the recipient sees it, and that fetch was burning the
  // token — so opening the link only *shows* this page, and a real click confirms.
  // The copy has to explain the extra step without sounding like an error.
  confirm: {
    eyebrow: "Access",
    title: "Signing you in.",
    subline:
      "One moment — we're finishing your sign-in. If nothing happens, use the button.",
    points: [
      "This page exists because inbox scanners open links before you do. Stopping here keeps your link yours.",
      "Links work once, and only for a short while. If this one fails, send another.",
    ],
    submitLabel: "Confirm sign-in",
  },
  // Same link, but it was asked for from the Mac app, so confirming hands the
  // session to the app rather than opening an account page in the browser.
  confirmApp: {
    eyebrow: "Access",
    title: "Open Locus to finish.",
    subline:
      "Your link is good. Confirm below and Locus will pick it up on this Mac.",
    points: [
      "This step exists because inbox scanners open links before you do. Confirming here keeps your link yours.",
      "Locus needs to be installed on the Mac you're reading this on.",
    ],
    submitLabel: "Open Locus",
  },
} as const satisfies Record<string, AuthCopy>
