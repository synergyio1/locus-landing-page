---
name: Locus — Midnight Focus
description: >
  A calm, instrument-panel aesthetic for the Locus marketing site. Deep
  navy-ink canvas with a single Cobalt accent and semantic alive/warn tones.
  Editorial type with tight tracking, mono-numeric utility marks, and quiet
  ambient motion (breathing dots, magnetic buttons, conic drifts, hairline
  sweeps). Built to feel like a quiet workbench for deep work — focused,
  unhurried, premium.

# Canonical tokens — mirrors src/app/globals.css :root (verified 2026-07-06).
# globals.css is the source of truth; if this block and the CSS disagree, the CSS wins.
colors:
  bg: "#0A1620"                 # canvas — cold desaturated navy, reads near-black
  surface: "#0E1C28"
  surface-raised: "#132534"     # also --muted
  fg: "#E6EDF3"                 # --fg / on-bg
  muted-foreground: "#8A9BAE"

  # The Cobalt accent SYSTEM. Cobalt #0047AB is dark — it works as a fill
  # behind white text, but NOT as text/stroke on the navy canvas. Hence the split:
  accent: "#0047AB"             # fills: primary CTA, featured tints, rings
  accent-hover: "#00347D"       # hover goes DARKER, not lighter
  accent-subtle: "rgb(0 71 171 / 0.12)"  # soft tints, open-state washes
  accent-text: "#6BA6F2"        # links, accent-colored text/icons on dark
  accent-foreground: "#FFFFFF"  # text on accent fills

  alive: "#3FCF7E"              # aliveness only: breathing dot, on-track, progress
  warn: "#E8556F"               # off-track only; coral-rose, not red
  border: "rgb(255 255 255 / 0.08)"  # always alpha-on-white, never named grey

radius:
  base: "0.625rem"              # --radius (10px); sm/md/lg/xl/2xl derive via calc

typography:
  font-sans: "Geist (next/font, --font-geist-sans)"
  font-mono: "Geist Mono (next/font, --font-geist-mono)"
  # Scale conventions (as built):
  # display: 44–84px, semibold, tracking -0.03em…-0.035em, leading 0.98–1.02 (hero only at 84px)
  # headlines: 30–48px, same treatment
  # body: 14–20px, leading 1.55–1.6, narrow measure (max-w-xl/2xl)
  # eyebrows: sans 12px/0.18em tracking for section intent;
  #           mono ~11px/0.22em tracking for mechanism/metadata — mono = "structural, not emotional"
  # numerics (prices, timers): mono for tabular alignment

motion:
  easing-signature: "cubic-bezier(0.22, 1, 0.36, 1)"   # governs nearly every transition
  keyframes: [breathe 2400ms, spring-reveal 520ms, marquee-x 38–46s, conic-drift 14s, hairline-sweep 3800ms, draw-line 800ms]
  reduced-motion: "globals.css collapses ALL animations/transitions to 0.01ms; JS effects (magnetic, tilt, parallax, scrubbing) short-circuit via use-reduced-motion"
---

## Brand & Style

Locus is a **local-first macOS workspace with an embedded AI agent** — it makes the day legible, coaches focused work, and turns today's mess into tomorrow's structure. The landing page is the product's quiet anteroom: a dim, instrument-grade workbench with a single point of light. Nothing is loud. A breathing dot, a faint grid behind the hero, and slow ambient drifts are the only things that move at rest.

The voice is **Coach** — warm, honest, accountability-partner — matching `.agents/product-marketing-context.md`. The surface personality that carries it is *engineered calm*: editorial headline setting (near-unity leading, tight negative tracking, balanced text) plus instrumented utility marks (uppercase mono eyebrows, step counters, version strings). The product is sold on trust and craft, not novelty. Registers to avoid in copy and UI microtext alike: Stoic-philosopher, clinical, surveillance-flavored.

## Colors

The palette is deliberately narrow: one canvas, one accent system, two semantics.

