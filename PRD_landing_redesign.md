# [A.10] Landing page redesign — positioning, voice, and architecture

## Problem Statement

Today, a visitor who lands on the Locus marketing site sees a polished but **architecturally confused** page. The hero headline is retrospective ("Know where your hours actually went") while the product is forward-looking (plan → execute → verify). The page splits the core product story across four thin sections (Loop, FeatureTour, DailyRun, AI) that repeat each other and never cohere into a single, visible demonstration of what Locus actually does. Copy drifts between three registers — Stoic ("before the day carves you"), technical ("you get the verdict"), and generic category-speak ("a macOS focus system for sessions, projects and habits") — which reads as amateur and leaves the visitor without a sharp sense of who the product is for or how it's different.

From a visitor's perspective:

- *"I still don't understand exactly what this app does differently."*
- *"Which one of these sections am I supposed to pay attention to?"*
- *"I saw four screenshots that looked similar — is this just another Pomodoro timer with charts?"*
- *"It mentions 'Command view', 'three moments', 'four verbs' — is there a glossary I missed?"*

The landing page buries Locus's actual differentiator (the AI planner and AI monitor together closing the gap between long-term goals and day-to-day execution) behind feature tours of each capability taken in isolation. The visitor leaves without feeling the *combination*.

## Solution

We redesign the landing page around the committed positioning: **Locus closes the gap between long-term goals and day-to-day execution, with an AI planner, an AI monitor, and a Friday review that tells the truth.** Every section earns its place against that thesis; sections that don't, go.

The page collapses from eleven sections to six. The plan-monitor-review loop is consolidated into a single, scroll-pinned "A Day in Locus" showpiece, anchored to one concrete, visible user goal ("Finish the Q2 strategy doc") that the reader sees *travel through the day* in one orchestrated section instead of being re-introduced four times. The hero promises a forward outcome ("Finish the things you keep starting") in a committed Coach voice — warm, honest, accountability-partner. The brand mark pulled from the macOS app icon (concentric rings / reticle) replaces the placeholder blue dot in the nav and footer, and the web accent aligns to the app's Cobalt primary.

From a visitor's perspective after the redesign:

- *"Oh — it's not a timer. It's a bridge between what I said I'd do and what I actually did."*
- *"I can see one goal travel across a whole day, with the AI catching me when I drift."*
- *"The tone feels like something that wants me to succeed, not something that wants to scold me."*
- *"It's clear in two scrolls what this is, who it's for, and what I'd do on a Tuesday with it."*

## User Stories

