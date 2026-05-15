# Product Marketing Context

*Last updated: 2026-04-25*
*Status: V1 — confirmed with user 2026-04-25.*

## Product Overview
**One-liner:** Locus is the **AI-native Execution OS** for your goals on macOS — the one app you open every day to make sure you're actually moving on what matters.
**User's verbatim framing:** "An AI-native super operational system" — "the user's executional operational system, the one app he will use every day to ensure he is on track for his goals."
**What it does:** A new category. Locus combines an AI planner, a real-time AI work classifier, and an AI Friday-review summarizer into a single execution layer — every session, project, habit, and task anchored to the goals you actually care about. The same app that starts your morning carries the shape of your year. AI runs the thinking parts; you run the day.
**Product category:** **New category — AI-native Execution OS / personal operational system for goals.** Locus does not position on the focus-app or time-tracker shelf. The play is Linear-/Superhuman-style: don't compete inside an existing category, name a new one and demonstrate it.
**Product type:** Native macOS app, B2C SaaS (single-seat subscription). iOS companion targeted for end of Q2 2026 (~June 2026).
**Business model:**
- Free: $0 forever — sessions, projects, habits, tasks, menu-bar timer, weekly review view.
- Pro: $6/mo or $58/yr (saves $14/yr) — Plan My Day, AI activity classification (on-track vs off-track), AI weekly review chart + project breakdown, priority email support.
- 7-day Try Pro unlock from inside the app, once per account, no payment.
- 30-day no-questions refund.

## Target Audience
**Target market — broadest possible TAM:** anyone who relies heavily on personal productivity and works on a Mac. **No vertical narrowing — no profession, no company size, no career stage gates.** If you have ambitious goals and you sit at a Mac, you're in scope.
**Decision-makers:** The user is the buyer.
**Primary use case:** Make sure the things that matter actually move — every day, every week — instead of slipping past while the calendar fills up.
**Jobs to be done:**
- "Make sure I'm on track for the goals I actually care about."
- "Start the morning with a plan I'll actually follow."
- "Catch me when I'm drifting, before I lose the afternoon."
- "Tell me on Friday what the week was actually for."

**Use cases / scenarios (illustrative, NOT narrowing):**
- Founder protecting deep-work hours against the inbox / Slack churn.
- Researcher / engineer / writer keeping a long-running deliverable moving while reactive work piles up.
- Anyone who's tried Toggl / RescueTime / Pomodoro apps and felt tracked but not helped — they want a system, not another timer.
- Anyone using a Notion+Cal+Toggl DIY stack who's exhausted by the glue tax.

## Personas
B2C — single persona, intentionally broad to match the broadest-TAM strategy.

**Primary persona — "Mac power user with ambitious personal-productivity goals":**
- **Cares about:** moving on the goals that matter, not just looking busy. Their identity is tied to shipping the long thing.
- **Challenge:** the urgent crowds out the important; by Friday they can't reconstruct where the week went; existing tools either track time without intervening or schedule the calendar without watching the work.
- **Value we promise:** one app — open every day — that picks the day's real work, watches the work as it happens, and shows them on Friday what actually moved. Powered by the best AI models so the planner, classifier, and review are actually good.

## Problems & Pain Points
**Core problem:** The week ends and the long-running goals haven't moved — even though every day felt full. The gap between intention and execution compounds quietly until a deadline forces a reckoning.
**Why alternatives fall short:**
- Timers (Pomodoro, Session, Toggl) measure time but don't pick the work or notice drift — the user has to be their own coach.
- Trackers (Rize, RescueTime, Timing) tell you where the time went after the fact, but don't intervene during the day or anchor to a goal.
- Planners (Motion, Sunsama, Reclaim) shape the calendar but don't watch what actually happens once you sit down to work.
- DIY stack (Notion + Calendar + Toggl + a focus app) requires the user to glue four tools together and stay disciplined across all of them — which is the exact discipline problem they came in with.
- "AI productivity" tools that tack on a chatbot but don't change the shape of the day.

**What it costs them:** Slipped deadlines, missed milestones, the slow erosion of believing they can finish ambitious things. Hours per week of context-switching tax. The emotional cost of being the person who said they'd ship it.

**Emotional tension:** "I'm working hard but I'm not sure it's adding up." Quiet shame about half-finished projects. Optimization-app fatigue — they've tried six of these.

## Competitive Landscape
*Per positioning decision, the landing page itself NEVER names competitors. Internal context only.*

