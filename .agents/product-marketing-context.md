# Product Marketing Context

*Last updated: 2026-08-17 (repricing + Locus Remote credits + 30-day trial; body otherwise 2026-07-06)*
*Status: V2 — full rewrite against the product source of truth (`../pomodoro-preview`). Supersedes V1 (2026-04-25), which described a pre-pivot Locus: server-orchestrated AI, Free/Pro split, "remove on-device claims." All of that is gone. If a claim here conflicts with the product repo, the product repo wins — see "Source of truth" at the bottom.*

## Product Overview

**One-liner (working draft — final page copy decided in the landing-update pass):** Locus is a local-first macOS app with an embedded AI agent that makes your day legible — it watches how the day actually goes, coaches you through focused work, and turns today's mess into tomorrow's structure.

**The product model — one Day Feedback Loop** (product north star, `pomodoro-preview/docs/design-docs/day-feedback-loop.md`): observe the day → interpret the patterns → suggest structure → support intentional work → adapt from feedback. Four roles inside one loop, not competing modes:
- **Sentinel** ("Watch") — ambient, off-session observation. When you're not in a session, Locus quietly notes which app/window has your attention and makes the unplanned day legible. Observation, not judgment.
- **Focus** — declared intent. A timed session ("I'm doing this now") with live AI classification of the frontmost window against what you said you'd do, and a live focus score.
- **Review** ("Learn") — interpretation and coaching. Daily/weekly/monthly digests plus an AI chat that knows your data, renders charts and suggested actions, and accepts disagreement (your pushback becomes a persistent fact it remembers).
- **Command** ("Control") — the "today" surface. Free-text objective → AI-drafted day plan (Smart Plan), day timeline, session launch.

**What makes it AI-native now:** the AI is a real agent living on your Mac, not API calls bolted onto a tracker.
- **Routines** — every AI behavior (daily digest, chat replies, notes analysis, a distraction coach) is a user-readable, user-editable Markdown file with triggers (manual, event-based, scheduled). You can see exactly what the AI does and change it.
- **Memory** — an on-device Markdown wiki of what Locus has learned about you, rendered as an editable knowledge tree. Inspectable, correctable, yours.
- **Autonomy with Undo** — the AI acts at a level you set (ask / standard / auto), can only auto-execute genuinely undoable actions, and every auto action shows a done-card with one-click Undo.

**Product category (user-confirmed 2026-07-06):** the category-creation play stands, and so does its label — **"AI-native Execution OS"** stays, and is *more* true post-pivot: the AI is literally native now (an agent living on the Mac — Routines, Memory, Autonomy). **Hero locked (user, 2026-07-06): "The missing OS for modern work."** — the ambitious category claim leads; the mechanism and the local-first/BYO differentiators live in the subhead ("…with an AI agent that lives on your Mac and runs on the AI you already pay for"). What changed underneath the label: the category is no longer defined by the "planner + classifier + Friday review" trio but by the local-first agent. The product-voice line "turn today's mess into tomorrow's structure" is body-copy register, not the hero.

**Product type:** Native macOS app, **macOS 26 (Tahoe) or later** (verified: `MACOSX_DEPLOYMENT_TARGET = 26.0`). B2C single-seat subscription. Direct distribution with Sparkle auto-update — not the Mac App Store. Currently shipping v1.1.0. Optional Apple Watch companion. *(The old "iOS companion end of Q2 2026" claim has no basis in the product repo — treat as unverified; see Open items.)*

## Business model (repriced 2026-08-17 — supersedes the 2026-07-06 numbers)

