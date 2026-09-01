// The app showcase — six tabs and one conversation. Rendered twice: as the
// `#showcase` section on `/` and at the top of `/app`. The long write-ups
// (`body`, `handoff`) sit inside the stage behind the caption's "More about …"
// toggle rather than on the page (Luis, 2026-08-31: the page must stay short).
// One module so the two placements can't drift.
//
// GROUND TRUTH is the app's own sidebar, after the Execution re-org (product
// PRDs #725–#738, shipped 2026-08-27/28):
//   /Users/cippa/Desktop/fly/pomodoro-preview/Locus/Packages/LocusUI/Sources/
//   LocusUI/SidebarTab.swift — six flat tabs, no families, `displayTitle` +
//   `subtitle` transcribed verbatim below. Sidebar order is shortcut order
//   (⌘1–⌘6) — an app invariant — so shortcuts are derived from index by the
//   component, never stored here.
// Chat is NOT a tab: it lives in the titlebar behind the Locus mark (⌘J,
// `MainView.swift`), follows you into every tab, inherits what's on screen,
// and takes voice on ⌥1 (`ChatComposer.swift`: "…or press ⌥1 and just talk.").
// Retired words, never to reappear as tab names: Focus, Watch, Flywheel,
// Intelligence, Routines, Memory, Sentinel, Command (pinned in the test).
//
// Screens are the light-theme window captures (2784×1824, RGBA, shadow baked
// in) under public/app/screens — the "no product stills" rule from 2026-08-20
// is retired now that fresh captures of the six-tab UI exist. They are served
// through next/image only (WebP, sized per viewport, 31-day edge cache — see
// next.config.ts), never raw. To replace a capture, bump its filename
// (home-v2.png) so the edge cache can't keep serving the old variant.

/** A subset of `IconName` (ui/icon.tsx); kept local so this module stays plain data. */
export type ShowcaseIcon = "house" | "mountain" | "signpost" | "bolt" | "note" | "wand"

export type ShowcaseScreen = {
  /** Under /public. */
  src: string
  /** Intrinsic pixels — the aspect box is reserved from these. */
  width: number
  height: number
  /** Describes the screen; never "Screenshot of…". */
  alt: string
}

export type ShowcasePane = {
  id: string
  label: string
  screen: ShowcaseScreen
}

export type ShowcaseTab = {
  id: "home" | "vision" | "path" | "execution" | "notes" | "system"
  /** `SidebarTab.displayTitle`, verbatim. */
  label: string
  /** `SidebarTab.subtitle`, verbatim — sidebar style, no trailing period. */
  subtitle: string
  icon: ShowcaseIcon
  headline: string
  /** The dock caption on `/` — two or three lines. */
  caption: string
  /** The write-up behind the "About …" pill — one short paragraph (Luis: concise). */
  body: string[]
  /** What this tab hands to the rest — the line that makes six tabs one system. */
  handoff: string
  /** One screen, or two for Path (Commitments first). */
  panes: ShowcasePane[]
}

export type ShowcaseChat = {
  id: "chat"
  label: "Chat"
  shortcut: "⌘J"
  voiceShortcut: "⌥1"
  /** Site copy — the app has no subtitle for a surface that isn't a tab. */
  subtitle: string
  headline: string
  caption: string
  body: string[]
  handoff: string
  screen: ShowcaseScreen
  controls: {
    autonomy: readonly ["Ask", "Standard", "Auto"]
    depth: readonly ["Fast", "Deep"]
  }
}

export type AppShowcaseContent = {
  id: "showcase"
  eyebrow: string
  title: string
  intro: string
  tablistLabel: string
  paneSwitchLabel: string
  tabs: ShowcaseTab[]
  chat: ShowcaseChat
  connect: { heading: string; text: string }
  /** Dock auto-advance on `/`, until the first interaction. */
  autoAdvanceMs: number
}

const SCREEN = { width: 2784, height: 1824 } as const

