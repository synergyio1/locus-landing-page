# [A.11] Landing page truth alignment — post-pivot copy, positioning, and feature story

*Rewritten 2026-07-06. Supersedes the old [A.10] "Landing page redesign" PRD, which was built on the pre-pivot product (server-orchestrated AI, Free/Pro split, "on-device classification runs locally" as a page claim, hero locked as "Finish the things you keep starting"). Sections of A.10 that shipped (Cobalt accent, Logo component, section collapse, Coach voice mandate, Framer-only rule) are recorded as done in `DESIGN.md`; everything else here starts from the current truth in `.agents/product-marketing-context.md` (V2).*

## Problem Statement

The live page still sells the product Locus was in April: an "AI planner + classifier + Friday review" running through Locus's backend, with a free "Loop" tier and paid "Pro" AI features. The product shipped past it: Locus is now a **local-first macOS (Tahoe+) workspace with an embedded AI agent** — Routines, Memory, Autonomy with Undo — running on **the user's own AI compute** (Claude Code / Codex / API keys) or an optional managed-AI add-on, with **no free tier** and Stripe billing.

Concretely, a visitor today is told things that are false (a free tier exists; AI features are "Pro"; the weekly review arrives by email) and is never told the things that are now the strongest reasons to buy (your data lives on your Mac; the AI runs on the subscription you already pay for; every AI behavior is a file you can read and edit; everything the agent does can be undone).

## Solution

Align the page to the truth, in the committed Coach voice, leading with what is now both true and differentiating:

1. **Local-first, for real** — data on your Mac; the account is a license, not a data scope.
2. **Your AI, your compute** — BYO Claude Code / Codex / API keys, or managed credits through a proxy that stores no prompts.
3. **An agent you can read, edit, and undo** — Routines / Memory / Autonomy.
4. **The Day Feedback Loop** — observe (Sentinel) → interpret (Review/Chat) → structure (Smart Plan) → focused sessions → adapt.

Positioning source of truth: `.agents/product-marketing-context.md` (V2, 2026-07-06). Final hero/category label is decided *during* this pass, against that doc — the old locked hero is void.

## Decided facts every string must obey

- No free tier. One plan: **$6/mo monthly, $4/mo billed yearly ($48/yr, save 33%)**; UI defaults to yearly.
- **14-day** in-app trial, no card. (App/backend still grant 7 days — see Dependencies.)
- **BYO AI included**; add-on **Locus managed AI $8/mo in credits** ("Choose your AI" rail — an add-on, not a tier).
- **30-day** refund.
- Requires **macOS 26 (Tahoe)** — the existing FAQ claim is correct; keep it.
- Weekly digest is **in-app only** — no email delivery claims.
- Naming: user-side harnesses (Claude Code, Codex) are named freely; managed-AI upstream vendor stays unnamed ("frontier models").
- Banned vocabulary: "Pro", "free tier", "Try Pro", "optimize/fix your day", surveillance register ("monitor" as a feature noun), hustle-speak. "On your Mac"/"local-first" is encouraged where concrete.

## File-by-file gap inventory (verified 2026-07-06)