- **No free tier.** One plan, everything included — Locus charges for the software, not for AI usage.
- **$3/mo month-to-month, or $30/yr** (shown as the **$2.50/mo** equivalent; savings chip **"2 months free"** — a year costs ten monthly payments). Pricing UI defaults to yearly with the per-month price shown. The old $6/$4 ($48/yr, "save 33%") numbers are retired.
- **Framing (Coach voice, humble, not premium):** *"A small fee that keeps the basic infrastructure running and lets us keep maintaining the app and building new features."* Mirrors the app's own paywall line ("Locus is cheap — a low usage fee that maintains the app and keeps development going").
- **30-day free trial, started from inside the app, no card required.** ✅ Aligned 2026-08-17 across app (`TrialConfiguration.lengthInDays = 30`), `locus-api` (`TRIAL_DURATION_MS` = 30 d), and this repo (`/api/pro-trial/start`, `derive.ts`, `/account` copy). The July "14 days" decision was overtaken by the app shipping 30.
- **Bring-your-own AI included:** users plug in the AI they already pay for — a Claude Code or Codex subscription, or an API key. No extra cost, no per-token markup.
- **Optional: Locus Remote, paid with prepaid Remote credits** (product ADR-0010, 2026-08-14). One-off purchases of **any amount**, metered as the AI is used ("the more you use, the more it draws"). **Never part of the plan or the trial; not a tier.** Presented as the second card of the "Choose your AI" rail. Naming adopted from the app: **"Locus Remote"**, **"Remote credits"**, verb **"Buy credits"**. The July "$8/mo Locus managed AI" add-on is retired. Purchase flow lives in the Mac app (Settings → Account) + `locus-api`; the site's `/account` shows a static "Remote credits — coming soon" card only.
- **30-day no-questions refund.** (`terms.ts` matches.)
- **Billing: Stripe** — checkout + webhooks live in this repo (getlocus.tech). Paddle is fully gone (zero references in product code).
- **Trial expiry / lapse:** the whole app swaps to a read-only lock screen — no per-feature gates, no data hostage. Everything stays on the user's Mac and exportable ("Reveal my data in Finder" *is* the export). Running out of Remote credits only pauses Locus Remote — BYO AI and the rest of the app keep working.

## Target Audience

**Target market — broadest possible TAM:** anyone who relies heavily on personal productivity and works on a Mac. **No vertical narrowing — no profession, no company size, no career stage gates.** (Decision retained from 2026-04-25; still holds.)
**Decision-maker:** the user is the buyer.
**Primary use case:** make the day legible and the week accountable — see where attention actually went, do the intentional work, and let the system structure tomorrow from what it learned today.

**Jobs to be done:**
- "Make sure I'm on track for the goals I actually care about."
- "Start the morning with a plan I'll actually follow."
- "Catch me when I'm drifting, before I lose the afternoon."
- "Tell me at the end of the week what it was actually for."
- New since the pivot: "Give me an AI that works for me, on my machine, with my data — not another cloud that reads my life."

**Primary persona — "Mac power user with ambitious personal-productivity goals":**
- **Cares about:** moving on the goals that matter, not just looking busy. Increasingly likely to already pay for an AI subscription (Claude, ChatGPT/Codex) and to care where their data lives.
- **Challenge:** the urgent crowds out the important; by Friday they can't reconstruct where the week went; existing tools either track without helping or plan without watching.
- **Value we promise:** one app, open every day, that watches the day honestly, coaches the work, remembers what it learns, and structures tomorrow — with the data on their Mac and the AI under their control.

## Problems & Pain Points

**Core problem:** the week ends and the long-running goals haven't moved — even though every day felt full. The gap between intention and execution compounds quietly.
**Why alternatives fall short:**
- Timers measure time but don't pick the work or notice drift.
- Trackers tell you where time went after the fact; they don't intervene or learn.
- Planners shape the calendar but don't watch what happens once you sit down.
- DIY stacks (Notion + Cal + Toggl + a focus app) make the user the integration layer — the exact discipline problem they came in with.
- "AI productivity" tools bolt a chatbot onto a tracker; the AI has no memory of you, no agency, and lives in someone else's cloud.