1. As a first-time visitor, I want the hero to tell me in one sentence what the app will do for me, so that I can decide in five seconds whether to keep reading.
2. As a first-time visitor, I want the hero sub-headline to name the three mechanisms in one pass (planner, monitor, review), so that I understand the product shape before I see any screenshot.
3. As a first-time visitor, I want a primary CTA that I trust (labeled with whether it costs anything), so that I'm not afraid to click it.
4. As a skeptical visitor, I want to see the app doing real work on a realistic goal, so that I can judge whether it would actually help me.
5. As a scroll-as-you-read visitor, I want the "A Day in Locus" section to pin and advance on scroll, so that a sequence of scenes (morning plan → session running → AI verdict → end of day) unfolds in one continuous motion rather than as separate disconnected sections.
6. As a visitor with a specific goal in mind, I want to see the same user goal visible in every stage of the showpiece, so that I grasp what "closing the gap between goals and execution" actually looks like mechanically.
7. As a visitor on a phone, I want the scroll-pinned showpiece to degrade to a stacked, tappable sequence of stages, so that I can still follow the narrative without a broken desktop-only pattern.
8. As a visitor who uses a reduced-motion OS setting, I want the scroll-pinned showpiece to respect that preference, so that my machine doesn't fight my accessibility settings.
9. As an analytical visitor, I want to see what the AI monitor actually does (e.g., classifying the active window as on-project or off-project), so that I believe the mechanism isn't vaporware.
10. As a visitor worried about surveillance, I want the page to state clearly that activity classification runs on-device, so that I'm not forced into the FAQ to find that out.
11. As a visitor who cares about follow-through, I want a section dedicated to the Friday review, so that I understand there's a ritual that closes the loop, not just a timer that ticks.
12. As a visitor with multi-week projects, I want to see how sessions roll up into projects, habits, and tasks over longer arcs, so that I understand Locus isn't just a timer.
13. As a price-sensitive visitor, I want a simple free-vs-paid pricing breakdown with no dark patterns, so that I can compare in under 30 seconds.
14. As a visitor with common blockers, I want an FAQ that addresses the actual questions a real prospect asks (who it's for, how it differs from similar apps, whether it sees my keystrokes, whether it works offline), so that I don't bounce over a concern the page could have answered.
15. As a visitor who already uses RescueTime/Rize/Motion, I want the page to implicitly show what Locus does that they don't (the combination of planner + monitor + review anchored to a goal), so that I form the differentiation myself rather than seeing a comparison table.
16. As a macOS-only visitor, I want the page to make the Mac-only scope visible without apology, so that I'm not misled if I'm on Windows or Linux.
17. As a visitor returning for the second time, I want the nav to carry a real brand mark (not a generic dot), so that the site feels like a product that's ready to be paid for.
18. As a visitor who opens the tab in the background, I want a favicon that's recognizable at 16×16, so that I can find my tab.
19. As a visitor who shares the page, I want an OpenGraph image that reflects the brand and the headline, so that the preview in Slack/iMessage/Twitter is coherent.
20. As a keyboard-only user, I want every interactive element in the showpiece (stage selectors, links, CTAs) to be reachable and operable via keyboard with visible focus, so that I can use the site without a mouse.
21. As a screen-reader user, I want the scroll-pinned sequence to be understandable as a linear list of stages, so that the visual choreography doesn't create a black hole for my assistive tech.
22. As a late-stage visitor, I want a clear, single "get started" path on the pricing section, so that I don't need a separate end-of-page CTA band to find the action.
23. As a visitor on slow internet, I want the hero's primary screenshot to load fast and later screenshots to load lazily, so that the page is usable before everything downloads.
24. As an engineer maintaining the site, I want the showpiece's content to live in a single typed content module, so that I can change copy, stage order, or the goal anchor without touching the section component.
25. As an engineer, I want the scroll-to-stage mapping to be a separately testable hook, so that I can verify stage selection logic without a browser.
26. As an engineer, I want the brand mark to be a single component sourced from the canonical SVG, so that swapping the mark anywhere propagates everywhere.
27. As an engineer, I want the removed sections' content and component files cleanly deleted (not left as orphaned shells), so that future contributors don't wonder which is canonical.
28. As an engineer, I want favicon/app-icon wiring that follows Next.js App Router conventions, so that no custom `<head>` plumbing is needed.
29. As a visitor who returns after six months, I want the copy to be as relevant as today, so that feature-specific details (window-title classifier, weekly review) still read as the product's core story rather than as marketing decoration.
30. As the business, we want the landing page to have one dominant conversion path (download/free trial) and not dilute it with multiple competing CTAs, so that traffic converts on a clear funnel.

## Implementation Decisions

### Information architecture

- The page collapses from eleven sections to six: Hero, "A Day in Locus," Friday Review, Depth (projects/habits/tasks), Pricing, FAQ.
- The sections Loop, FeatureTour, DailyRun, AI, TrustStrip, and CtaBand are removed. Their content and component files are deleted in this PRD, not left as deprecated shells.
- "A Day in Locus" is the page's main event: a scroll-pinned ("sticky stack") showpiece where the section pins to the viewport while the user scrolls through discrete stages. The stages represent a single realistic day: morning plan → live session with AI verdict → drift caught → end of day. All stages reference one visible user-goal anchor: "Finish the Q2 strategy doc." That anchor is authored once in content and is visible in every stage's UI.
- Friday Review remains its own section because it's a weekly ritual, distinct from the daily loop.
- Depth remains its own section to carry the "longer arcs" (projects, habits, tasks) narrative that the showpiece deliberately does not cover.
- Pricing remains structurally as-is (Free vs Pro, monthly/yearly toggle). Copy is re-voiced.
- FAQ is rewritten: existing tactical questions are re-voiced; three to four strategic questions are added (who is this for, how is it different from similar apps, whether the AI monitor sees keystrokes, what happens if a session is missed).

### Brand & visual system

- Primary accent moves from the current lighter blue to Cobalt `#0047AB`, to align with the macOS app icon. A darker hover tint and a low-opacity "subtle" tint are added to the token palette. The existing `--alive` green and `--warn` red remain.
- A single new `Logo` component renders the concentric-rings mark from the canonical master SVG included in the iconset. It accepts a `size` prop and a `variant` (default Cobalt fill, or monotone for contexts where accent color is off). Every site surface that currently renders a literal blue dot next to the wordmark (nav, footer) swaps to `<Logo />`.
- Favicons and app-icons are wired using Next.js App Router conventions (convention-based `icon` and `apple-icon` files in the app root), drawing from the PNG sizes already in the iconset.
- OpenGraph imagery is regenerated or updated to reflect the new hero headline and Cobalt accent; the existing OG generation module is extended rather than replaced.

### Copy & voice

- All body copy on the landing page is rewritten in a committed **Coach** register: warm, honest, accountability-partner. Stoic, clinical, and editorial registers are not acceptable.
- Hero headline: "Finish the things you keep starting." Subheadline names the three mechanisms (planner, monitor, Friday review) in one pass.
- Internal jargon ("Command view," "verdict," "three moments," "four verbs") is banned from the landing page unless it's immediately defined on first use. Prefer plain-language equivalents.
- Competitor names are not used on the page; differentiation is conveyed by showing the combination working, not by comparison.

### Content module design

- A new `dayInLocus` content module is the single source of truth for the showpiece. It exposes: the user-goal anchor string, an ordered list of stages, and per-stage data (stage id, time-of-day label, title, body caption in Coach voice, screenshot reference with alt text, optional AI-verdict detail for stages that feature the monitor). Screenshot references point to existing assets in the public screenshots directory where possible, and new captures are added to that directory if needed.
- Content modules for the removed sections (loop, featureTour, dailyRun, ai) are deleted.
- `hero`, `faq`, `depth`, `review`, and `pricing` content modules are edited in place; their shapes do not change (except FAQ, which gains new item ids).
- FAQ items must each have a stable `id`, a question string, and an answer string. New items added in this PRD must include `id`s that won't collide with existing ones.

### Scroll-pinned showpiece — behavior contract

- The section enters the viewport, pins, and the user's scroll drives a progress value from 0 to 1 across a fixed scroll distance (authored per-stage — roughly one viewport-height of scroll per stage). At any given progress, exactly one stage is "active"; adjacent stages cross-fade rather than cut.
- The user-goal anchor is always visible at the top of the pinned frame.
- Active-stage changes are keyboard-reachable: a vertical list of stage labels beside (or under) the screenshot is a real `role="tablist"` with arrow-key navigation, so keyboard and screen-reader users get a semantic path that does not depend on scroll.
- On viewports below the tablet breakpoint, the showpiece degrades to a vertically stacked list of stages (no pinning, no scroll-hijack). Each stage renders its full content inline.
- When the user's OS reports `prefers-reduced-motion: reduce`, the pinned/transitioned behavior is skipped and the same stacked fallback is used on desktop as well.
- The scroll-to-stage mapping (progress → active stage index) is extracted into a shared hook so the math can be tested in isolation and reused if another section (e.g., Friday Review) later adopts a similar pattern.

### Motion and animation library choice

- Framer Motion is the only animation library used in the showpiece tree. GSAP / ScrollTrigger are not introduced. The codebase is Framer-heavy, and the design-taste rules forbid mixing these libraries in the same component tree.
- Perpetual animations already in the repo (breathing dot, spring reveal) are preserved. A budget audit trims any perpetual loop that isn't visible on screen in the final section inventory.

### Conversion model

- The landing page has one primary CTA: download / get Locus. The hero has one primary + one secondary CTA (the secondary anchors to the "A Day in Locus" section). The Pricing section carries the second primary CTA. The standalone CtaBand is removed.
- The download link currently points to the `/download` route and that stays the canonical destination.

### Accessibility

- All interactive elements in the showpiece are keyboard-operable with a visible focus indicator.
- All screenshots have descriptive alt text authored in the content module (not in the component).
- Headings follow a strict single-`h1`, progressive-`h2`-then-`h3` hierarchy across the page.
- Color contrast is re-verified with the new Cobalt accent for body text, button labels, muted text, and focus rings.

### Performance

- The hero screenshot is marked priority-loaded; all other screenshots lazy-load.
- Scroll handlers for the pinned section use Framer's `useScroll` and `useTransform` (which run outside the React render cycle), not `useState` or `window.addEventListener('scroll')`.
- The perpetual motion budget is capped; the breathing dot remains, other infinite loops are audited for on-screen presence in the surviving sections.

### Out-of-scope guardrails embedded here

- No auth, no logged-in area, no Stripe wiring, no account pages in this PRD. Any references to those are deferred to future PRDs.
- No change to the macOS app icon itself; the web aligns to the app, not the reverse.

## Testing Decisions

Good tests in this repository cover **external behavior that a user or a consumer of a module can observe** — not internal implementation. The prior art is: content modules are asserted against their schema (e.g., loop content asserts the verb ordering); a small number of section components carry smoke tests; layout primitives carry component tests; Playwright covers end-to-end smoke and axe-core a11y.

Scope for this PRD, per user decision: **exactly one new test module** is in scope.

- The `useScrollStages` hook gets a pure-logic unit test. Given a number of stages and a simulated scroll progress between 0 and 1, the hook must resolve to the correct active stage index at key boundaries (start, each stage midpoint, each stage transition boundary, end). The test does not touch the DOM, does not render a component, and does not require jsdom scroll simulation — it invokes the pure mapping function that backs the hook.

Out of scope for this PRD (deferred to a follow-up test sweep):

- Content-schema tests for the new `dayInLocus` module.
- Updates to existing `hero.test.ts` and `faq.test.ts` (which will fail once copy changes; these must be minimally repaired as part of landing the PRD but no new assertions are added here).
- Component tests for the scroll-pinned section (scroll is hard to simulate in jsdom; defer).
- Playwright smoke and axe-core additions (deferred; existing coverage from prior PRDs remains).
- Visual regression (no Chromatic/Percy setup in-repo).

## Out of Scope

- Authentication, user accounts, session management.
- Stripe integration, billing portal, paywalled features.
- Any backend service or database.
- Changes to the macOS app icon or app branding in the Mac client.
- Changes to the Mac app's marketing assets beyond what the landing page uses.
- New testimonials, press logos, user counts, or any social-proof content (deferred until real beta quotes are available).
- Changes to the pricing model or pricing structure (copy revoice only).
- Changes to the `/privacy`, `/terms`, `/download`, `/changelog`, `/pricing` routes' page shells (content may be re-voiced; structure is unchanged).
- Changes to the appcast (`appcast.xml`) or SEO sitemap beyond what the redesigned pages naturally pick up.
- Internationalization / translation.
- A CMS migration; content remains in typed TypeScript modules.
- Dark-mode / light-mode toggle (site remains dark-only for now).
- A test sweep beyond the single `useScrollStages` hook test.

## Further Notes

- The brand mark lives in the repository as the macOS app's master SVG (already committed in `public/brand/AppIcon_Cobalt.iconset/icon_master.svg`). The `Logo` component extracts the rings-only variant for web use (the Cobalt tile background is dropped when the mark sits beside the wordmark).
- The full decision record — ICP, JTBD, voice, architecture, hero direction, goal anchor, brand mark — is persisted in the project memory file so that future sessions don't re-open settled questions. Any PR that diverges from those decisions should reference and update that file.
- Three marketing skills from the `coreyhaines31/marketingskills` pack were identified during the grill (`product-marketing-context`, `copywriting`, `page-cro`) but are not currently installable because the local `skills` CLI isn't set up. Installing the CLI and running `product-marketing-context` is a cheap pre-flight before the copy rewrite pass; not a blocker.
- The redesign intentionally launches without social proof. A dedicated follow-up PRD should ship a testimonials / trust section the day real beta quotes exist.
- The repository's convention for issue codes is `[A.N] <title>`. Issues #7–#12 covered earlier landing-page work; this PRD is proposed as `[A.10]`.

---

**Labels:** `realdeal-2026`, `redesign`
