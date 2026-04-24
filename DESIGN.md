---
name: Locus — Midnight Focus
description: >
  A calm, instrument-panel aesthetic for a macOS focus system. Deep navy-ink
  canvas with a single crisp azure accent and semantic alive/warn tones.
  Editorial type with tight tracking, mono-numeric utility marks, and quiet
  ambient motion (breathing dots, magnetic buttons, conic drifts, hairline
  sweeps). Built to feel like a quiet workbench for deep work — focused,
  unhurried, premium.

colors:
  # Canvas & surfaces — a cold, desaturated navy that reads almost black
  bg: "#0A1620"
  surface: "#0E1C28"
  surface-raised: "#132534"
  surface-sunken: "#08111A"

  # Text
  on-bg: "#E6EDF3"
  on-surface: "#E6EDF3"
  on-surface-muted: "#8A9BAE"
  on-surface-dim: "#6B7C8F"

  # Single accent — a daylight azure used sparingly for focus, links, CTAs
  accent: "#4A8FE8"
  accent-contrast: "#0A1620"
  accent-hover: "#6DA4EE"
  accent-press: "#3D7ED2"

  # Semantic — "alive" (on-track, running, progress) and "warn" (off-track)
  alive: "#3FCF7E"
  alive-soft: "rgba(63, 207, 126, 0.16)"
  alive-ring: "rgba(63, 207, 126, 0.45)"
  warn: "#E8556F"
  warn-soft: "rgba(232, 85, 111, 0.16)"
  warn-ring: "rgba(232, 85, 111, 0.45)"

  # Strokes — always alpha-on-light for glass-edge behaviour on dark
  border: "rgba(255, 255, 255, 0.08)"
  border-strong: "rgba(255, 255, 255, 0.14)"
  rule: "rgba(255, 255, 255, 0.06)"
  edge-highlight: "rgba(255, 255, 255, 0.18)"  # inset top-line on lit surfaces

  # Selection & focus ring
  selection: "rgba(74, 143, 232, 0.40)"
  focus-ring: "#4A8FE8"

  # Utility "chroma grid" lines (behind hero/CTA)
  grid-line: "rgba(230, 237, 243, 0.06)"