**Emotional tension:** "I'm working hard but I'm not sure it's adding up." Quiet shame about half-finished projects. Optimization-app fatigue. Growing unease about feeding work data to opaque AI services.

## Competitive Landscape

*Per positioning decision, the landing page itself NEVER names competitors. Internal context only.*

**What customers use today:** calendar planners (Motion, Sunsama, Reclaim); trackers (Rize, RescueTime, Timing); single-purpose timers (Session, Toggl, pomodoro apps); DIY stacks; blockers (Cold Turkey); manual systems.
**What none of them ship:** the whole loop — ambient observation + intentional sessions + an AI that interprets, remembers, and structures the next day — running local-first on the user's own AI compute.

## Differentiation

**Key differentiators (rebuilt 2026-07-06):**
- **Local-first, for real** — sessions, projects, habits, tasks, chat history, and the AI's memory of you are files and a database *on your Mac* (SQLite + Markdown). The account is a license, not a data scope. This is now a **lead differentiator**, not a claim to avoid — the April rule "remove on-device claims" is **retired** because the architecture changed underneath it.
- **Your AI, your compute** — bring the Claude Code or Codex subscription (or API key) you already pay for; Locus drives it as its brain. No other productivity app does this. Managed compute exists for people who want zero setup — through a thin proxy that **stores no prompts or responses**, only aggregate token counts.
- **A user-programmable agent, not a feature flag** — Routines make every AI behavior a readable, editable Markdown file with triggers. "What does Locus do on its own?" has an inspectable answer.
- **Transparent memory** — the Memory tab shows exactly what Locus knows about you, as an editable wiki. Disagree with an insight in chat and the disagreement itself is remembered.
- **Autonomy you can trust** — ask/standard/auto modes, auto-execution only for undoable actions, one-click Undo on everything the agent did.
- **Observation, not judgment** — Sentinel makes the unplanned day legible without scoring it; scores only exist inside sessions you declared. Coach voice, not surveillance voice.
- **Native-Mac craft** — menu-bar timer with breathing dot, chat popover, voice input, Sparkle auto-update, macOS Tahoe APIs. Not an Electron port.

**Why that's better:** the user stops being their own operating system *and* stops renting their self-knowledge to a cloud. The system carries the structure; the user keeps the data and the AI relationship.

## Privacy & AI data handling

**Posture (reversed 2026-07-06 — supersedes the 2026-04-25 rules):** privacy/local-first is now a truthful, load-bearing differentiator. Lead with it where it's concrete.

What is literally true now (from `pomodoro-preview` ADR-0001/0008 + code):
- All user data lives on-device: SQLite/SwiftData for structured data, Markdown files for the AI's memory/wiki/digests (`~/Library/Application Support/Locus/users/<uuid>/`).
- The account exists to hold the license (Supabase auth). It does not scope or store user data. Cloud chat/wiki/email state was dropped from the server (migration `20260702000000_drop_chat_wiki_email_state.sql`).
- BYO AI: prompts go from the user's Mac to *their own* AI provider under their own account/key. Locus's server isn't in the path.
- Managed ("Remote") AI: prompts pass through Locus's thin model proxy which authenticates, meters aggregate daily token counts, and **stores no prompt or response content**.
- No third-party analytics SDKs in the app; no keystroke reading, no screenshots, no URL scraping — classification reads the frontmost app + window title.

**Naming rules:**
- **User-side harnesses are named freely** in copy: Claude Code, Codex, Anthropic/OpenAI API keys — they're literally UI options and a selling point.
- **Locus's own upstream vendor for Locus Remote stays unnamed** in public copy ("frontier models" — internally: Fireworks/GLM, OpenRouter fallback). This is the surviving half of the old providers-unnamed rule.

## Objections