### `src/content/faq.ts`
- `privacy` — rewrite entirely: currently "window titles… go through Locus's backend to leading AI models… the free Loop tier doesn't need it." Truth: data on-device; BYO prompts go to *your* provider; managed AI passes through a no-storage proxy.
- `offline` — rewrite: "the free Loop works offline, Pro AI features need a connection" → no free/Pro; sessions/tasks/commitments work offline, AI features need whichever provider you chose.
- `who-for`, `how-different` — re-voice against the new differentiators (agent, local-first, BYO) instead of "execution layer + AI plans/catches/walks you through Friday."
- `missed-session` — mostly fine; align terms (rhythm commitments don't roll over debt).
- `keystrokes` — keep the substance (no keystrokes/screenshots/URLs; frontmost app + window title only); can now add "and it stays on your Mac."
- `refund` — keep 30-day, `support@getlocus.tech`.
- `macos-requirement` — correct (Tahoe). Keep.
- `mac-only` — drop or soften the "iOS companion is on the roadmap" claim (unverified in product repo).
- Add candidates: "What are Routines?", "What does Locus remember about me?", "What can the AI do on its own?" (autonomy + undo), "Which AI does it use?" (the BYO story).

### `src/content/download.ts`
- "Grab the free DMG… sign in when you want your account, trial, or Pro features" → download + sign-in + 14-day trial starts in-app; no "free"/"Pro" framing. macOS Tahoe requirement stays.

### `src/content/privacy.ts` + `src/content/terms.ts` (drafts)
- Both speak "Pro" subscription language. Privacy can now go further truthfully: data local, no prompt storage on managed AI, no analytics SDKs in the app. Terms: refund window to 30 days; billing = one plan + optional managed-AI add-on; Sparkle updates unchanged.

### `src/content/hero.ts`, `src/app/layout.tsx`, `src/lib/og.tsx`, OG images
- ✅ RESOLVED (user-locked 2026-07-06): hero stays **"The missing OS for modern work."** with the **"AI-native execution OS"** badge — the ambitious category claim wins the hero, and post-pivot it's more true, not less (the AI is literally native now). The subhead was extended to carry the pivot's differentiators ("…an AI agent that lives on your Mac and runs on the AI you already pay for"), "free" was removed from CTAs, and meta + home OG were re-synced to the hero. Do not re-litigate the headline; body copy may use the product-voice "mess into structure" register, the hero may not be swapped to it.

### `src/content/pricing.ts` (+ `pricing.tsx`)
- Structure already correct: one plan / 14 days / $6/$4 / AI rail with $8 add-on / 30-day refund. Fix: "Friday review — … in-app **and by email**" (email off); "The full loop — sessions, projects, habits, tasks, and the menu bar timer" is fine but consider replacing one bullet with Routines/Memory/Autonomy so the plan card reflects the agent, not just the tracker era.

### `src/lib/account/derive.ts` (+ account page)
- "Free | Trial | Pro" labels, "Start 7-day Pro trial", "Upgrade to Pro" — must move to the new license vocabulary (`trialing / standard / remote / expired` in the product; surfaced to users as one plan + AI add-on) and 14 days. **Blocked on backend + app moving together** — see Dependencies.

### `src/content/heroWidget.ts`, `depth.ts`, `review.ts`, `personaSection.ts`
- HeroWidget copy is scenario-based and mostly evergreen; sweep for dead terms.
- `depth`/`review`/`persona-section` are built but unrendered. Decide keep/cut/merge: `review.ts` says "every Friday… by email" territory — if kept, re-anchor on the in-app weekly digest + Chat. Persona remains Sara Mendes if revived.

### Missing entirely (the July frontier)
- The page shows nothing of **Routines, Memory, Autonomy+Undo, Presence** — the product's newest, most differentiating surface. At minimum: one section (or the future system-demonstration showpiece) must carry "an agent you can read, edit, and undo."
- **Screenshots:** `public/screenshots/screens/` has 8 pre-July views (Command, Sentinel, Commitments, Project, Habit, Tasks, Review-weekly, MenuBar). No Routines/Memory/Presence captures exist yet — they must be produced from the product repo's marketing pipeline (`pomodoro-preview/marketing/`, `MarketingSnapshotTests`) before those sections can ship.

## Dependencies / cross-repo gaps (not fixable in this repo alone)

1. **Trial 7→14 days** — product app (`TrialActivator`, trial copy), `locus-api`, and `derive.ts` here must change together; until then the account area contradicts the pricing page.
2. **Stripe products** — confirm live prices match $6/$4/$8 before the copy claims them at launch.
3. **New screenshots** — generated in `pomodoro-preview`, then copied into `public/screenshots/`.

## Out of Scope

- Product/app changes beyond the trial-length dependency note.
- New social proof (no real quotes yet).
- Pricing-model changes (the model is decided; this PRD only aligns copy/UI to it).
- i18n, CMS, light mode.

## Testing / verification

- Existing content tests (`hero.test.ts`, `faq.test.ts`, `pricing.test.ts`, etc.) are updated alongside their content modules — they encode copy, so they change with it.
- Add a repo-wide "dead vocabulary" check to the content test suite: no content module may contain `Pro tier`, `free tier`, `Try Pro`, `7-day`, or `by email` (digest context). Cheap regression net against re-drift.
- Manual pass: every rendered string traceable to a decided fact above; OG images visually match the hero.

---

**Labels:** `realdeal-2026`, `truth-alignment`