- **Canvas (`#0A1620`)** — every section shares this background; separation comes from hairline borders, not fills. Surfaces raise only incrementally (`#0E1C28`, `#132534`); the page reads as one continuous dark sheet.
- **Cobalt accent (`#0047AB`)** — the brand color, aligned to the macOS app icon (`public/brand/AppIcon_Cobalt.iconset`). Because Cobalt is dark, the accent is a *system*, not a single value: `--accent` for fills (primary CTA, featured-card tints, focus rings) with white foreground; `--accent-text` (`#6BA6F2`) for links, accent text, and icon strokes on the navy canvas; `--accent-hover` (`#00347D`) darkens on hover. Never put raw `#0047AB` text on the canvas — it fails contrast; that's what `--accent-text` is for.
- **Alive (`#3FCF7E`)** — reserved for *aliveness*: the breathing dot, timer progress, on-track states. Never decoration.
- **Warn (`#E8556F`)** — off-track states and nothing else.
- **Text** — `#E6EDF3` primary, `#8A9BAE` muted. **Borders** are always alpha-on-white (`rgba(255,255,255,0.08)`) so they read as lit glass edges, not drawn lines.

Color is applied in *ambient* doses: `color-mix(in oklab, var(--accent) X%, transparent)` at 4–50% produces halo glows, tints, soft fills, selection (`40%`), and outline color (`50%`) — see `globals.css`.

## Typography

**Geist Sans** for headlines and body; **Geist Mono** for everything instrumented — timers, prices, technical eyebrows, step indices, version strings. Both load via `next/font` in `layout.tsx`.

- Display and section headlines are semibold with negative tracking and near-unity leading — dense and editorial, never airy or poster-like. The hero is the only 84px moment.
- Body copy: generous leading (1.55–1.6), narrow measure, short scannable paragraphs.
- Two eyebrow styles coexist deliberately: **sans eyebrow** marks section intent; **mono eyebrow** marks mechanism and metadata. The switch to mono is a quiet signal: "this is structural, not emotional."

## Layout & Spacing

`max-w-[1400px]` shell, `px-6` mobile / `px-10` from `md`. Sections share `py-20` / `md:py-32` rhythm; the hero breaks it with `min-h-[100dvh]`. Sections below the hero are separated by `border-t` hairlines — never colored bands. Internal rhythm follows Tailwind's 4px scale. Two-column layouts use asymmetric splits with the screenshot side wider. Whitespace is dense, not generous — the premium feel comes from precision, not emptiness.

## Elevation & Depth

Depth on the navy canvas comes from **lit edges, soft ink shadows, and ambient fields** — never heavy blocks or surface gradients.

- **Inset shine** — a 1px white top-line (6–18% opacity) on every raised element simulates overhead light.
- **Ink shadows** — deep, narrow, near-black with strongly negative spread, concentrating depth under the element. Hero-grade frames add a faint accent-tinted bloom so the screen reads as self-lit.
- **Ambient fields** — chroma grid (88px hairline grid, radially masked, behind the hero via the `chroma-grid` utility), halo glows, rim light, conic drift (14s rotating conic via `--angle` `@property`), and a page-wide SVG **noise overlay** (`noise-overlay.tsx`, ~3.5% opacity, blend-overlay) that keeps the flat navy from reading as a dead fill.
- **Glass panels** — nav capsule and sheet surfaces only: 20px backdrop blur, 2–6% white fill, hairline border.

## Motion

Always quiet, always purposeful. One signature easing — `cubic-bezier(0.22, 1, 0.36, 1)` — governs nearly everything.

