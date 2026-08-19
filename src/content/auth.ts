/**
 * Copy for the two auth surfaces (`/login`, `/signup`).
 *
 * Lives in `src/content` — and is registered in `deadVocabulary.test.ts` — so the
 * retired pre-pivot vocabulary lint covers it like every other content module.
 *
 * Both pages share one editorial split (see `app/login/auth-layout.tsx`): the left
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
      "30 days free, no card required.",
      "No passwords. Sign in with Google, or we send a one-time link to your inbox.",
    ],
    submitLabel: "Send magic link",
  },
} as const satisfies Record<string, AuthCopy>
