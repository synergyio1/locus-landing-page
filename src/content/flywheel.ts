/**
 * flywheel — typed content for the app-tour section that follows the
 * Transformation → AppDemo sequence. Three stages of the smart flywheel:
 *
 *  01 The sensors — Focus + Sentinel, alternating text/clip rows
 *  02 The capture — Tasks / Habits / Notes behind one clip switcher
 *  03 The brains  — Chat / Routines / Memory behind one clip switcher
 *
 * Every media slot is a placeholder for a short product clip. `poster`
 * points at a real screenshot while the clip is being produced, and is
 * null where no capture exists yet (Notes, Chat, Routines, Memory —
 * see .agents/product-marketing-context.md, "new screenshots needed").
 * Swap a slot to video by giving the clip a `src` when recordings land.
 */

export type FlywheelPoster = {
  src: string
  width: number
  height: number
}

export type FlywheelClipIcon =
  | "tasks"
  | "habit"
  | "note"
  | "chat"
  | "routine"
  | "memory"

export type FlywheelClip = {
  id: string
  label: string
  icon: FlywheelClipIcon
  /** Accessible description of the screen the clip placeholder stands for. */
  alt: string
  poster: FlywheelPoster | null
  caption: { lead: string; rest: string }
}

export type FlywheelSensorRow = {
  id: "focus" | "sentinel"
  eyebrow: string
  title: string
  body: string
  clip: { label: string; alt: string; poster: FlywheelPoster | null }
}

type FlywheelStageBase = {
  index: string
  kicker: string
  title: string
  body: string
}

export type FlywheelContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  sensors: FlywheelStageBase & { rows: FlywheelSensorRow[] }
  capture: FlywheelStageBase & { clips: FlywheelClip[] }
  brains: FlywheelStageBase & { clips: FlywheelClip[] }
}

const SCREEN = { width: 2880, height: 1800 }

export const flywheel: FlywheelContent = {
  id: "flywheel",
  eyebrow: "The smart flywheel",
  headline: "The day goes in. Structure comes out.",
  body: "Locus runs on a loop: sensors make the day legible, capture gives it targets, and the agent turns both into tomorrow's structure. Every pass around the loop makes the next one sharper.",

  sensors: {
    index: "01",
    kicker: "The sensors",
    title: "Locus sees the day you actually had.",
    body: "Two instruments — one for the hours you declare, one for the hours you don't. Together they keep the whole day legible, not just the scheduled part.",
    rows: [
      {
        id: "focus",
        eyebrow: "Focus · declared intent",
        title: "Say what the hour is for. Locus holds you to it.",
        body: "A session starts with one line of intent. While you work, Locus reads the active window against that line — a live focus score, and the smallest possible nudge when you drift.",
        clip: {
          label: "Focus session",
          alt: "A running Locus focus session — declared intent, live classification of the active window, and the session timer.",
          poster: {
            src: "/screenshots/screens/CommandView_running_dark.png",
            ...SCREEN,
          },
        },
      },
      {
        id: "sentinel",
        eyebrow: "Sentinel · ambient watch",
        title: "Off the clock, the day still leaves a trail.",
        body: "Between sessions, Sentinel quietly notes where your attention went, so the unplanned day stays legible too. Observation, not judgment — nothing scores you outside a session you declared.",
        clip: {
          label: "Sentinel timeline",
          alt: "The Sentinel view rendering an unplanned day as a readable timeline of where attention went.",
          poster: {
            src: "/screenshots/screens/SentinelView_dark.png",
            ...SCREEN,
          },
        },
      },
    ],
  },

  capture: {
    index: "02",
    kicker: "The capture",
    title: "You tell it what the days are for.",
    body: "Three light surfaces for what matters: the next actions, the rhythms you're keeping, and the thoughts you don't want to lose mid-session.",
    clips: [
      {
        id: "tasks",
        label: "Tasks",
        icon: "tasks",
        alt: "The Tasks view — one-off next actions, each linked to the commitment it serves.",
        poster: {
          src: "/screenshots/screens/TasksView_list_dark.png",
          ...SCREEN,
        },
        caption: {
          lead: "Next actions, kept honest.",
          rest: "One-off tasks capture in a keystroke and link to the commitment they serve — the list stays short because everything on it has a reason.",
        },
      },
      {
        id: "habits",
        label: "Habits",
        icon: "habit",
        alt: "A habit detail view — cadence, recent rhythm, and how the habit is holding.",
        poster: {
          src: "/screenshots/screens/HabitDetail_dark.png",
          ...SCREEN,
        },
        caption: {
          lead: "Rhythms, not streak guilt.",
          rest: "Habits return on their cadence and never roll debt over. Miss a day, and tomorrow simply asks again.",
        },
      },
      {
        id: "notes",
        label: "Notes",
        icon: "note",
        alt: "The Notes surface — quick capture that the agent later files into the system.",
        poster: null,
        caption: {
          lead: "Thoughts, parked safely.",
          rest: "Drop a note mid-session and stay on intent. The agent reads it later and files what matters into projects, tasks, and memory.",
        },
      },
    ],
  },

  brains: {
    index: "03",
    kicker: "The brains",
    title: "The agent turns it all into structure.",
    body: "Everything the sensors saw and you captured lands in one place — a chat that knows your data, behaviors you can read as files, and a memory you can edit.",
    clips: [
      {
        id: "chat",
        label: "Chat",
        icon: "chat",
        alt: "The Locus chat answering questions about the week with charts and suggested actions.",
        poster: null,
        caption: {
          lead: "Ask your day anything.",
          rest: "The chat knows your sessions, projects, and habits — it draws the charts, suggests the next move, and takes pushback. Disagree, and the disagreement is remembered.",
        },
      },
      {
        id: "routines",
        label: "Routines",
        icon: "routine",
        alt: "The Routines view — the agent's behaviors as readable, editable Markdown files.",
        poster: null,
        caption: {
          lead: "Every behavior is a file you can read.",
          rest: "The daily digest, the distraction coach, the notes pass — each one a plain Markdown routine you can open, edit, or switch off.",
        },
      },
      {
        id: "memory",
        label: "Memory",
        icon: "memory",
        alt: "The Memory tab — an editable knowledge tree of what Locus has learned.",
        poster: null,
        caption: {
          lead: "See exactly what it knows.",
          rest: "Everything Locus learns about you lives in a wiki on your Mac — inspectable, correctable, yours.",
        },
      },
    ],
  },
}