typography:
  font-family-sans: "Geist, ui-sans-serif, system-ui, -apple-system, sans-serif"
  font-family-mono: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  font-family-heading: "Geist, ui-sans-serif, system-ui, sans-serif"

  # Display — hero only. Tight tracking, near-unity leading, semibold.
  display-xl:
    fontFamily: "{font-family-heading}"
    fontSize: "84px"        # 5.25rem
    fontWeight: "600"
    lineHeight: "0.98"
    letterSpacing: "-0.035em"
  display-lg:
    fontFamily: "{font-family-heading}"
    fontSize: "60px"        # 3.75rem — CTA band desktop
    fontWeight: "600"
    lineHeight: "1.02"
    letterSpacing: "-0.03em"
  display-sm:
    fontFamily: "{font-family-heading}"
    fontSize: "44px"        # 2.75rem — hero mobile
    fontWeight: "600"
    lineHeight: "0.98"
    letterSpacing: "-0.035em"

  # Section headlines
  headline-lg:
    fontFamily: "{font-family-heading}"
    fontSize: "48px"        # 3rem — md:text-5xl
    fontWeight: "600"
    lineHeight: "1.05"
    letterSpacing: "-0.03em"
  headline-md:
    fontFamily: "{font-family-heading}"
    fontSize: "36px"        # md:text-4xl — CTA mobile
    fontWeight: "600"
    lineHeight: "1.05"
    letterSpacing: "-0.025em"
  headline-sm:
    fontFamily: "{font-family-heading}"
    fontSize: "30px"        # text-3xl — mobile section headlines
    fontWeight: "600"
    lineHeight: "1.05"
    letterSpacing: "-0.025em"

  # Subheads & card titles
  title-lg:
    fontFamily: "{font-family-heading}"
    fontSize: "24px"        # loop sentence mobile
    fontWeight: "500"
    lineHeight: "1.25"
    letterSpacing: "-0.015em"
  title-md:
    fontFamily: "{font-family-heading}"
    fontSize: "20px"        # plan name
    fontWeight: "500"
    lineHeight: "1.35"
    letterSpacing: "-0.015em"

  # Body
  body-lg:
    fontFamily: "{font-family-sans}"
    fontSize: "20px"        # hero lead desktop
    fontWeight: "400"
    lineHeight: "1.55"
    letterSpacing: "0"
  body-md:
    fontFamily: "{font-family-sans}"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "1.6"
    letterSpacing: "0"
  body-sm:
    fontFamily: "{font-family-sans}"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "1.55"
    letterSpacing: "0"

  # Labels & eyebrows — always UPPERCASE with wide tracking.
  # Two distinct eyebrow styles: "sans-eyebrow" for sections, "mono-eyebrow"
  # for technical/utility marks (version, step counters, loop title).
  label-eyebrow:
    fontFamily: "{font-family-sans}"
    fontSize: "12px"        # text-xs
    fontWeight: "500"
    lineHeight: "1"
    letterSpacing: "0.18em"
    textTransform: "uppercase"
  label-mono-eyebrow:
    fontFamily: "{font-family-mono}"
    fontSize: "11.2px"      # 0.7rem
    fontWeight: "500"
    lineHeight: "1"
    letterSpacing: "0.22em"
    textTransform: "uppercase"
  label-button:
    fontFamily: "{font-family-sans}"
    fontSize: "14px"
    fontWeight: "500"
    lineHeight: "1"
    letterSpacing: "0"
  label-button-lg:
    fontFamily: "{font-family-sans}"
    fontSize: "16px"
    fontWeight: "500"
    lineHeight: "1"
    letterSpacing: "0"

  # Code / numeric — timers, prices, terminal-prompt lines
  code-md:
    fontFamily: "{font-family-mono}"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "1.5"
    letterSpacing: "0"
  numeric-xl:
    fontFamily: "{font-family-mono}"
    fontSize: "48px"        # price large
    fontWeight: "400"
    lineHeight: "1"
    letterSpacing: "-0.01em"

spacing:
  base: "4px"               # Tailwind base unit
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  3xl: "96px"
  4xl: "128px"

  # Layout rhythm
  gutter-sm: "24px"         # px-6
  gutter-md: "40px"          # md:px-10
  container-max: "1400px"
  section-y: "80px"          # py-20
  section-y-md: "128px"      # md:py-32
  hero-pt: "96px"
  hero-pt-md: "112px"

rounded:
  sm: "6px"                 # ~radius * 0.6
  DEFAULT: "8px"
  md: "8px"
  lg: "10px"                # --radius
  xl: "14px"                # primary card radius — device frames, plan cards
  2xl: "18px"
  full: "9999px"            # buttons, pills, badges, breathing dots

borders:
  hairline: "1px solid rgba(255, 255, 255, 0.08)"
  hairline-strong: "1px solid rgba(255, 255, 255, 0.14)"
  accent-soft: "1px solid color-mix(in oklab, #4A8FE8 35%, transparent)"
  accent-mid: "1px solid color-mix(in oklab, #4A8FE8 55%, transparent)"
  inset-shine: "inset 0 1px 0 rgba(255, 255, 255, 0.18)"      # on primary CTA
  inset-shine-soft: "inset 0 1px 0 rgba(255, 255, 255, 0.06)" # on dark surfaces

