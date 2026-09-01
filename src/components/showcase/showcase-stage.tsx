"use client"

import * as React from "react"
import Image from "next/image"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"

import { useReducedMotion } from "@/components/motion"
import { MacDesktop } from "@/components/showcase/mac-desktop"
import { Icon } from "@/components/ui/icon"
import { Logo } from "@/components/ui/logo"
import type {
  AppShowcaseContent,
  ShowcaseIcon,
  ShowcasePane,
} from "@/content/app-showcase"
import { cn } from "@/lib/utils"

/**
 * ShowcaseStage — the interactive app showcase (Raycast-homepage pattern).
 *
 *  · A macOS desktop shell with the app window floating inside it.
 *  · A dock at the foot of the desktop that mirrors the app's sidebar: six
 *    tabs in sidebar order (⌘1–⌘6, derived from index like the app does),
 *    then — past a hairline, the way the titlebar sits apart from the sidebar
 *    — Chat behind the Locus mark. In the app that mark is the door to the
 *    conversation; the showcase repeats the gesture.
 *  · A caption per screen. Path carries two panes (Commitments · Tasks), so
 *    its caption row grows a small pane switch.
 *
 * Interaction: a real `tablist` (roving tabindex, Arrow/Home/End). Screens
 * crossfade in a stacked panel box whose aspect is reserved from the captures,
 * so nothing shifts. With `autoAdvance`, the dock steps every
 * `content.autoAdvanceMs` while in view — until the first interaction, and
 * never under reduced motion.
 *
 * All panels stay mounted (lazy) so a crossfade never lands on an unloaded
 * screen; only the first is eager, and only when the caller says it's above
 * the fold.
 */

const EASE = [0.22, 1, 0.36, 1] as const
const SIZES = "(max-width: 767px) 100vw, (max-width: 1023px) 92vw, 920px"

type Slot = {
  id: string
  label: string
  subtitle: string
  shortcut: string
  headline: string
  caption: string
  /** The long write-up, behind the caption's "More about …" toggle. */
  body: string[]
  handoff: string
  icon: ShowcaseIcon | "locus"
  panes: ShowcasePane[]
  chat: AppShowcaseContent["chat"] | null
}

function toSlots(content: AppShowcaseContent): Slot[] {
  const tabs = content.tabs.map<Slot>((tab, index) => ({
    id: tab.id,
    label: tab.label,
    subtitle: tab.subtitle,
    shortcut: `⌘${index + 1}`,
    headline: tab.headline,
    caption: tab.caption,
    body: tab.body,
    handoff: tab.handoff,
    icon: tab.icon,
    panes: tab.panes,
    chat: null,
  }))
  const chat = content.chat
  tabs.push({
    id: chat.id,
    label: chat.label,
    subtitle: chat.subtitle,
    shortcut: chat.shortcut,
    headline: chat.headline,
    caption: chat.caption,
    body: chat.body,
    handoff: chat.handoff,
    icon: "locus",
    panes: [{ id: chat.id, label: chat.label, screen: chat.screen }],
    chat,
  })
  return tabs
}

/** `matchMedia` as state; false on the server and in jsdom. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [query])
  return matches
}

type ShowcaseStageProps = {
  content: AppShowcaseContent
  /** id prefix pairing `${idBase}-tab-${id}` with `${idBase}-panel-${id}`. */
  idBase: string
  autoAdvance?: boolean
  /** The first screen is above the fold — load it eagerly. */
  eager?: boolean
  className?: string
}