| Objection | Response |
|-----------|----------|
| "Another focus app — I've tried five." | It's not a timer with charts. Show the loop: the day gets observed, interpreted, and turned into tomorrow's structure — by an agent you can read, edit, and undo. Pomodoro is literally one option inside one tab. |
| "Why pay when there are free timers?" | No free tier and no apology: 30 days free to feel the loop compound, then $3/mo or $30/yr — a small fee for the software and its upkeep. The AI runs on the subscription you already own, so there's no per-token markup hiding in the price. |
| "What does the AI see / where does my data go?" | Your data lives on your Mac. With BYO, prompts go to your own AI account. With Locus Remote, our relay stores nothing — it can't even replay what you said; it only meters your credits. Specific, checkable claims — not "fully private" hand-waving. |
| "I don't want an app watching me." | Sentinel observes only off-session foreground app/window titles, on your machine, for you — no keystrokes, no screenshots, no URLs, nothing surfaced to anyone else. And the register is observation, not judgment: nothing scores you outside a session you declared. |
| "macOS only?" | Yes — macOS 26 (Tahoe) or later, and unapologetically native. Windows/Linux not planned. (iOS companion: unverified, don't promise — see Open items.) |
| "What if I miss a day or skip sessions?" | Nothing breaks, nothing scolds. Rhythm commitments don't roll over debt; the weekly digest tells the truth without shaming. |
| "Why should I trust an AI with autonomy?" | Because it's engineered for distrust: you set the autonomy level, it can only auto-do what can be undone, and every action shows an Undo. Plus you can open the routine file and read its instructions. |

**Anti-persona:**
- Teams wanting a manager-visible dashboard — Locus is single-user and surfaces activity to no one but you.
- Users who need free-forever — there is no free tier; the trial is the trial.
- Windows / Linux / web users; Macs older than Tahoe.
- Users who want hard blocking (Cold Turkey-style punishment). Locus nudges; it doesn't punish.

## Switching Dynamics

**Push:** "I'm tracking time but my goals still aren't moving." / "My planner makes a beautiful schedule and the day eats it." / "My DIY stack is itself the discipline problem." / "The AI in my current tool is a chatbot with amnesia."
**Pull:** one loop instead of four tools; an agent that remembers you and acts under your rules; your data on your Mac; runs on the AI subscription you already pay for; native Mac craft; a coach voice that doesn't shame the missed days.
**Habit:** sunk cost in existing tools' data; calendar wired to a planner; "I should just be more disciplined" self-blame.
**Anxiety:** "Will I lose my history?" (no import path today). "Another app I'll abandon in three weeks?" "What does the AI do with my data?" (answered concretely — see Privacy). "Will it run on my Mac?" (Tahoe required — say it plainly).

## Customer Language

*(No real beta quotes yet — placeholders; replace once captured.)*
- "My calendar is full but my week doesn't always move."
- "I can't account for where the hours went."
- "I keep starting things and not finishing them."
- "I pay for Claude anyway — I want it working on my life, not just my code."

**Words to use:**
- the day, the week, the work, legible / readable, on track, structure, commitments, sessions, the loop, the agent, memory, routines, undo, on your Mac, local-first, your AI / your compute, what actually moved, gently, once, every day
- Coach register: warm, honest, accountability-partner.

**Words to avoid:**
- **"optimize your day" / "fix your day"** — explicit product-voice rule (`day-feedback-loop.md`): Locus makes the day *readable* and structures *tomorrow*; it doesn't promise to fix you.
- track, surveil, monitor (as a noun for the feature) — surveillance register.
- hustle, crush, dominate, 10x, beast mode, grind.
- shame, punish, lock, block — Cold Turkey vocabulary, wrong register.
- "fully private" / "totally anonymous" — sweeping; use the specific checkable claims instead.
- "AI-powered" as a badge — show what the agent does.
- Upstream model-vendor names for Locus Remote (Fireworks, GLM, OpenRouter) — internal only.
- "Locus managed AI", "$8/mo", "$48/yr", "save 33%", "14-day trial" — retired 2026-08-17; guarded by `src/content/deadVocabulary.test.ts`.
- Stoic / clinical / editorial flourishes — the previously flagged "amateur feel."
- ~~"on-device," "locally," "never leaves your Mac"~~ — **un-banned 2026-07-06.** These are now true and encouraged where concrete. (Old ban retained here only so nobody "restores" it from stale docs.)

**Glossary (current domain language — matches the app and `pomodoro-preview/docs/glossary.md`):**
| Term | Meaning |
|------|---------|
| Day Feedback Loop | The product model: observe → interpret → structure → focused work → adapt. |
| Sentinel / "Watch" | Off-session ambient observation: foreground app + window title, on your Mac, made legible as a timeline and digests. |
| Session / Focus | A declared-intent timed work block — the only place a focus score exists. |
| Execution strategy | Per-launch run shape: single block, multiple blocks, or pomodoro. Pomodoro is one option, chosen per launch, never a persistent identity. |
| Command / "Control" | The today surface: objective → Smart Plan → timeline → launch sessions. |
| Smart Plan / Objective | Free-text "what today is for" → AI-drafted day plan you accept or edit; deterministic fallback offline. |
| Commitments | Umbrella for the two shapes of ongoing work: **Projects** (outcome commitments — have a finish line) and **Habits** (rhythm commitments — return on cadence, no debt rollover). |
| Tasks | One-off next actions; link to at most one parent commitment. |
| Review / "Learn" | The interpretation surface: day/week/month digests, metrics, and the AI chat. |
| Chat | The conversational surface of Review — charts, suggested-action cards, agree/disagree. Disagreements persist as user-level facts. |
| Routines | User-editable Markdown+YAML files defining every AI behavior — triggers (manual/event/scheduled), tool allowlist, autonomy cap. "What Locus does on its own." |
| Memory / the wiki | On-device Markdown knowledge base of what Locus knows about you, rendered as an editable knowledge tree. |
| Autonomy modes | Ask / Standard / Auto — how much the agent may do alone. Auto-executed actions are always undoable and show a done-card with Undo. |
| Presence | Nudge-loudness control: quiet / normal / frequent templates over five nudge families. "How Locus speaks." |
| The breathing dot | Menu-bar liveness mark while a session runs; echoed in the concentric-rings brand mark. |
| BYO / harness | Bring-your-own AI: Claude Code or Codex subscription, or an API key, driven by Locus as its engine. |
| Locus Remote / Remote credits | Locus-supplied compute through a no-prompt-storage relay, paid with prepaid one-off any-amount credits metered by use. Optional; never part of the plan or trial. |
| Model lanes (fast/deep) | Internal routing: quick classifications on the fast lane, agentic work on the deep lane. |

## Brand Voice

**Tone:** Coach — warm, honest, accountability-partner. Direct without being clinical. Confident about the AI without badging it. New emphasis from the product's own voice rules: *observation over judgment* ("make the day readable," never "optimize your day"). The line that captures it: *"Turn today's mess into tomorrow's structure. A little less chaos tomorrow."*
**Style:** plain sentences, short clauses, nouns over adjectives, concrete over abstract. Anti-hype.
**Personality:** honest, steady, observant, native-Mac-crafted, AI-confident.
**Anti-patterns:** Stoic-philosopher register, editorial flourishes, surveillance framing, over-claiming, "optimizer" salesmanship.

## Proof Points

**Metrics / customers / testimonials:** none public yet — pre-launch posture unchanged. Capture 3–5 real quotes during beta.
**Value themes:**
| Theme | Proof |
|-------|-------|
| The day becomes legible | Sentinel timeline + digests: show a real messy day rendered readable. |
| Tomorrow gets structured from today | Smart Plan drafted from the objective + what the system learned; digest → suggested structure. |
| The AI is yours | Routines as readable files; Memory as an editable wiki; Undo on every autonomous action. |
| Your data stays yours | Files on disk you can reveal in Finder; lock-screen state still lets you export everything. |
| Runs on the AI you already pay for | Provider picker: Claude Code, Codex, API keys — or Locus Remote on prepaid credits. |
| Native Mac craft | Menu-bar widget, voice input, Sparkle updates, Tahoe APIs, no Electron. |

## Goals

**Business goal:** drive Mac downloads → in-app 30-day trial → paid conversions.
**Funnel:** download-first (confirmed; no waitlist).
**Conversion actions:** primary "Download for macOS" (hero + pricing); secondary: scroll to the demonstration section. Note: with no free tier, CTA copy must stop saying "free" about the product — the *trial* is free, the download is just the download.

---

## Live page state (2026-08-17 — statement-page reset)

`/` is now **Hero → Manifesto → Pricing** (+ footer), ~4,800px at 1440w — 32% of the previous ~14,900px. Same day the site flipped to a **light theme** (canvas `#ECF1F8`, navy ink, Cobalt accent; hero footage graded toward Cobalt so it doesn't vanish on white) and type sizes came down a notch (manifesto reads at 15/16px). Retired the same day (code + media deleted, git-recoverable): Transformation portal scrub, AppDemo/HeroWidget, Flywheel tour, "A day in Locus" placeholder, Armor/Reactor scrub, and the **FAQ** section (its trial/refund/privacy answers remain covered by the pricing assurances, `/download`, `/privacy`, `/terms`; `src/content/faq.ts` is gone). Nav is Manifesto · Pricing · Changelog; hero secondary CTA is "Read the manifesto" → `#manifesto`. Hero subhead is now the manifesto's spine and nothing else: *"One system you can trust with your whole day. Stay present today, learn from every day, and let the small changes compound."* — Luis dropped the local-first/BYO sentence from the hero (those live in the manifesto decisions and the pricing rail). "Work got faster. Life got fuller…" is retired.

**Manifesto** (`src/content/manifesto.ts`, Luis's copy, superlogical.com as the model): "We are building a system you can trust with [your whole day.]" → born-of-necessity opening → GTD trusted-system idea → "Every day is a battle" (present to win the day, learn to win the war) + fragmentation of intent/plan/actual/rest → two ideas as pull-quotes (compound interest "eighth wonder" — attribution line reads *Credited to Albert Einstein (unconfirmed)*; James Clear "fall to the level of your systems" — *Atomic Habits*) → the app's three parts, in the app's own sidebar words (**Execution** = Focus + Watch; **Inputs** = Notes/Tasks/Commitments; **AI** = Intelligence/Memory/Flywheel) → six design decisions (local-first · BYO AI: "plug in a great harness — Claude Code or Codex — as the brain; Locus is the armor: sensors, tools, UI" · choose your model: subscription, API key via a provider like OpenRouter, or Locus Remote · day feedback loop · routines are files · memory you can correct) → pointer to the **design ideas blog** (Luis is building it; `manifesto.blog.href` is unset until then, so it renders as plain text) → "We hope you enjoy it. — Luis" (first name only, on request). Deliberately keeps his register ("battle/war", "gigantic noise") — a signed letter, not section copy. Deep-dive pages are **not** on this site.

## Page-copy gap analysis (the punch list for the landing-update pass)

Verified against the live code 2026-07-06. **No page code changes in this doc pass — this is the blueprint.** Full detail in `PRD_landing_redesign.md`.

1. ~~**`src/content/faq.ts`**~~ — ✅ moot 2026-08-17: FAQ section and content module deleted with the statement-page reset. (Was: "free Loop tier," "Pro AI features," free/Pro offline split: all dead concepts. "Friday review… in-app and by email": email digests are disabled — in-app only. Privacy answer describes the old backend-orchestrated architecture — rewrite around local-first + BYO. The macOS Tahoe requirement claim is **correct** — keep.)
2. **`src/content/download.ts`** — "free DMG… sign in when you want your account, trial, or Pro features" → no Pro; reframe as "download, 30-day trial starts in-app." ✅ done 2026-08-17.
3. **`src/content/privacy.ts` / `terms.ts`** — "Pro" subscription language throughout; refund is 30-day ✓; both name Locus Remote / Remote credits since 2026-08-17; privacy can now truthfully go much further on local-first.
4. **`src/lib/account/derive.ts`** — "Free/Trial/Pro" labels, hardcoded "Start 7-day Pro trial" → new license model (`trialing / standard / remote / expired`; marketing shows it as one plan + optional Remote credits), 30 days. ✅ Trial length aligned 2026-08-17; "Pro" label cleanup still open.
5. **`src/content/hero.ts` + `layout.tsx` + OG images** — ✅ RESOLVED 2026-07-06: hero stays "The missing OS for modern work" with the "AI-native execution OS" badge (user-locked); subhead extended to carry local-first + BYO; "free" removed from CTAs.
6. **`src/content/pricing.ts`** — repriced 2026-08-17 (one plan, 30 days, $3/$30, Locus Remote credits rail ✓). Same day, user cut the "Everything, on day one" Focus/Sentinel/Review feature triptych from the section ("doesn't belong there") and asked for the whole section to stay concise: headline → price row → Choose-your-AI rail → assurances. Feature storytelling lives in the other sections, not on the price. Fix: "Friday review… and by email" (email off); "Live AI classification" wording fine; consider surfacing Routines/Memory/Autonomy in the feature list.
7. **Missing from the page entirely:** the July headline features — Routines, Memory, Autonomy+Undo, Presence — and any screenshots of them (current 8 screenshots predate July; no Routines/Memory/Presence captures exist yet in `pomodoro-preview/marketing/`).
8. ~~**Unrendered sections**~~ — ✅ cut 2026-08-17: `persona-section.tsx`, `depth.tsx`, `review.tsx` deleted.

## Open items

1. ~~Final public category label + hero~~ — ✅ decided 2026-07-06: "The missing OS for modern work." + "AI-native Execution OS" both stay (user call: the ambitious category claim wins the hero; descriptive truth lives in the subhead).
2. ~~Trial 7→14 days~~ — ✅ RESOLVED 2026-08-17: everything is 30 days (app, locus-api, site API, `derive.ts`, `/account`).
3. **iOS companion** — old claim, no evidence in product repo. Confirm with the user before it appears anywhere.
4. **New screenshots** — Routines, Memory, Presence captures needed from `pomodoro-preview/marketing/` pipeline.
5. **Real customer quotes** — capture during beta; unblocks social proof.
6. **Stripe prices** — create/confirm the **$3 monthly** and **$30 yearly** Stripe prices and point `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_YEARLY` at them (Vercel env, not in repo). Remote credit packs ($5/$10/$20 one-time) are sold from `/account` too as of 2026-08-20 — set `STRIPE_CREDIT_PRICE_IDS` to the live ladder in Vercel. The site creates the Checkout session and grants into the same `app.credit_ledger` the Mac app reads, so a balance bought either way is one balance.

---

## Source of truth

The product repo is `/Users/cippa/Desktop/fly/pomodoro-preview`. Authoritative, freshest-first:
- `CONTEXT.md` (local-first + BYO glossary), `docs/adr/0001` (local-first, account-as-license), `docs/adr/0003` (no free tier), `docs/adr/0008` (thin model proxy, Codex engine), `docs/design-docs/day-feedback-loop.md` (north star + voice), `docs/design-docs/entitlements.md` (license/trial/lock), `docs/glossary.md` (terminology; its "Pro tier" section is stale).
- ⚠️ The product repo's own `README.md` and `ARCHITECTURE.md` are **pre-pivot and stale** (they still describe Free/Pro and a server-orchestrated OpenAI/Gemini backend). Don't source claims from them.