**Important framing:** Locus is positioning as a **new category** — AI-native Execution OS — not as a better entrant in an existing one. The point of this section is to understand what the user is currently using and why those tools leave the gap, NOT to compare feature-by-feature on the page.

**What customers are using today:**
- Calendar planners (Motion, Sunsama, Reclaim) — shape the day, don't watch the work.
- Trackers (Rize, RescueTime, Timing) — backward-looking, no goal anchor.
- Single-purpose timers (Pomodoro, Session, Toggl) — measure time, don't pick the work.
- DIY stacks (Notion + Cal + Toggl) — high glue tax.
- Blockers (Cold Turkey) — punitive, wrong register.
- Manual systems (paper, spreadsheets, accountability partner) — works for some, doesn't aggregate.

## Differentiation
**Key differentiators:**
- **The category itself** — AI-native Execution OS is a new shape. Not a planner, not a tracker, not a timer. Three pieces (AI planner + AI classifier + AI Friday review) tied to one goal you can see all day. No competitor ships the whole layer.
- **AI-native, not AI-bolted-on** — the planner, the classifier that catches drift, and the weekly review are all AI-driven. Locus doesn't tack a chatbot onto a tracker; the AI *is* the system.
- **Built on the best models** — leading frontier AI models, called via Locus's backend. (Internal: OpenAI + Anthropic. **Public-facing copy keeps providers unnamed** — user preference 2026-04-25.) We don't ship a watered-down local model to look "private" at the cost of being weak. The intelligence has to be good for the system to earn its place.
- **Goal-anchored everything** — every session, project, habit, and task references a goal you set. The day on screen is always a day in service of something.
- **Coach voice, not surveillance voice** — the product takes a stance against the punitive register of trackers. Catches drift gently, once. Doesn't shame missed days.
- **Native-Mac craft** — menu-bar breathing dot, Sparkle auto-update, macOS Tahoe APIs. Not an Electron port.

**How we do it differently:** The day is shaped *before* it starts (AI planner), monitored *during* (AI drift catch), and reviewed *after* (AI Friday summary) — and all three reference the same goal you named in the morning. Most tools handle one of those three.

**Why that's better:** You stop having to be your own operating system. The system carries the structure — and because it runs on the best models, the suggestions are actually worth following.

**Why customers choose us over alternatives:** Because they've already tried the single-purpose tools and the DIY stack, and the thing that's actually missing is a layer that *runs the day* — picking the work, watching the work, reporting on the work — not another tool to manage.

## Privacy & AI data handling

**Posture (per user, 2026-04-25):** Don't lead with privacy. Don't make sweeping "on-device" claims — we DO send data to our backend, which calls leading AI models. Be honest, be brief, move on.