elevation:
  # All elevations favour deep, narrow shadows over wide diffusion.
  # Dark "ink" shadows instead of grey — #04080C / near-black at low opacity.
  nav:
    shadow: "0 10px 30px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
    backdrop-filter: "blur(20px)"
    backgroundColor: "color-mix(in oklab, #0A1620 72%, transparent)"
  device-frame:
    shadow: "0 40px 90px -40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
    border: "1px solid rgba(255, 255, 255, 0.08)"
  hero-screenshot:
    shadow: >
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      0 60px 120px -36px rgba(4, 10, 16, 0.85),
      0 18px 48px -24px rgba(74, 143, 232, 0.22)
  card-featured:
    shadow: "inset 0 1px 0 color-mix(in oklab, #4A8FE8 45%, transparent)"
    background: "color-mix(in oklab, #4A8FE8 7%, #0E1C28)"
    border: "1px solid color-mix(in oklab, #4A8FE8 55%, transparent)"
  glass-panel:
    shadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)"
    backdrop-filter: "blur(20px)"
    background: "rgba(255, 255, 255, 0.02)"
    border: "1px solid rgba(255, 255, 255, 0.06)"

# Ambient field effects applied behind hero / CTA band / focal moments
field-effects:
  chroma-grid:
    background-image: >
      linear-gradient(to right, rgba(230, 237, 243, 0.06) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(230, 237, 243, 0.06) 1px, transparent 1px)
    background-size: "88px 88px"
    mask: "radial-gradient(ellipse at 60% 40%, black 0%, transparent 75%)"
    opacity: 0.5
  halo-accent:
    background: >
      radial-gradient(ellipse 95% 78% at 55% 45%,
        color-mix(in oklab, #4A8FE8 30%, transparent) 0%,
        color-mix(in oklab, #4A8FE8 10%, transparent) 35%,
        transparent 70%)
    filter: "blur(52px)"
    transform: "translate3d(0, 4%, 0) scale(1.08)"
  rim-light:
    background: "radial-gradient(circle at 82% 12%, rgba(255, 255, 255, 0.09), transparent 45%)"
    filter: "blur(24px)"
  conic-drift:
    background: >
      conic-gradient(from var(--angle),
        color-mix(in oklab, #4A8FE8 18%, transparent),
        transparent 35%, transparent 65%,
        color-mix(in oklab, #4A8FE8 12%, transparent))
    mask: "radial-gradient(ellipse 60% 70% at 50% 60%, black 20%, transparent 80%)"
    animation: "conic-drift 14s linear infinite"
  noise-overlay:
    blend-mode: "overlay"
    opacity: 0.035
    source: "fractalNoise baseFrequency=0.9, 2 octaves, tiled 160px"
  scroll-progress-hairline:
    width: "1px"
    position: "fixed left-0 top-0 full-height"
    background: "linear-gradient(to bottom, #4A8FE8, color-mix(in oklab, #4A8FE8 60%, transparent), transparent)"

motion:
  # A single signature easing curve (inspired by Material "emphasized") is
  # used everywhere — spring-reveal, sheet open, pill slide.
  easing:
    signature: "cubic-bezier(0.22, 1, 0.36, 1)"
    standard: "cubic-bezier(0.4, 0, 0.2, 1)"
    linear: "linear"

  springs:
    nav-morph:         { stiffness: 320, damping: 30, mass: 1.0 }
    pill-slide:        { stiffness: 380, damping: 30, mass: 1.0 }
    tab-indicator:     { stiffness: 360, damping: 28, mass: 1.0 }
    hover-pill:        { stiffness: 420, damping: 32, mass: 1.0 }
    tilt-card:         { stiffness: 140, damping: 18, mass: 0.6 }
    magnetic-button:   { stiffness: 220, damping: 20, mass: 0.5 }
    parallax:          { stiffness: 120, damping: 24, mass: 0.6 }
    scroll-progress:   { stiffness: 160, damping: 28, mass: 0.4 }

  durations:
    instant: "120ms"
    quick: "200ms"
    standard: "320ms"
    reveal: "520ms"
    slow: "800ms"

  keyframes:
    breathe:
      cycle: "2400ms ease-in-out infinite"
      transform: "scale(0.9 → 1.1), opacity(0.55 → 1.0)"
    spring-reveal:
      duration: "520ms"
      easing: "{easing.signature}"
      transform: "translateY(12px → 0)"
      opacity: "0 → 1"
      trigger: "IntersectionObserver threshold 0.1"
    marquee-x:
      duration: "38s–46s linear infinite"
      transform: "translate3d(0 → -50%)"
      pause-on-hover: true
    conic-drift:
      duration: "14s linear infinite"
      property: "--angle: 0deg → 360deg"
    hairline-sweep:
      duration: "3800ms ease-in-out infinite"
      background-position: "-200% → 200%"
    draw-line:
      duration: "800ms"
      easing: "{easing.signature}"
      stroke-dashoffset: "60 → 0"

  reduced-motion: "All keyframe animations and transitions collapse to 0.01ms; magnetic, tilt, parallax and scroll-progress effects short-circuit to static layout."

components:
  button-primary:
    shape: "pill (rounded-full)"
    height: "44px (lg), 36px (default), 32px (sm)"
    padding-x: "24px (lg), 16px (default), 12px (sm)"
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-contrast}"
    typography: "{typography.label-button-lg}"
    shadow: "{borders.inset-shine}"
    hover: "bg color-mix(in oklab, {colors.accent} 88%, white)"
    focus-ring: "2px {colors.focus-ring}, offset 2px against {colors.bg}"
    motion: "magnetic-button spring (radius 90px, strength 0.35)"
  button-outline:
    shape: "pill (rounded-full)"
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    border: "{borders.hairline}"
    hover: "bg {colors.surface-raised}"
  button-ghost:
    shape: "pill (rounded-full)"
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    hover: "bg {colors.surface-raised}"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    hover: "underline (underline-offset 4px)"

  nav-pill:
    container: "rounded-full, max-width 720px, sticky top 12–20px"
    background: "color-mix(in oklab, {colors.bg} 72%, transparent)"
    backdrop-filter: "blur(20px)"
    border: "{borders.hairline}"
    padding: "8px 16px (expanded), 6px 12px (compact after 80px scroll)"
    motion: "layout morph via signature spring (nav-morph)"
    hover-indicator: "layoutId pill on {colors.surface-raised}, hover-pill spring"

  device-frame:
    radius: "{rounded.xl}"
    border: "{borders.hairline}"
    shadow: "{elevation.device-frame.shadow}"
    overflow: "hidden"
    children: "macOS window screenshots, rendered at 90% JPEG/PNG quality"

  plan-card:
    radius: "{rounded.xl}"
    padding: "24px (mobile), 32px (md+)"
    background: "{colors.surface}"
    border: "{borders.hairline}"
    typography:
      title: "{typography.title-md}"
      price: "{typography.numeric-xl}"
      feature: "{typography.body-sm}"
    feature-bullet: "circle 16px, bg alive-soft at 18%, check stroke {colors.accent}"
  plan-card-featured:
    background: "{elevation.card-featured.background}"
    border: "{elevation.card-featured.border}"
    shadow: "{elevation.card-featured.shadow}"
    extras: "Popular mono-eyebrow pill, SpotlightBorder on pointer move"

  state-pill:
    shape: "pill (rounded-full)"
    padding: "4px 14px"
    typography: "{typography.label-eyebrow}"
    variants:
      on-track:
        text: "{colors.alive}"
        bg: "{colors.alive-soft}"
        ring: "{colors.alive-ring}"
      unknown:
        text: "{colors.on-surface-muted}"
        bg: "{colors.surface-raised}"
        ring: "{colors.border}"
      off-track:
        text: "{colors.warn}"
        bg: "{colors.warn-soft}"
        ring: "{colors.warn-ring}"
    motion: "shared layoutId indicator with tab-indicator spring"

  terminal-line:
    container: "rounded-xl, border white/6, bg white/2, backdrop-blur-xl, inset shine"
    prompt: "$ in {colors.on-surface-muted}, command in {typography.code-md} coloured by active state"

  breathing-dot:
    size: "8px"
    color: "{colors.alive}"
    animation: "breathe 2400ms ease-in-out infinite"
    purpose: "Always-on liveness mark — never decorative"

  badge-mono:
    shape: "pill (rounded-full)"
    border: "{borders.hairline}"
    background: "{colors.surface}"
    typography: "{typography.label-mono-eyebrow}"

  faq-row:
    divider: "{colors.border} top+bottom, divide-y on list"
    summary: "{typography.body-md} → {typography.body-lg} md"
    toggle: "size-28px, rounded-full, {borders.hairline}, rotates 45° when open; turns accent on open"
    collapse: "grid-template-rows 0fr → 1fr @ 320ms signature easing"
    open-bg: "color-mix(in oklab, {colors.accent} 4%, transparent)"

  marquee-row:
    mask: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)"
    content: "mono-eyebrow label + icon, items doubled for seamless loop"
    pause-on-hover: true

  trust-strip:
    background: "color-mix(in oklab, {colors.bg} 96%, black)"
    rule: "border-y {colors.border}"

  footer:
    rule: "border-t {colors.border}"
    hairline-accent: "animated gradient sweep, 24px wide, {colors.accent}"
    metadata-col: "{typography.label-mono-eyebrow}, right-aligned on md+"

icons:
  family: "Custom line set, stroke-based"
  strokeWidth: 1.5
  strokeLinecap: "round"
  strokeLinejoin: "round"
  viewBox: "0 0 24 24"
  size-default: 16
  size-inline: 14
  tokens: ["plan", "focus", "track", "review", "shield", "sparkle", "apple", "moon", "bolt", "download", "arrow-right", "plus"]

accessibility:
  focus-ring: "2px solid {colors.accent}, offset 2px against {colors.bg}"
  selection: "color-mix(in oklab, {colors.accent} 40%, transparent)"
  minimum-contrast:
    on-surface: ">= 12.5:1 vs bg"
    on-surface-muted: ">= 5.4:1 vs bg"
    accent-on-bg: ">= 5.8:1"
  reduced-motion: "Respected globally — all keyframes and hover motion short-circuit."
---

## Brand & Style

Locus is a **macOS focus system** for sessions, projects, and habits. The visual identity treats the landing page as the product's quiet anteroom: a dim, instrument-grade workbench with a single point of light. The tone is "late-night studio" — confident, uncluttered, precise. Nothing is loud. A breathing green dot, a faint grid behind the hero, and the slow drift of a conic glow behind the closing CTA are the only things that move at rest.

The personality is **editorial + engineered**. Editorial in the way headlines are set (near-unity leading, tight negative tracking, generous measure, balanced text). Engineered in the way utility marks read (uppercase mono eyebrows, version strings, step counters "01 / 03", terminal-style `$ command` demos). The product is sold on trust and craft, not novelty — the design never asks the user to admire it, only to use it.

## Colors

The palette is deliberately narrow: one canvas, one accent, two semantics.

- **Canvas (`#0A1620`)** — a very cold, desaturated navy that reads nearly black. Every section shares this background; separation comes from hairline borders, not fills. Surfaces raise only incrementally (`#0E1C28`, `#132534`) — the overall impression is a single continuous dark page.
- **Accent (`#4A8FE8`)** — daylight azure, the only decorative colour. Used for the primary CTA, the scroll hairline, focused tabs, featured plan card, icon strokes inside verb-loop chips, and as the tint for halo glows. Its scarcity is the point: because nothing else is blue, the eye always knows where to go.
- **Alive (`#3FCF7E`)** — reserved for *aliveness*: the breathing dot, the timer's progress arc, "on-track" states, focus-time figures in the weekly review. Never used as decoration.
- **Warn (`#E8556F`)** — coral-rose, not red. Used for "off-track" states and nothing else.
- **Text** — `#E6EDF3` on canvas for primary copy, `#8A9BAE` for muted body and eyebrows, `#6B7C8F` for tertiary metadata. The muted tone is warm enough to avoid a clinical feel but desaturated enough to stay subordinate.
- **Borders** are always alpha-on-white (`rgba(255,255,255,0.08)`), never a named grey. This lets them work as "lit edges" on top of the navy canvas and read as glass rather than drawn lines.

Colour is applied in *ambient* doses. Instead of large filled blocks, the accent is mixed through `color-mix(in oklab, #4A8FE8 X%, transparent)` at 4–30% to produce halo glows, featured-card tints, soft pill fills, and focused state rings.

## Typography

**Geist Sans** is the headline and body face; **Geist Mono** is reserved for everything instrumented — timers, prices, eyebrows with a technical quality ("The daily loop", "01 / 03", "v0.1.0"), and terminal-prompt demo lines.

- **Display scales** (44–84px) are always set in semibold with negative tracking (`-0.03em` to `-0.035em`) and near-unity leading (`0.98`–`1.02`). This keeps large type dense and editorial rather than airy or poster-like.
- **Section headlines** share the same treatment at 30–48px. The hero is the single place that breaks to 84px.
- **Body copy** uses generous leading (1.55–1.6) and narrow measure (`max-w-xl`, `max-w-2xl`) to keep paragraphs short and scannable.
- **Eyebrows** are the navigational signal throughout. Two variants coexist intentionally:
  - **Sans eyebrow** — 12px/500/`0.18em` tracking — marks section intent ("Your daily run", "Plans", "Questions").
  - **Mono eyebrow** — ~11px/500/`0.22em` tracking — marks *mechanism* and metadata (the loop title, step indices, version numbers, availability badges). The switch to mono is a quiet signal: "this is structural, not emotional."
- **Italics** appear once, as the subline under the daily-loop verbs, to soften an otherwise highly geometric section.
- **Numerics** use the mono face to preserve tabular alignment in prices and timers.

## Layout & Spacing

The grid is a `max-w-[1400px]` page shell with `px-6` on mobile and `px-10` from `md` up. Sections share a vertical rhythm of `py-20` / `md:py-32` (80 / 128px). The hero breaks this by occupying `min-h-[100dvh]` with its own padding. Every section below the hero is separated by a `border-t` hairline — never by a coloured band or extra padding.

- **Internal rhythm** follows Tailwind's 4px base scale: `gap-3/4/6/8/10/12/16`. Body and headline pairs are separated by `gap-4`; CTA rows by `gap-3`; grid columns by `gap-12` mobile / `gap-16` md.
- **Two-column sections** (AI, Daily Run, Review, Pricing, FAQ) use asymmetric splits — `0.78/1.22`, `0.42/0.58`, `0.82/1.18` — so the content column is never equal to the visual column. The side with the screenshot is always the wider one.
- **Whitespace is dense, not generous.** The measure is tight, the eyebrows are small, the gutters are fixed. The page earns its premium feel through *precision* of spacing, not through expansive negative space.

## Elevation & Depth

Depth on the navy canvas is expressed through **lit edges, soft ink shadows, and ambient fields** — never through heavy blocks or gradients applied to surfaces themselves.

- **Inset shine** (`inset 0 1px 0 rgba(255,255,255,0.06–0.18)`) runs along the top edge of every raised element — primary buttons, the sticky nav pill, device frames, featured plan card. This single pixel simulates a directional light from above and makes the whole UI feel "lit".
- **Ink shadows** — deep, narrow, and blue-biased near-black (`rgba(4,10,16,0.7–0.85)`) with very negative spread (`-36px` to `-40px`) concentrate depth directly under the element instead of diffusing into grey clouds. Hero device frames add a second, warmer accent-tinted shadow (`rgba(74,143,232,0.22)`) to suggest the screen itself is emitting light.
- **Ambient field layers** are applied behind focal sections:
  1. **Chroma grid** — 88px square hairline grid, 6% opacity, radially masked so it only exists in the upper-right quadrant behind the hero heading.
  2. **Halo glow** — a blurred 52px radial of accent at 30% opacity, placed behind the hero screenshot to replace its baked-in backdrop.
  3. **Rim light** — a top-right white radial (9% opacity, 24px blur) simulating off-screen window light.
  4. **Conic drift** — a 14s rotating conic gradient tinted with accent at 18%, radially masked, playing behind the final CTA band.
  5. **SVG noise** — a fixed fractal-noise overlay at 3.5% opacity with `mix-blend-overlay`, applied page-wide so the flat navy never reads as a solid fill.
- **Glass panels** — used sparingly (nav pill, AI terminal card, mobile sheet) — combine a 20px `backdrop-blur`, a 2–6% white fill, a 6–8% white top-line, and a hairline border. They are the only element type that uses true translucency.

## Shapes

- **Pill (`rounded-full`)** — the dominant action shape: every button, every nav item background, every state pill, every badge, every icon bullet, the cadence toggle, the FAQ toggle, the breathing dot. Pills carry *interaction*.
- **Rounded-xl (14px)** — the dominant surface shape: device frames, plan cards, the AI terminal card, the mobile nav sheet. Surfaces carry *content*.
- **Rounded-lg (10px)** and smaller are rarely used; when they are, it is for small internal bullets or list-item hovers.
- **Icons** use a stroke-only, 1.5px weight, round-cap/round-join vocabulary at 24px viewBox. The weight matches the 1px hairline borders, so icon strokes and container strokes read as the same line system.

## Motion

Motion is **always quiet and always purposeful**. A single easing curve — `cubic-bezier(0.22, 1, 0.36, 1)` — governs almost every transition, producing a soft-decelerating "settle" that matches the product's unhurried tone.

- **Reveals** — every section heading, paragraph, and card uses `SpringReveal`: a 12px translateY plus opacity, 520ms, triggered by IntersectionObserver at 10% visibility. Stacked elements stagger at 80–140ms delays.
- **Layout springs** — the site nav morphs its padding at scroll > 80px; the cadence toggle, AI state pill, and FAQ all use Motion's shared `layoutId` to animate the indicator between positions instead of cross-fading.
- **Magnetic CTAs** — primary CTAs attract the pointer within a 90px radius at 35% strength, on a gentle spring.
- **Tilt cards** — depth tiles rotate ±4–6° following the pointer, with 1200px perspective and a heavy spring (damping 18) so the card feels weighted, not floppy. The hero screenshot is deliberately excluded — see *Device frame* below.
- **Spotlight border** — on hover, a 260–320px radial of 38% accent follows the pointer across featured cards' inside edge; opacity cross-fades in 200ms.
- **Ambient loops** — the breathing dot pulses at 2.4s, the trust-strip marquee scrolls at 38–46s, the conic gradient rotates at 14s, a hairline in the footer sweeps at 3.8s. All four run forever and pause-on-hover where applicable.
- **Reduced motion** is a first-class citizen: every keyframe globally collapses to 0.01ms, and magnetic/tilt/parallax/scroll-progress effects return static layout. The design must still work — and does — with all motion off.

## Components

### Buttons

Pills, always. Primary is solid accent with an 18%-white inset shine and a magnetic pointer attraction. Outline is transparent with a hairline border and raises to `surface-raised` on hover. Ghost drops the border. Link is accent-coloured underline-on-hover. All four share a 44/36/32px height system (`lg`/`default`/`sm`) and a pill focus ring at 2px accent with a 2px canvas-coloured offset.

### Nav

A single pinned, rounded-full capsule centered within a 720px max width, floating 12–20px below the top edge. It auto-compacts after 80px of scroll, shrinking its padding via a layout spring. The glass fill (`bg × 72%` + 20px blur) keeps it legible over any section below. Hover states on nav items use a shared `layoutId` pill so the indicator *slides* between links rather than fading in place.

### Device frame

The single container for every app screenshot. Rounded-xl with a hairline border, the canonical ink shadow (`0 40px 90px -40px rgba(0,0,0,0.7)`) and a 6%-white inset shine. The hero frame adds a second, longer ink shadow and an accent-tinted bloom to suggest the screen is self-lit. Frames may be wrapped in `TiltCard`, `SpotlightBorder`, or `ParallaxImage` without altering their own styling. The hero variant is an explicit exception — it renders flat (no tilt, no parallax) so the product UI reads at full legibility; depth comes entirely from the halo, rim light, inset shine, and compound ink shadow behind/around the frame.

### Plan card

Rounded-xl surface at `{colors.surface}` with hairline border, `p-8` on desktop. The **featured** variant tints its background by mixing 7% accent into the surface, replaces the border with a 55% accent mix, adds a 45%-accent inset shine, and is wrapped in a `SpotlightBorder` for pointer-tracked highlight. A "Popular" pill in mono eyebrow type sits in the top-right. Feature bullets are a 16px accent-tinted circle holding a 10px check stroke.

### Feature tour tabs

A vertical tab list paired with a pinned device-frame preview. Tabs are full-width rounded-xl rows containing a mono step eyebrow, a title, and a one-line description. The active tab is marked by a translucent accent-tinted pill (6% accent fill, 45% accent border, 35% accent inset shine) that animates between tabs via `LayoutGroup` + `layoutId="feature-tour-pill"` on the signature spring (`stiffness: 380, damping: 32`). The preview panel mirrors the hero's device-frame recipe — flat, halo glow behind, rim light, compound ink shadow — and cross-fades between screenshots in 400ms with the signature easing, with each slide scaling from 1.015→1 on enter. Below `md`, the tab list collapses to a horizontal scroll-snap pill row above the preview; the preview's `aspect-[2420/1586]` lock keeps the panel height stable across tabs and breakpoints so there's no layout shift on switch.

### State pill (AI classifier)

Three variants — on-track / unknown / off-track — carrying the corresponding semantic colour in text, fill (16% soft), and ring (45%). The active pill shares a `layoutId` so the indicator slides between options on hover/focus/click. Beneath, a glass terminal card renders the classifier's output as `$ command` in mono, coloured by active state, with a 24px prompt-glyph in muted text.

### FAQ row

Stacked within a top/bottom-ruled list with inter-row dividers. Each row is a `<details>` element; its `<summary>` carries the question and a 28px circular plus-button. On open, the row's background tints by 4% accent, the plus rotates 45°, its border switches to accent, and a grid-template-rows spring unfolds the answer in 320ms.

### Trust strip

A thin section between hero and loop — a marquee of mono-eyebrow product facts (`Works on Apple Silicon`, `macOS 14+`, `Local-first`, …) each preceded by a line icon. The row fades at both ends via a horizontal mask and pauses on hover. Used as a quiet "receipts" band.

### Scroll progress hairline

A 1px fixed rail down the left edge of the viewport, coloured top-to-bottom with an accent-to-transparent gradient, scaling its Y via a spring bound to `scrollYProgress`. It is the only persistent UI chrome beyond the nav.

### Noise overlay

An SVG fractal-noise layer fixed over the entire viewport at 3.5% opacity with `mix-blend-overlay`. Invisible in isolation but critical at the page level — it's what keeps the flat navy from ever reading as a solid digital fill and what gives large surfaces a faint "paper" quality.

## Voice of the surface

When in doubt, follow three rules:

1. **Let the canvas carry the weight.** Add a hairline before you add a fill. Add a fill before you add a shadow. Reach for a gradient or a glow last.
2. **Reserve the accent.** If everything is blue, nothing is. The accent belongs to the thing the user should touch or the thing the system wants them to notice — nothing else.
3. **Keep motion under the threshold of attention.** The user should feel that things have settled before they realise anything moved. If a reveal calls attention to itself, shorten it, soften it, or remove it.