- **Reveals** — `SpringReveal` / `StaggerGroup` (`src/components/motion/`): 12px translateY + fade, staggered 80–140ms, IntersectionObserver-triggered.
- **Scroll choreography** — `PinnedStage` (`motion/pinned-stage.tsx`) pins a section while scroll drives progress; `useFrameScrubber` (`motion/use-frame-scrubber.ts`) maps that progress onto a preloaded image-frame sequence. These two power the Transformation section (121 webp frames in `public/transformation/frames/`). Framer Motion `useScroll`/`useTransform` only — **no GSAP**; the design-taste rule forbids mixing animation libraries in one tree.
- **Pointer physics** — `MagneticButton` (90px radius attraction on CTAs), `TiltCard` (weighted ±4–6° tilt), `SpotlightBorder` (pointer-tracked accent rim on featured cards), `ParallaxImage`. The hero screenshot renders flat — no tilt/parallax — so product UI stays legible.
- **Ambient loops** — breathing dot (2.4s), marquee rows (38–46s, pause-on-hover), conic drift (14s), hairline sweep (3.8s).
- **Reduced motion is first-class** — `globals.css` collapses every keyframe/transition to 0.01ms; JS-driven effects short-circuit through `use-reduced-motion.ts`. The page must fully work with all motion off — the Transformation section swaps to a static poster + headline.

## Component inventory (as shipped, 2026-07-06)

**Rendered on `/` (`src/app/page.tsx`), in order:**
1. **Hero** (`sections/hero.tsx` + `hero-background.tsx`) — headline/subhead from `content/hero.ts`, breathing-dot eyebrow badge, CTA pair, and below the fold the **HeroWidget** (`src/components/hero-widget/` — an interactive Raycast-style command window with a mode dock and preview panel, content from `content/heroWidget.ts`).
2. **Transformation** (`sections/transformation.tsx`) — the scroll-scrubbed portal showpiece: PinnedStage + useFrameScrubber over 121 frames, three copy beats (Before / Threshold / After), static fallback under reduced motion.
3. **System demonstration placeholder** (`sections/system-demonstration-placeholder.tsx`, `id="day-in-locus"`) — text-only stand-in for the future product-demonstration showpiece.
4. **Pricing** (`sections/pricing.tsx`) — single PlanCard (one plan, everything included) + the **AI choice rail** ("Choose your AI": BYO included / managed AI add-on), cadence toggle defaulting to yearly, assurance row. Copy from `content/pricing.ts`.
5. **FAQ** (`sections/faq.tsx`) — `<details>` rows, `faq-collapse` grid-rows spring, plus-toggle rotating 45°, 4%-accent open wash.

**Built but currently unrendered:** `depth.tsx`, `review.tsx`, `persona-section.tsx` (single persona: Sara Mendes), `pro-cta.tsx` (name predates the no-Pro model). Keep-or-cut is decided in the landing-update pass (`PRD_landing_redesign.md`).

**Chrome & primitives:** `site-nav.tsx` / `site-nav-client.tsx` (pinned glass capsule, layoutId hover pill, auto-compacts on scroll) + `account-menu.tsx`; `ui/` — `button` (pill; primary = accent fill + white text + inset shine + magnetic), `device-frame` (the single container for app screenshots: rounded-xl, hairline, ink shadow), `logo` (concentric-rings brand mark; note `icon_master.svg` was removed — the mark is drawn in-component / sourced from the iconset PNGs), `icon` (stroke-based 1.5px line set), `marquee-row`, `noise-overlay`, `scroll-progress-path`, `spotlight-border`, `tilt-card`, `parallax-image`, `magnetic-button`.

**Removed eras — do not document or resurrect:** the Feature-tour tabs, Trust strip marquee, standalone AI/terminal "state pill" section, Loop/DailyRun sections, and any Free-vs-Pro plan-card pair. They belong to the pre-2026-05 page and the pre-pivot product.

## Voice of the surface

1. **Let the canvas carry the weight.** Add a hairline before a fill, a fill before a shadow, a glow last.
2. **Reserve the accent.** If everything is Cobalt, nothing is. Accent belongs to the thing the user should touch or notice — and on dark text, that means `--accent-text`, never raw Cobalt.
3. **Keep motion under the threshold of attention.** Things should feel settled before the user realizes anything moved.
