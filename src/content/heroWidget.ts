/**
 * heroWidget — typed content for the interactive Raycast-style hero widget
 * (issue #47). Three value modes carry the same chaotic mixed-day scenario:
 *
 *  1. Session Tracking — declared intent vs. active window
 *  2. Day Visibility  — readable trail after the plan bends
 *  3. Review Loop     — digest + sharper shape for tomorrow
 *
 * The widget renders a coded shell (frame, menu bar, command window, dock)
 * with a swappable inner preview per mode. `previewImage` points at the
 * placeholder PNG to use until per-mode screenshots/recordings land —
 * swap a single src here when they do.
 */

export type HeroWidgetModeId = "session-tracking" | "day-visibility" | "review-loop"

export type HeroWidgetResultAccent = "alive" | "warn" | "neutral"

export type HeroWidgetResultRow = {
  title: string
  subtitle: string
  accent?: HeroWidgetResultAccent
  active?: boolean
}

export type HeroWidgetMode = {
  id: HeroWidgetModeId
  label: string
  /** Short hint shown under the dock when active. */
  hint: string
  /** Icon name from the existing Icon component used in the dock. */
  icon: "focus" | "review" | "sparkle"
  /** Eyebrow above the command window query (e.g. clock + day). */
  eyebrow: string
  /** Text rendered inside the fake search input. */
  query: string
  /** Right-side context chip in the command bar. */
  scope: string
  resultRows: HeroWidgetResultRow[]
  meta: Array<[string, string]>
  previewImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  footerLabel: string
  footerAction: string
  footerKbd: string
}

export type HeroWidgetContent = {
  eyebrow: string
  modes: HeroWidgetMode[]
  cycleIntervalMs: number
}

export const heroWidget: HeroWidgetContent = {
  eyebrow: "A Tuesday, held in one system",
  cycleIntervalMs: 4500,
  modes: [
    {
      id: "session-tracking",
      label: "Session Tracking",
      hint: "Intent vs. the active window, in real time.",
      icon: "focus",
      eyebrow: "10:42 AM · Tuesday",
      query: "Drafting the Q3 activation memo",
      scope: "Session running · 42 min",
      resultRows: [
        {
          title: "Pages — Q3 activation memo",
          subtitle: "On the declared intent",
          accent: "alive",
          active: true,
        },
        {
          title: "Linear — onboarding experiment review",
          subtitle: "Related work, parked for the next block",
          accent: "neutral",
        },
        {
          title: "Slack — #launch-bugs thread",
          subtitle: "Drift · pulled in by a mention",
          accent: "warn",
        },
      ],
      meta: [
        ["Intent", "Draft Q3 activation memo"],
        ["Active window", "Pages — Memo (Q3)"],
        ["Alignment", "On track"],
        ["Elapsed", "42 min of 60"],
      ],
      previewImage: {
        src: "/screenshots/screens/CommandView_running_dark.png",
        alt: "Locus tracking a running session on the Q3 activation memo, with the active window classified as on-intent.",
        width: 2880,
        height: 1800,
      },
      footerLabel: "Session Tracking",
      footerAction: "Open session",
      footerKbd: "⌘ ↵",
    },
    {
      id: "day-visibility",
      label: "Day Visibility",
      hint: "The day still leaves a trail when the plan bends.",
      icon: "review",
      eyebrow: "3:18 PM · Tuesday",
      query: "Where did this afternoon actually go?",
      scope: "Day trail · 6 entries",
      resultRows: [
        {
          title: "11:30 · Surprise sync with launch lead",
          subtitle: "Pulled in mid-memo · 22 min",
          accent: "warn",
        },
        {
          title: "12:10 · Booked the dentist · 6 min",
          subtitle: "Personal admin · folded into the trail",
          accent: "neutral",
        },
        {
          title: "1:40 · Onboarding experiment review",
          subtitle: "Linear · 38 min · back on plan",
          accent: "alive",
          active: true,
        },
        {
          title: "2:24 · French · Anki run · 11 min",
          subtitle: "Personal goal · held the daily chain",
          accent: "alive",
        },
      ],
      meta: [
        ["Planned blocks", "3"],
        ["Interruptions", "2 (sync, Slack escalation)"],
        ["Personal goals touched", "French, dentist"],
        ["Coverage", "Trail intact"],
      ],
      previewImage: {
        src: "/screenshots/screens/MenuBarWidget_running_dark.png",
        alt: "Locus menu-bar widget showing the day's trail of sessions and interruptions through Tuesday afternoon.",
        width: 2880,
        height: 1800,
      },
      footerLabel: "Day Visibility",
      footerAction: "Open day trail",
      footerKbd: "⌘ D",
    },
    {
      id: "review-loop",
      label: "Review Loop",
      hint: "Today's mess becomes tomorrow's shape.",
      icon: "sparkle",
      eyebrow: "6:04 PM · Tuesday",
      query: "Close out Tuesday · what was today actually for?",
      scope: "Daily review · ready",
      resultRows: [
        {
          title: "Q3 activation memo moved a real step",
          subtitle: "1h 24m of focused writing · ship-ready draft",
          accent: "alive",
          active: true,
        },
        {
          title: "Launch-bugs thread cost the afternoon",
          subtitle: "Two reactive blocks · revisit triage cadence",
          accent: "warn",
        },
        {
          title: "Personal goals held the chain",
          subtitle: "French · dentist booked · run skipped",
          accent: "neutral",
        },
      ],
      meta: [
        ["Memo progress", "+1 section, ready for review"],
        ["Personal chain", "French held · run rolled to Wednesday"],
        ["Tomorrow's first block", "Onboarding experiment write-up"],
        ["One honest question", "Was the 11:30 sync worth the cost?"],
      ],
      previewImage: {
        src: "/screenshots/screens/ReviewView_weekly_dark.png",
        alt: "Locus daily review surface summarizing Tuesday's wins, costs, and the shape of Wednesday.",
        width: 2880,
        height: 1800,
      },
      footerLabel: "Review Loop",
      footerAction: "Open review",
      footerKbd: "⌘ R",
    },
  ],
}