export const appShowcase: AppShowcaseContent = {
  id: "showcase",
  eyebrow: "The app",
  title: "Six tabs. One conversation.",
  intro:
    "Each tab does one job and hands what it learns to the next. Chat sits in the title bar above all of them — type, or press ⌥1 and just talk.",
  tablistLabel: "Locus tabs",
  paneSwitchLabel: "Path view",
  tabs: [
    {
      id: "home",
      label: "Home",
      subtitle: "How it's going, across everything",
      icon: "house",
      headline: "The record, never the verdict.",
      caption:
        "Three numbers that can't change before lunch, this morning's brief, the week's attention, thirty days of density. What's live sits on the rail. Home runs nothing.",
      body: [
        "Three figures that can't change before lunch — hours last week, your typical stretch, hours observed all time. Then this morning's brief, the closed day, the week, thirty days. The rail holds what's live. No streaks; nothing is a percentage.",
      ],
      handoff: "Every tab writes here. Home runs nothing.",
      panes: [
        {
          id: "home",
          label: "Home",
          screen: {
            src: "/app/screens/home.png",
            ...SCREEN,
            alt: "The Home tab: hours last week, the typical stretch before it breaks, hours observed all time, this morning's brief, last week's attention, and the 30-day strip.",
          },
        },
      ],
    },
    {
      id: "vision",
      label: "Vision",
      subtitle: "Where you're going",
      icon: "mountain",
      headline: "Your why, in your own words.",
      caption:
        "Five questions, and Locus keeps only what you keep. The second half is the Portrait — Locus's own read of you — and how far it sits from yours.",
      body: [
        "Five questions — everything you want, what starts now, the few that matter, why each one, who that makes you — and only what you keep gets written. The second half is the Portrait: Locus's own read of you, kept on your Mac, and how far it sits from yours.",
      ],
      handoff: "Path takes its cues from here. The morning brief reads it.",
      panes: [
        {
          id: "vision",
          label: "Vision",
          screen: {
            src: "/app/screens/vision.png",
            ...SCREEN,
            alt: "The Vision tab inviting you to find what you actually want, with five stations from everything you want to who that makes you.",
          },
        },
      ],
    },
    {
      id: "path",
      label: "Path",
      subtitle: "How you get there",
      icon: "signpost",
      headline: "Every commitment, at every size.",
      caption:
        "Projects have a finish line. Habits repeat. Targets are an amount of time. Tasks are the atoms inside them. No calendar — nothing here is placed in time.",
      body: [
        "Projects have a finish line. Habits repeat. Targets are an amount of time. Tasks are the atoms inside all three, tied to what they belong to. No calendar here: how you get there moves weekly — the day moves hourly, and lives in Execution.",
      ],
      handoff: "Execution measures what Path authored.",
      panes: [
        {
          id: "commitments",
          label: "Commitments",
          screen: {
            src: "/app/screens/path-commitments.png",
            ...SCREEN,
            alt: "The Path tab showing Commitments: three Outcomes, two Habits, and three Time Targets, each with its hours or its streak of kept days.",
          },
        },
        {
          id: "tasks",
          label: "Tasks",
          screen: {
            src: "/app/screens/path-tasks.png",
            ...SCREEN,
            alt: "The Path tab showing Tasks: one executing, one due today, six for later — each tied to the project or habit it belongs to.",
          },
        },
      ],
    },
    {
      id: "execution",
      label: "Execution",
      subtitle: "When, and what happened",
      icon: "bolt",
      headline: "Intended on the left. What happened on the right.",
      caption:
        "One time axis, one divider. Sessions and calendar on the left; on the right, what you actually did — read from what Locus observed, described, never scored.",
      body: [
        "One time axis, one divider. Left, what you intended — sessions and calendar. Right, what happened — the sessions you ran and the stretches Locus read from what it observed, named but never scored. A sealed day reads kept 4 of 6 blocks: a fraction, never a percentage.",
      ],
      handoff: "The day narrator titles the blocks; the digests read them; Home keeps the record.",
      panes: [
        {
          id: "execution",
          label: "Execution",
          screen: {
            src: "/app/screens/execution.png",
            ...SCREEN,
            alt: "The Execution tab for Thursday 27 August: intended blocks and calendar events on the left, what happened on the right, time targets along the foot.",
          },
        },
      ],
    },
    {
      id: "notes",
      label: "Notes",
      subtitle: "Capture and analyze",
      icon: "note",
      headline: "Put the thought down now.",
      caption:
        "A note filed to a project, a habit, or nothing yet. Ask Locus to analyze it and the next steps come back as suggestions you review — not tasks it invented.",
      body: [
        "Put the thought down before it goes — filed to a project, a habit, or nothing yet. Analyze turns it into next steps you approve one by one; a research dive gathers sources. Chat knows what's open, so “help me with this” means this note.",
      ],
      handoff: "Tasks and commitments come out of here. The Portrait reads it.",
      panes: [
        {
          id: "notes",
          label: "Notes",
          screen: {
            src: "/app/screens/notes.png",
            ...SCREEN,
            alt: "The Notes tab with the note “Demo script beats” open, filed under the Atlas beta launch project, beside the list of earlier notes, deep dives, and project notes.",
          },
        },
      ],
    },
    {
      id: "system",
      label: "System",
      subtitle: "Your autopilot",
      icon: "wand",
      headline: "What Locus does without being asked.",
      caption:
        "Every AI behavior is a protocol — a Markdown file with its trigger, its tools, and its depth. Read them, edit them, switch them off, write your own.",
      body: [
        "Every AI behavior is a protocol — a Markdown file with its triggers, tools and depth: the morning brief at nine, the digest at six, a coach that speaks only when a session derails. Read them, edit them, write your own. A Method swaps the whole coaching style at once.",
      ],
      handoff: "Every protocol runs on the AI you chose, and reports back in chat.",
      panes: [
        {
          id: "system",
          label: "System",
          screen: {
            src: "/app/screens/system.png",
            ...SCREEN,
            alt: "The System tab listing the protocols Locus runs on its own — daily digest, day narrator, distraction coach, morning brief, weekly digest — with the Daily digest open.",
          },
        },
      ],
    },
  ],
  chat: {
    id: "chat",
    label: "Chat",
    shortcut: "⌘J",
    voiceShortcut: "⌥1",
    subtitle: "One conversation, on every screen",
    headline: "Type it. Or just say it.",
    caption:
      "Chat lives in the title bar, not in a tab — behind the Locus mark, on every screen. It knows what's on screen, reads everything, and acts on it. Press ⌥1 and talk.",
    body: [
      "One thread that follows you — a panel beside any screen, or the whole window. It knows what's on screen, reads everything, and acts: create the task, fix the block, move the plan — Ask, Standard or Auto, always with one-click Undo.",
      "Press ⌥1 and just talk: speech-to-text on your Mac, the reply read back, no Locus server in the path.",
    ],
    handoff: "Every tab, one voice away.",
    screen: {
      src: "/app/screens/chat.png",
      ...SCREEN,
      alt: "Chat expanded to the whole window: one thread across two days — a plan check, a ship note, yesterday read back, this morning's brief — with the Ask · Standard · Auto and Fast · Deep controls above the composer.",
    },
    controls: {
      autonomy: ["Ask", "Standard", "Auto"],
      depth: ["Fast", "Deep"],
    },
  },
  connect: {
    heading: "How they connect",
    text: "Vision says why. Path says how. Execution says when — and what actually happened. Notes catch what falls between. Home keeps the record. System runs the protocols that read all of it, and Chat is where you talk to any of it. Three levels, two gaps: what the Vision implies, what you said you'd do, what you did. Locus measures the gaps. It never scores you.",
  },
  autoAdvanceMs: 7000,
}