**Two rules locked 2026-04-25:**
1. **Three privacy clauses are literally true and approved for use on the page:** we don't store logs, we don't train on the data, we don't tie it to the user's account.
2. **Model providers stay unnamed in public-facing copy.** Internal context can name OpenAI + Anthropic (they're our backend reality); the page says "leading AI models" / "the best AI models" without naming them.

**On the landing page:**
- **REMOVE** the on-device claims currently in: hero subhead, A Day in Locus drift-catch caption, three FAQ answers ("activity classification runs on-device", "window titles never leave your Mac", "All timing, classification and review happen on-device").
- **REPLACE** with a single short, honest FAQ entry. Approved working draft:

  > **Q: What does the AI see, and where does it run?**
  > A: Locus uses leading AI models to plan your day, classify what you're working on, and write your Friday review. Window titles, project names and session metadata are sent through Locus's backend to those models. We don't store logs, we don't train on the data, and it isn't tied to your account when it's sent. If you'd rather not share any of that, the free Loop tier (sessions, projects, habits, tasks) needs none of it.

## Objections
| Objection | Response |
|-----------|----------|
| "Another focus app — I've tried five." | We're not a focus app. Show the day-in-Locus scroll: AI planner + AI classifier + AI Friday review tied to one goal. The execution layer is the product. |
| "Why $6/mo when there are free timers?" | Free tier keeps the loop forever (sessions/projects/habits/tasks). Pro is the AI brain — planner, classifier, review. 7-day Try Pro from inside the app, 30-day refund. |
| "What does the AI see / where does my data go?" | Honest, brief FAQ entry: window titles + project names + session metadata go through our backend to leading AI models. Not stored, not trained on, not tied to your account. (See Privacy section. Providers stay unnamed in copy.) |
| "macOS only?" | Yes today. iOS companion targeted for end of Q2 2026 (~June 2026). Windows/Linux not planned. |
| "What if I miss a day or skip sessions?" | Nothing breaks. Skipped days don't scold; chains are meant to break sometimes. The weekly review tells the truth without shaming. |
| "Why should I trust the AI to plan my day?" | Because it's not a chatbot bolted on — it's the substrate. Built on leading frontier models. And you stay in charge: the plan is a draft you accept, not a decree. |

**Anti-persona:**
- Teams looking for a manager-visible productivity dashboard. Locus is single-user and refuses to surface activity to anyone but you.
- Users on Windows / Linux / web (today).
- Users who want hard blocking (Cold Turkey-style punishment). Locus nudges; it doesn't punish.
- Users who object to ANY work metadata going to a third-party AI model, even de-identified. The free Loop tier covers them; Pro isn't for them and that's fine.

*Note: we do NOT narrow by profession or career stage. ICP is intentionally broad — anyone who relies heavily on personal productivity and works on a Mac.*

## Switching Dynamics
**Push (away from current solution):**
- "I'm tracking time but my goals still aren't moving."
- "My planner makes a beautiful schedule and then the day eats it."
- "My DIY stack of four apps is itself the discipline problem."
- "The AI in my current tool is a glorified chatbot — it doesn't actually run anything."

**Pull (toward Locus):**
- An AI planner, an AI classifier, and an AI review *all anchored to the goal I named this morning*.
- One app to open every day instead of four.
- Built on leading models — the suggestions are actually worth following.
- A coach voice that doesn't shame me on the days I miss.
- Native Mac craft — feels like the OS, not a wrapper.

**Habit (what keeps them stuck):**
- Sunk cost in their existing tool's data and configuration.
- Calendar already wired to a planner like Motion or Sunsama.
- "I should just be more disciplined" — self-blame substituting for tool change.

**Anxiety (about switching):**
- "Will I lose my time-tracking history?" (No import path today.)
- "Is this just another app I'll abandon in three weeks?"
- "What does the AI actually do with my data?" (Answered briefly and honestly in FAQ.)
- "Will it work on my older Mac?" (macOS Tahoe required for now; older macOS support will come later.)

## Customer Language
**How they describe the problem (no real beta quotes yet — placeholders below; replace once captured):**
- "My calendar is full but my week doesn't always move."
- "I set ambitious targets and then lose the plot mid-week."
- "I can't account for where the hours went."
- "I keep starting things and not finishing them."

**How they describe Locus (aspirational — no real testimonials yet):**
- "It's the operating system for my day."
- "Finally, one app that picks the work, watches the work, and reports back."
- *[TODO during beta: capture 3–5 real quotes.]*

**Words to use:**
- execution, on track, the day, the week, the work, the goal, anchor, move, ship, finish, the loop, the AI brain, the thinking parts, what actually moved, gently, once, every day, AI-native, leading AI models, frontier models
- Coach register: warm, honest, accountability-partner

**Words to avoid:**
- **on-device, on your Mac, never leaves your Mac, locally** — REMOVED from the playbook 2026-04-25 (untrue + we don't want to lean on privacy as a structural claim)
- "totally anonymous" / "fully private" — too sweeping; use specific clauses ("not stored, not trained on, not tied to your account") if discussing privacy at all
- **Named model providers** (OpenAI, Anthropic, GPT, Claude) — kept out of public copy per user preference 2026-04-25. Use "leading AI models" or "frontier models" instead.
- track, surveil
- hustle, crush, dominate, 10x, beast mode, grind
- shame, punish, lock, block (Cold Turkey vocabulary — wrong register)
- productivity (generic; we're more specific than that)
- "AI-powered" as a buzzword — show what the AI does. "AI-native" is OK because it signals architectural choice, not feature badge
- Stoic / clinical / editorial flourishes — drift toward this is the "amateur feel" the user previously flagged

**Glossary:**
| Term | Meaning |
|------|---------|
| Execution OS | The new category. The one app you open every day to stay on track. |
| AI-native | The AI is the substrate, not a feature. Planner, classifier, review are all AI-driven. |
| The loop | Sessions → projects → habits → tasks. The free tier. No AI required. |
| The AI brain / The thinking parts | Planner + classifier + Friday review. The Pro tier. Runs on OpenAI + Anthropic. |
| Plan My Day | The AI planner that blocks out the day around your goal. |
| The classifier (formerly "the monitor") | The AI that catches drift while you work, by classifying the active window vs the session goal. *Consider renaming "monitor" → "classifier" or "drift catch" on page since "monitor" leans surveillance-flavored.* |
| Friday review | The AI weekly summary: sessions, projects moved, chain held. |
| The chain | Habit streak — meant to break sometimes; not a punishment. |
| The breathing dot | Menu-bar indicator that pulses while a session runs. The brand mark echoes this (concentric rings = "the dot"). |
| On-track / off-track | How the classifier classifies the active window vs the session goal. |
| Try Pro unlock | 7-day in-app trial, once per account, no payment. |

## Brand Voice
**Tone:** Coach. Warm, honest, accountability-partner. Direct without being clinical. Pain-aware in the hero ("Finish the things you keep starting") and steady-handed everywhere else. Confident about the AI — doesn't apologize for it, doesn't badge it.
**Style:** Plain sentences. Short clauses. Nouns over adjectives. Concrete over abstract ("Pages — Q2 Strategy.pages" beats "your important document"). Anti-hype.
**Personality (3–5 adjectives):** honest, steady, observant, native-Mac-crafted, AI-confident.
**Anti-patterns to watch for:** Stoic-philosopher register, editorial flourishes, technical drift, surveillance-flavored framing, over-claiming on privacy.

## Proof Points
**Metrics:** None public yet — pre-launch. (Wiring up beta funnel metrics is deferred per user 2026-04-25 — not a blocker for copy review.)
**Customers / logos:** None yet (pre-launch).
**Testimonials:** None yet. TrustStrip cut from architecture until real beta quotes land.
**Value themes:**
| Theme | Proof |
|-------|-------|
| You stay on track for your goals | Day-in-Locus scroll demonstrates plan → work → drift catch → end-of-day rollup against one visible goal. |
| One app, every day | The same app shapes the morning, watches the work, and reports on Friday. No tool-switching. |
| AI-native, built on the best models | Leading frontier models under the hood (OpenAI + Anthropic — internal only; not named in copy). Show the planner, classifier, and review actually working — don't badge "AI-powered" on top. |
| Coach, not cop | "Gently, once." Tone consistent across drift-catch, FAQ, missed-day handling. |
| The loop is forever | Free tier covers sessions/projects/habits/tasks indefinitely — no trial-then-bait. |
| Native Mac craft | Menu-bar breathing dot, Sparkle auto-update, macOS Tahoe requirement for now, no Electron. |

## Goals
**Business goal:** Drive Mac downloads → in-app Try Pro unlock → paid Pro conversions.
**Funnel:** **Download-first** (confirmed). No pre-launch waitlist.
**Conversion action:**
- Primary: "Download for macOS — free" (hero CTA).
- Secondary: "See a day in Locus" (scroll to showpiece).
- Tertiary: "Get Pro" (pricing CTA — though Pro is unlocked from inside the app).
**Current metrics:** Not tracked yet. Worth wiring up after launch (visit→download, download→Try Pro, Try Pro→paid) — deferred per user, not a blocker for copy review.

---

## Page-copy revisions required (the punch list)

These are the concrete strings on the landing page that need rewriting to match the new positioning. Tackled in the next /copywriting pass.

1. **Hero subhead** — "An AI planner blocks out your day, an on-device monitor keeps it honest while you work, and a Friday review shows you what actually moved." → drop "on-device", reframe around AI-native.
2. **A Day in Locus, Stage 3 caption** — "Window title classified on-device. Nothing you typed or scrolled ever leaves the Mac." → rewrite as honest one-liner about classification, or just drop the privacy claim and let the scene speak.
3. **FAQ "Does the AI monitor see what I type or which websites I visit?"** — rewrite to honest version. The AI doesn't read keystrokes/screenshots/URLs — that part is true and worth keeping. The "on-device" claim isn't.
4. **FAQ "Does Locus send my activity to the cloud?"** — currently "No. Activity classification runs on-device." → flip to honest: yes, window titles + project names + session metadata go through our backend to OpenAI + Anthropic, not stored, not trained on, not tied to account. Possibly merge with #3 into one combined FAQ.
5. **FAQ "Does Locus work offline?"** — currently "Yes. All timing, classification and review happen on-device." → rewrite. Timing works offline; classification + planning + review need a connection because they call our backend.
6. **General word swap** — consider renaming "monitor" → "classifier" or "drift catch" wherever it leans surveillance-flavored.
7. **New positioning thread** — weave "AI-native Execution OS" into hero, A Day in Locus intro, and pricing copy. Make sure the page reads as "AI is the substrate" rather than "we have AI features."

---

## Open items still to resolve
1. **Real customer quotes** — capture 3–5 during beta; replace placeholders. Will unblock TrustStrip section.
2. **Beta metrics** — deferred. Add after launch.