export function ShowcaseStage({
  content,
  idBase,
  autoAdvance = false,
  eager = false,
  className,
}: ShowcaseStageProps) {
  const slots = React.useMemo(() => toSlots(content), [content])
  const reduced = useReducedMotion()
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const buttonsRef = React.useRef<Array<HTMLButtonElement | null>>([])

  const [activeIndex, setActiveIndex] = React.useState(0)
  const [paneIndex, setPaneIndex] = React.useState(0)
  const [interacted, setInteracted] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [inView, setInView] = React.useState(false)
  // The write-up is opt-in: the page stays short, the curious get the depth.
  // On md+ it slides in as a panel down the desktop's trailing edge (the way
  // the app's own chat panel does) — open on hover, pinned by click. Below md
  // it expands inline under the caption instead.
  const [moreOpen, setMoreOpen] = React.useState(false)
  const [morePinned, setMorePinned] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const closeMore = React.useCallback(() => {
    setMoreOpen(false)
    setMorePinned(false)
  }, [])

  const active = slots[activeIndex]
  const activePane = active.panes[Math.min(paneIndex, active.panes.length - 1)]

  const select = React.useCallback((index: number) => {
    setActiveIndex(index)
    setPaneIndex(0)
    setMoreOpen(false)
    setMorePinned(false)
  }, [])

  const focusTab = React.useCallback((index: number) => {
    buttonsRef.current[index]?.focus()
  }, [])

  // In view: the auto-advance only runs while the stage is actually on screen.
  React.useEffect(() => {
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.35 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (!autoAdvance || reduced || !inView || interacted || hovered) return
    const id = window.setInterval(() => {
      // `visibilityState`, not `hidden`: jsdom reports hidden=true by default.
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return
      setActiveIndex((index) => (index + 1) % slots.length)
      setPaneIndex(0)
      setMoreOpen(false)
      setMorePinned(false)
    }, content.autoAdvanceMs)
    return () => window.clearInterval(id)
  }, [autoAdvance, reduced, inView, interacted, hovered, slots.length, content.autoAdvanceMs])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const last = slots.length - 1
    let next: number | null = null
    if (event.key === "ArrowRight") next = activeIndex === last ? 0 : activeIndex + 1
    else if (event.key === "ArrowLeft") next = activeIndex === 0 ? last : activeIndex - 1
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = last
    if (next === null) return
    event.preventDefault()
    setInteracted(true)
    select(next)
    focusTab(next)
  }

  const writeUp = (
    <>
      {active.body.map((paragraph) => (
        <p
          key={paragraph}
          className="text-[14px] leading-relaxed text-[var(--muted-foreground)] md:text-[14.5px]"
        >
          {paragraph}
        </p>
      ))}
      <p className="flex items-start gap-2 text-xs font-medium text-[var(--accent-text)]">
        <span aria-hidden className="font-mono">→</span>
        <span>{active.handoff}</span>
      </p>
    </>
  )

  const chipClass =
    "rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[11px] leading-none text-[var(--muted-foreground)]"

  const caption = (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
        <kbd className={chipClass}>{active.shortcut}</kbd>
        <span className="font-medium text-[var(--fg)]">{active.label}</span>
        <span className="text-[var(--muted-foreground)]">· {active.subtitle}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--fg)] md:text-xl">
        {active.headline}
      </h3>
      <p className="mx-auto mt-2 max-w-[52ch] text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base">
        {active.caption}
      </p>
      {active.chat ? (
        <ul
          aria-label="Chat controls"
          className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]"
        >
          <li className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
            {active.chat.controls.autonomy.map((mode, i) => (
              <React.Fragment key={mode}>
                {i > 0 ? <span aria-hidden>·</span> : null}
                <span className={cn(i === 0 && "font-medium text-[var(--accent-text)]")}>
                  {mode}
                </span>
              </React.Fragment>
            ))}
          </li>
          <li className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
            {active.chat.controls.depth.map((lane, i) => (
              <React.Fragment key={lane}>
                {i > 0 ? <span aria-hidden>·</span> : null}
                <span className={cn(i === 1 && "font-medium text-[var(--accent-text)]")}>
                  {lane}
                </span>
              </React.Fragment>
            ))}
          </li>
          <li className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
            <kbd className="font-mono text-[var(--fg)]">{active.chat.voiceShortcut}</kbd>
            <span>to talk</span>
          </li>
        </ul>
      ) : null}

      {isDesktop ? null : (
        // Below md the trigger lives in the caption and the write-up expands
        // inline — a side panel has no room over a phone-width capture.
        <>
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-controls={`${idBase}-more`}
            onClick={() => {
              setInteracted(true)
              if (moreOpen) closeMore()
              else {
                setMoreOpen(true)
                setMorePinned(true)
              }
            }}
            className="mx-auto mt-3 inline-flex items-center gap-1 rounded-md text-sm font-medium text-[var(--accent-text)] transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            {moreOpen ? "Less" : `More about ${active.label}`}
            <Icon
              name="arrow-right"
              size={13}
              className={cn(
                "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                moreOpen ? "-rotate-90" : "rotate-90"
              )}
            />
          </button>
          <div
            id={`${idBase}-more`}
            className={cn(
              "grid w-full transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              moreOpen ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"
            )}
          >
            <div className="overflow-hidden" aria-hidden={!moreOpen}>
              <div className="mx-auto flex max-w-[60ch] flex-col gap-3 pb-1 pt-4 text-left">
                {writeUp}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )

  return (
    <div
      ref={rootRef}
      data-slot="showcase-stage"
      className={cn("flex flex-col gap-6 md:gap-7", className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false)
        if (!morePinned) setMoreOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && moreOpen) closeMore()
      }}
    >
      <MacDesktop>
        {/* The window layer: one panel per slot, stacked, crossfading. The
            box's aspect is the captures' own, so the page never reflows. */}
        <div
          className="relative mx-auto w-full md:max-w-[920px]"
          style={{ aspectRatio: `${slots[0].panes[0].screen.width} / ${slots[0].panes[0].screen.height}` }}
        >
          {slots.map((slot, index) => {
            const isActive = index === activeIndex
            return (
              <div
                key={slot.id}
                role="tabpanel"
                id={`${idBase}-panel-${slot.id}`}
                aria-labelledby={`${idBase}-tab-${slot.id}`}
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-0 transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
                  isActive ? "opacity-100" : "pointer-events-none scale-[0.985] opacity-0"
                )}
              >
                {slot.panes.map((pane, paneIdx) => {
                  const paneActive = !isActive
                    ? paneIdx === 0
                    : paneIdx === Math.min(paneIndex, slot.panes.length - 1)
                  return (
                    <div
                      key={pane.id}
                      data-pane={pane.id}
                      data-active={paneActive ? "true" : "false"}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
                        paneActive ? "opacity-100" : "pointer-events-none opacity-0"
                      )}
                    >
                      <Image
                        src={pane.screen.src}
                        alt={pane.screen.alt}
                        width={pane.screen.width}
                        height={pane.screen.height}
                        quality={90}
                        sizes={SIZES}
                        loading={eager && index === 0 && paneIdx === 0 ? "eager" : "lazy"}
                        draggable={false}
                        className="size-full object-contain"
                      />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* The dock: inside the desktop at its foot on md+ (like the Dock it
            imitates, overlapping the window's lower edge); a scrollable strip
            beneath the capture below md. Rendered once — one tablist. */}
        <div className="px-3 pb-3 pt-3 md:absolute md:inset-x-0 md:bottom-3 md:flex md:justify-center md:p-0">
          <div
            role="tablist"
            aria-label={content.tablistLabel}
            aria-orientation="horizontal"
            onKeyDown={handleKeyDown}
            onPointerDownCapture={() => setInteracted(true)}
            onFocusCapture={() => setInteracted(true)}
            className={cn(
              "flex snap-x items-end gap-1 overflow-x-auto rounded-2xl border border-[var(--border)] p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible",
              "bg-[color-mix(in_oklab,var(--surface)_84%,transparent)] backdrop-blur-xl",
              "shadow-[0_24px_48px_-24px_rgb(11_26_51/0.35),inset_0_1px_0_rgb(255_255_255/0.65)]"
            )}
          >
            <LayoutGroup id={`${idBase}-dock`}>
              {slots.map((slot, index) => {
                const isActive = index === activeIndex
                return (
                  <React.Fragment key={slot.id}>
                    {slot.chat ? (
                      <span
                        aria-hidden
                        className="mx-1 h-6 w-px shrink-0 self-center bg-[var(--border)]"
                      />
                    ) : null}
                    <button
                      ref={(node) => {
                        buttonsRef.current[index] = node
                      }}
                      type="button"
                      role="tab"
                      id={`${idBase}-tab-${slot.id}`}
                      aria-selected={isActive}
                      aria-controls={`${idBase}-panel-${slot.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => {
                        setInteracted(true)
                        select(index)
                      }}
                      className={cn(
                        "group relative flex shrink-0 snap-start flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors md:size-11 md:justify-center md:px-0 md:py-0",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                        isActive
                          ? "text-[var(--accent-text)]"
                          : "text-[var(--muted-foreground)] hover:text-[var(--fg)]"
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId={`${idBase}-active-pill`}
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 380, damping: 30 }
                          }
                          aria-hidden
                          className="absolute inset-0 rounded-xl border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--accent-subtle)]"
                        />
                      ) : null}
                      <span aria-hidden className="relative grid place-items-center">
                        {slot.icon === "locus" ? (
                          <Logo size={18} variant={isActive ? "cobalt" : "monotone"} />
                        ) : (
                          <Icon name={slot.icon} size={18} />
                        )}
                      </span>
                      {/* The accessible name; visible under the icon below md,
                          where there is no hover to reveal it. */}
                      <span className="relative text-[11px] font-medium md:sr-only">
                        {slot.label}
                      </span>
                      {/* macOS-Dock-style hover label — decoration, the name is above. */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--fg)] px-2 py-1 text-[11px] font-medium text-[var(--bg)] opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
                      >
                        {slot.label}
                      </span>
                    </button>
                  </React.Fragment>
                )
              })}
            </LayoutGroup>
          </div>
        </div>

        {/* md+: the trigger sits where the panel opens — top-right of the
            desktop — so the eye never has to travel. Hover opens, click pins. */}
        {isDesktop ? (
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-controls={`${idBase}-more`}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setMoreOpen(true)
            }}
            onClick={() => {
              setInteracted(true)
              if (moreOpen && morePinned) closeMore()
              else {
                setMoreOpen(true)
                setMorePinned(true)
              }
            }}
            className={cn(
              "absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--fg)]",
              "bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] shadow-[0_8px_24px_-12px_rgb(11_26_51/0.35)] backdrop-blur-md",
              "transition-[opacity,color] duration-200 hover:text-[var(--accent-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              moreOpen && "pointer-events-none opacity-0"
            )}
          >
            <span
              aria-hidden
              className="grid size-4 place-items-center rounded-full border border-current font-serif text-[10px] italic leading-none"
            >
              i
            </span>
            About {active.label}
          </button>
        ) : null}

        {/* md+: the write-up as a panel down the desktop's trailing edge —
            the app's own gesture for its chat panel. Sits above the dock,
            never inside a tabpanel. */}
        {isDesktop ? (
          <div
            id={`${idBase}-more`}
            role="region"
            aria-label={`About ${active.label}`}
            aria-hidden={!moreOpen}
            inert={!moreOpen}
            className={cn(
              "absolute right-3 top-3 z-20 w-[36%] max-w-[380px] max-h-[calc(100%-88px)] overflow-y-auto rounded-xl border border-[var(--border)] p-5",
              "bg-[color-mix(in_oklab,var(--surface)_94%,transparent)] backdrop-blur-xl",
              "shadow-[0_24px_48px_-24px_rgb(11_26_51/0.35),inset_0_1px_0_rgb(255_255_255/0.7)]",
              "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              moreOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <kbd className={chipClass}>{active.shortcut}</kbd>
                <span className="font-medium text-[var(--fg)]">{active.label}</span>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={closeMore}
                className="-mr-1 -mt-1 grid size-7 place-items-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <h4 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-[var(--fg)]">
              {active.headline}
            </h4>
            <div className="mt-3 flex flex-col gap-3 text-left">{writeUp}</div>
          </div>
        ) : null}
      </MacDesktop>

      {/* The caption. Height is reserved so the page doesn't breathe with the
          length of each caption; the pane switch lives here — outside the
          tabpanels — so it is never a focusable control inside aria-hidden. */}
      <div className="mx-auto flex min-h-44 w-full max-w-[64ch] flex-col items-center text-center md:min-h-40">
        {reduced ? (
          <div className="w-full">{caption}</div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="w-full"
            >
              {caption}
            </motion.div>
          </AnimatePresence>
        )}

        {active.panes.length > 1 ? (
          <div
            role="group"
            aria-label={content.paneSwitchLabel}
            className="mt-4 inline-flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)] p-0.5"
          >
            {active.panes.map((pane, index) => {
              const pressed = pane.id === activePane.id
              return (
                <button
                  key={pane.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => {
                    setInteracted(true)
                    setPaneIndex(index)
                  }}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                    pressed
                      ? "bg-[var(--fg)] text-[var(--bg)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--fg)]"
                  )}
                >
                  {pane.label}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
