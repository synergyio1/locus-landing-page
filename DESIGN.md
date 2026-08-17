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

Locus is a **local-first macOS workspace with an embedded AI agent** — it makes the day legible, coaches focused work, and turns today's mess into tomorrow's structure. The landing page is the product's quiet anteroom (reset 2026-08-17 to a superlogical-style statement page): a near-white, blue-tinted sheet of paper with one Cobalt accent and one graded piece of footage. Nothing is loud. A breathing dot, a faint grid behind the hero, and a slowly rotating headline phrase are the only things that move at rest.

The voice is **Coach** — warm, honest, accountability-partner — matching `.agents/product-marketing-context.md`. The surface personality that carries it is *engineered calm*: editorial headline setting (near-unity leading, tight negative tracking, balanced text) plus instrumented utility marks (uppercase mono eyebrows, step counters, version strings). The product is sold on trust and craft, not novelty. Registers to avoid in copy and UI microtext alike: Stoic-philosopher, clinical, surveillance-flavored.

## Colors

The palette is deliberately narrow: one canvas, one accent system, two semantics. **Light theme since 2026-08-17** (Luis: "white or a blue very close to white") — the previous navy sheet is retired.

- **Canvas (`#ECF1F8`)** — every section shares this background; separation comes from hairline borders, not fills. Surfaces raise only incrementally (`--surface: #F5F8FC`, `--surface-raised: #E1E8F3`); the page reads as one continuous pale-blue sheet.
- **Cobalt accent (`#0047AB`)** — the brand color, aligned to the macOS app icon (`public/brand/AppIcon_Cobalt.iconset`). `--accent` for fills (primary CTA, toggle pill, focus rings) with white foreground; `--accent-hover` (`#00347D`) darkens on hover; on the light canvas `--accent-text` **is Cobalt itself** — it clears AA at every size, so links, eyebrows, mono indices, and the rotating headline phrase all use it. (The old rule "never raw Cobalt as text" belonged to the navy canvas.)
- **Alive (`#1B8A50`)** — reserved for *aliveness*: the breathing dot, trial chips, on-track states. Never decoration.
- **Warn (`#C9364F`)** — off-track states and nothing else.
- **Ink** — `#0B1A33` primary (the app icon's navy, now used as text), `#4E5D79` muted (≈5.7:1 on the canvas). **Borders** are alpha-on-ink (`rgb(11 26 51 / 0.10)`) so they read as pencil hairlines.
- **Hero footage** — the glacier clip is white-on-white against this canvas, so it sits under a plain **black overlay at 45%** inside the video mask (`hero-background.tsx`) — a dimmed neutral scene, no tint (a Cobalt duotone was tried and rejected 2026-08-17). It still dissolves into the canvas via `--bg` gradients.

Color is applied in *ambient* doses: `color-mix(in oklab, var(--accent) X%, transparent)` at 4–50% produces tints, soft fills, selection (`40%`), and outline color (`50%`) — see `globals.css`.

## Typography

**Geist Sans** for headlines and body; **Geist Mono** for everything instrumented — timers, prices, technical eyebrows, step indices, version strings. Both load via `next/font` in `layout.tsx`.

- Display and section headlines are semibold with negative tracking and near-unity leading — dense and editorial, never airy or poster-like. Sizes were taken down a notch on 2026-08-17 (hero h1 tops out at 66px; section h2 at 36px; the manifesto reads at 15/16px in a 64ch measure) — the page should feel like a letter, not a poster.
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
- **Reduced motion is first-class** — `globals.css` collapses every keyframe/transition to 0.01ms; JS-driven effects short-circuit through `use-reduced-motion.ts`. The page must fully work with all motion off — the manifesto's rotating headline tail renders as its resting phrase, and the hero video swaps to its poster.

## Component inventory (as shipped, 2026-08-17)

**Rendered on `/` (`src/app/page.tsx`), in order — a superlogical-style statement page, ~5,200px at 1440w (was ~14,900px):**
1. **Hero** (`sections/hero.tsx` + `hero-background.tsx`) — locked headline/subhead from `content/hero.ts`, breathing-dot eyebrow badge, CTA pair ("Download for macOS" / "Read the manifesto" → `#manifesto`), glacier video right rail, bottom-right mono "Scroll ↓" cue. No interlude, no stage numbering.
2. **Manifesto** (`sections/manifesto.tsx`, `id="manifesto"`) — the founder statement, copy in `content/manifesto.ts`. FAQ-style two-column split: statement headline pinned left (`md:sticky`) with a `RotatingWord` tail (`ui/rotating-word.tsx` — width-reserved, reduced-motion → static, sr-only resting phrase); one 68ch reading column right: paragraphs → pull quote → the three app parts (Execution / Inputs / AI, mono `01/02/03`) → five design decisions in a 2-col hairline grid → blog pointer (links only once `manifesto.blog.href` is set) → sign-off.
3. **Pricing** (`sections/pricing.tsx`) — headline + price row (one plan, cadence toggle defaulting to yearly) + "Choose your AI" rail (BYO / Locus Remote credits) + assurances. Copy from `content/pricing.ts`. Also rendered standalone at `/pricing`.

**Built but currently unrendered:** `pro-cta.tsx` is a child of pricing (name predates the no-Pro model); `motion/stagger-group.tsx` and `ui/marquee-row.tsx` have no consumers.

**Chrome & primitives:** `site-nav.tsx` / `site-nav-client.tsx` (2026-08-17, after three rounds with Luis: logo mark left (no wordmark), three text links centre, a small outlined **Log in** button right (no Download in the header — the hero owns that CTA); the bar is a **frosted band** — canvas colour fading 86%→58% downward with `backdrop-blur-md` — so it blends with the hero footage / page beneath yet stays legible; **no full-width rule**; the mobile sheet is an opaque panel with hairline rows. Rejected on the way: glass capsule + mark + hover pill ("super ugly"), transparent-at-top (unreadable over the video), fully opaque bar + full hairline ("remove the color background… I'd remove the line")) + `account-menu.tsx`; `ui/` — `button` (pill; primary = accent fill + white text + inset shine + magnetic), `logo` (concentric-rings brand mark; sourced from the `public/brand` iconset PNGs), `icon` (stroke-based 1.5px line set), `rotating-word`, `noise-overlay`, `scroll-progress-path`, `magnetic-button`; `motion/` — `spring-reveal`, `breathing-dot`, `use-reduced-motion`.

**Removed eras — do not document or resurrect:** the Feature-tour tabs, Trust strip marquee, standalone AI/terminal "state pill" section, Loop/DailyRun sections, any Free-vs-Pro plan-card pair (pre-2026-05 / pre-pivot); and, retired 2026-08-17 with the statement-page reset: the **Transformation** portal scrub, **AppDemo/HeroWidget**, **Flywheel** app tour, **"A day in Locus"** placeholder (`#day-in-locus`), **Armor/Reactor** exosuit scrub, **FAQ** section, plus the never-rendered `depth` / `review` / `persona-section` and their helpers (`pinned-stage`, `use-frame-scrubber`, `device-frame`, `tilt-card`, `spotlight-border`, `parallax-image`, `clip-frame`, `app-screenshot`) and their `public/` frame sequences. All recoverable from git history (`68a2dc7` and earlier).

## Voice of the surface

1. **Let the canvas carry the weight.** Add a hairline before a fill, a fill before a shadow, a glow last.
2. **Reserve the accent.** If everything is Cobalt, nothing is. Accent belongs to the thing the user should touch or notice — and on dark text, that means `--accent-text`, never raw Cobalt.
3. **Keep motion under the threshold of attention.** Things should feel settled before the user realizes anything moved.
