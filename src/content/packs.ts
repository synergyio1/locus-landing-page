// The pack catalog (new 2026-08-20).
//
// A pack is a whole coaching method expressed as the AI behaviours Locus runs.
// Packs shipped to `preview` on 2026-08-18; this page is the first public
// surface for them.
//
// GROUND TRUTH is the product repo (/Users/cippa/Desktop/fly/pomodoro-preview):
//   · Locus/Packages/LocusData/Sources/LocusData/Resources/RoutinePacks/<id>/
//     — pack.md (manifest + the written method), stance.md, routines/*.md
//   · docs/adr/0012-routine-packs-one-active-overlay.md
//   · docs/design-docs/routine-packs.md
// Its README.md and ARCHITECTURE.md are pre-pivot; never source a claim there.
//
// Every string below is transcribed from those files, not rewritten. If a pack
// changes in the app, change it here — do not improve the prose in passing.
//
// TWO RULES THAT ARE NOT STYLE CHOICES (ADR-0012, decision 12):
//   1. A pack is NEVER named after a person or a book. The method carries the
//      name; the credit lives in `inspiredBy`. "Relentless", never "the Kobe
//      pack". This is trademark/publicity exposure on a shipped feature.
//   2. One pack is active at a time. Stacking was considered and rejected.
// Both are pinned in packs.test.ts.

/**
 * What a pack does to a routine.
 *
 * `runs` is only used by the baseline pack (General), whose roster is the
 * stock set rather than a diff against it.
 */
export type PackChange = "runs" | "replaces" | "adds" | "retires"

export type PackRoutine = {
  /** The routine's slug in the app. Unique within a pack. */
  slug: string
  /** User-visible name, from the routine file's frontmatter. */
  name: string
  description: string
  /** Scheduled time, when the routine is temporal. */
  time?: string
  change: PackChange
  /** What it stands in for — only on `replaces`. */
  replaces?: string
}

export type PackPrinciple = { title: string; body: string }

export type Pack = {
  /** Matches the pack's folder name in the app. */
  id: string
  name: string
  /** Verbatim manifest `summary:`. */
  summary: string
  /** Verbatim manifest `inspired_by:`. Absent on first-party methods. */
  inspiredBy?: string
  /** The manifest's opening paragraph. */
  lede: string
  /** The bolded blocks of the manifest body. May be empty (Quiet has none). */
  principles: PackPrinciple[]
  /** A paragraph that isn't a principle — Quiet's middle beat. */
  note?: string
  /** Verbatim stance.md — the coach's accent. Absent on General and Quiet. */
  stance?: string
  routines: PackRoutine[]
  /** The manifest's last line. */
  closer: string
  /** The stock method the others are a diff against. */
  baseline?: boolean
}

export type PacksContent = {
  eyebrow: string
  title: string
  intro: string
  definition: string
  layering: string
  rules: { title: string; body: string }[]
  rosterLabels: Record<Exclude<PackChange, "runs">, string>
  runsLabel: string
  howToTitle: string
  howTo: string
  communityTitle: string
  community: string
  packs: Pack[]
  backLink: { text: string; linkLabel: string; href: string }
}

const PACKS: Pack[] = [
  {
    id: "general",
    name: "General",
    baseline: true,
    summary:
      "Locus's own method — a great calendar, honest adherence, memory that compounds.",
    lede: "General is Locus without a coach's accent. It is the method the app was built around, written down so you can see what the other packs change.",
    principles: [
      {
        title: "The system comes first.",
        body: "The unit of a good day is not a focus session; it is a calendar you believe in and the degree to which you followed it. Sessions are evidence of execution, not the goal. Budgets and Watch tell you where the hours actually went; the plan tells you where you meant them to go; adherence is the gap between the two, and it is the one number Locus cares about improving.",
      },
      {
        title: "Rewards follow the system, not the outcome.",
        body: "You do not get praise for feeling productive or for hours logged. You get an honest read on whether you did what you said you would do, and a fair note when you did.",
      },
      {
        title: "The Portrait compounds.",
        body: "Every session, every reclassification, every reply you give a digest is a vote about who you are and when you work well. The wiki keeps that portrait, tentative at first, firmer as evidence accumulates; every routine reads it before it speaks.",
      },
    ],
    routines: [
      {
        slug: "morning-brief",
        name: "Morning brief",
        description: "The shape of today and the clearest first move.",
        time: "09:00",
        change: "runs",
      },
      {
        slug: "daily-digest",
        name: "Daily digest",
        description:
          "Three bullets on the day, one thing to try tomorrow, the questions Locus wasn't sure about.",
        time: "18:00",
        change: "runs",
      },
      {
        slug: "weekly-digest",
        name: "Weekly digest",
        description:
          "What we noticed, what it might mean, what to try, what we're testing.",
        change: "runs",
      },
      {
        slug: "monthly-digest",
        name: "Monthly digest",
        description: "The same read, over a month of evidence.",
        change: "runs",
      },
      {
        slug: "distraction-coach",
        name: "Distraction coach",
        description:
          "One quiet line when a focus session is genuinely derailing. Off by default.",
        change: "runs",
      },
      {
        slug: "memory-ingest",
        name: "Portrait ingest",
        description: "Silent; folds the evidence into the portrait.",
        change: "runs",
      },
      {
        slug: "chat-reply",
        name: "Chat",
        description:
          "The Flywheel: reflective, plainspoken, observation over prescription.",
        change: "runs",
      },
    ],
    closer:
      "Choose another pack when you want a different coach at the same instruments. Come back to General when you want the instruments alone.",
  },
  {
    id: "quiet",
    name: "Quiet",
    summary: "Portrait and chat only. Nothing proactive but the weekly.",
    lede: "Quiet turns the proactive layer off and keeps the two things that need no invitation: the memory that compounds in the background and the chat that answers when you ask.",
    principles: [],
    note: "The weekly digest stays — one honest read a week is the minimum for the memory to be worth having. Everything else that would speak first is turned off when you activate this pack; the activation sheet shows exactly which, and General's sheet turns them back on.",
    routines: [
      {
        slug: "weekly-digest",
        name: "Weekly digest",
        description: "The one read that stays. Once a week, unprompted.",
        change: "runs",
      },
      {
        slug: "memory-ingest",
        name: "Portrait ingest",
        description: "Silent; keeps building the portrait in the background.",
        change: "runs",
      },
      {
        slug: "chat-reply",
        name: "Chat",
        description: "Answers when you ask, and only then.",
        change: "runs",
      },
      {
        slug: "morning-brief",
        name: "Morning brief",
        description: "Turned off — nothing greets you in the morning.",
        change: "retires",
      },
      {
        slug: "daily-digest",
        name: "Daily digest",
        description: "Turned off — no end-of-day read.",
        change: "retires",
      },
      {
        slug: "monthly-digest",
        name: "Monthly digest",
        description: "Turned off — the weekly carries the reflection.",
        change: "retires",
      },
      {
        slug: "distraction-coach",
        name: "Distraction coach",
        description: "Turned off — Locus watches, but never interrupts.",
        change: "retires",
      },
    ],
    closer: "For people who want Locus to observe and remember, not to talk.",
  },
  {
    id: "deep-work",
    name: "Deep Work",
    inspiredBy: "Cal Newport's Deep Work",
    summary:
      "Time-block the day, protect the deep blocks, close with a shutdown ritual.",
    lede: "Deep Work is for people whose output depends on long, undistracted stretches and who want the day organized around protecting them. The method: time-block every day; know which blocks are deep and which are shallow; treat quick checks as the enemy; drain the shallows; and end the day with a shutdown ritual so the mind can actually stop.",
    principles: [
      {
        title: "Time-block.",
        body: "The morning brief lays out today's blocks with a deep or shallow label. If the day isn't blocked yet, the brief says so and asks for the deep blocks first.",
      },
      {
        title: "Quick-check watch.",
        body: "The distraction coach is on and tuned to the quick check — messaging, social, the tab you didn't plan — and says one line: name the check, back to the block.",
      },
      {
        title: "Shutdown ritual.",
        body: "The daily reflection is the shutdown: open loops (what's due, what's overdue), tomorrow's blocks, and the day's deep-versus-shallow read from Watch. It ends with “shutdown complete”, and that is meant literally.",
      },
      {
        title: "Deep hours.",
        body: "The weekly reads the deep-to-shallow ratio, names one shallow thing to drain and one deep block to protect.",
      },
    ],
    stance:
      "Dry and exacting. Deep work is the goal and everything else is triage; you say which blocks were deep, which were shallow, and what interrupted them, in plain declarative sentences. You praise a protected block and a clean shutdown; you do not praise responsiveness, multitasking, or hours that were mostly switching. You treat a quick check as a cost with a name, never as a moral failing, and you never moralize about it. Your signature framing is the ratio of deep to shallow and the one block worth protecting tomorrow.",
    routines: [
      {
        slug: "morning-brief",
        name: "Time-block",
        description:
          "Today's blocks in order, labelled deep or shallow, and the first action of the first deep block.",
        time: "08:30",
        change: "replaces",
        replaces: "the morning brief",
      },
      {
        slug: "daily-digest",
        name: "Shutdown ritual",
        description:
          "The day read as deep, shallow, or switching — open loops, tomorrow's first deep block, and a hard stop.",
        time: "17:30",
        change: "replaces",
        replaces: "the daily digest",
      },
      {
        slug: "weekly-digest",
        name: "Deep hours",
        description:
          "The week's deep-to-shallow read — where the shallows leaked in, one to drain, one to protect.",
        time: "16:00",
        change: "replaces",
        replaces: "the weekly digest",
      },
      {
        slug: "distraction-coach",
        name: "Quick-check watch",
        description:
          "Names the quick check and points back to the block, in one line. On, where the default is off.",
        change: "replaces",
        replaces: "the distraction coach",
      },
    ],
    closer: "For people who measure the day in uninterrupted hours.",
  },
  {
    id: "relentless",
    name: "Relentless",
    inspiredBy: "Kobe Bryant's approach to preparation and practice",
    summary: "Film study, one weakness at a time, no days off.",
    lede: "Relentless is for people who want to be held to what they committed to — not to more hours, to execution. The method is borrowed from how a great player prepares: watch the film, find the one weakness, drill it, show up every day, and never mistake effort for the job.",
    principles: [
      {
        title: "Film study.",
        body: "The day is reviewed block by block against the plan you wrote. Where you executed, the film says so in one line. Where you were soft — a block that slipped, an app that pulled you, a start that came late — the film names it. No cushioning, no lecture, one detail to fix.",
      },
      {
        title: "One weakness at a time.",
        body: "Every week ends by isolating one thing to drill the following week. Not a list. One.",
      },
      {
        title: "No days off.",
        body: "If a weekday has a plan and nothing has started by midday, you hear about it. If a weekday has no plan at all, you hear about that too.",
      },
      {
        title: "Extra rep.",
        body: "When the day's plan is fully executed and you are still at the keyboard, the coach names the smallest next block. It never asks for more when the plan isn't done.",
      },
    ],
    stance:
      "Blunt and terse. You praise execution — a block done as committed, a plan followed on a hard day — and nothing else; effort, hours, and busyness get no credit. You name where the user was soft in one plain sentence and move on; you never scold, never lecture, never stack criticisms. You do not use metaphors, mottos, or set pieces; you say the thing. Your signature question is what got executed that was committed.",
    routines: [
      {
        slug: "morning-brief",
        name: "Film first",
        description: "Yesterday's film in three lines, then today's first block.",
        time: "07:00",
        change: "replaces",
        replaces: "the morning brief",
      },
      {
        slug: "daily-digest",
        name: "Film study",
        description:
          "The day's execution against what was committed, and the one detail to fix.",
        time: "21:00",
        change: "replaces",
        replaces: "the daily digest",
      },
      {
        slug: "weekly-digest",
        name: "One weakness",
        description:
          "The week's adherence, and the single weakness to isolate and drill next.",
        time: "16:00",
        change: "replaces",
        replaces: "the weekly digest",
      },
      {
        slug: "distraction-coach",
        name: "Distraction coach",
        description:
          "Call the derail the first time it is real, and name the move back to the block.",
        change: "replaces",
        replaces: "the distraction coach",
      },
      {
        slug: "no-days-off",
        name: "No days off",
        description:
          "Midday check that the day's first committed block has actually started.",
        time: "12:00",
        change: "adds",
      },
      {
        slug: "extra-rep",
        name: "Extra rep",
        description:
          "When today's plan is fully executed and you are still working, name the smallest next block.",
        change: "adds",
      },
    ],
    closer:
      "Not for people who want encouragement. For people who want a coach who watched the tape.",
  },
  {
    id: "compound",
    name: "Compound",
    inspiredBy: "James Clear's Atomic Habits",
    summary: "Identity votes, two-minute starts, never miss twice.",
    lede: "Compound is for people who want change to be small, obvious, and repeatable. The method: every action is a vote for the kind of person you are becoming; make the right thing obvious and easy; start with the two-minute version; when you miss, don't miss twice; and design the environment instead of relying on willpower.",
    principles: [
      {
        title: "Two-minute start.",
        body: "The morning brief names the two-minute version of your first block and one habit stack — a habit due today, anchored to that block: after X, I will Y.",
      },
      {
        title: "Votes cast.",
        body: "The daily reflection reads the day as votes: what today's blocks and hours voted for, one one-percent adjustment for tomorrow. No guilt; a missed vote is information.",
      },
      {
        title: "Scorecard.",
        body: "The weekly is a habit scorecard — plus, minus, equals — from your recurring habits and Watch, and one environment tweak: a budget as friction, a block moved earlier, a cue made visible.",
      },
      {
        title: "Never miss twice.",
        body: "If yesterday went un-executed and today has nothing started by mid-morning, one gentle line: missing once is an accident, missing twice is the start of a new habit — what's the two-minute version?",
      },
      {
        title: "Make it invisible.",
        body: "When a session derails, the coach names the app; the digest, later, proposes the friction.",
      },
    ],
    stance:
      "Warm and curious. You read evidence as votes for an identity — “someone who starts on time”, “someone who protects the morning” — and you say which way today voted, without guilt and without cheerleading. You praise the smallest real start over the biggest intention, and you notice systems and environments before you notice willpower. You never shame a miss and never call anyone lazy; a miss is information and the question is what the two-minute version is.",
    routines: [
      {
        slug: "morning-brief",
        name: "Two-minute start",
        description:
          "The smallest start that counts, and one habit stacked on today's first block.",
        time: "09:00",
        change: "replaces",
        replaces: "the morning brief",
      },
      {
        slug: "daily-digest",
        name: "Votes cast",
        description:
          "What today voted for, and one one-percent adjustment for tomorrow.",
        time: "18:30",
        change: "replaces",
        replaces: "the daily digest",
      },
      {
        slug: "weekly-digest",
        name: "Scorecard",
        description:
          "Plus, minus, equals on the week's habits — and one environment tweak.",
        time: "16:00",
        change: "replaces",
        replaces: "the weekly digest",
      },
      {
        slug: "never-miss-twice",
        name: "Never miss twice",
        description:
          "One line the morning after a missed day, when today hasn't started either.",
        time: "10:30",
        change: "adds",
      },
    ],
    closer:
      "For people who want to be someone who shows up, one small vote at a time.",
  },
  {
    id: "process",
    name: "Process",
    inspiredBy: "Michael Phelps and Bob Bowman's training method",
    summary:
      "The plan is the product. Play the tape, keep the logbook, trust the process.",
    lede: "Process is for people who want the day to be decided before it starts and reviewed after it ends, calmly, every day. The method comes from a swimmer and a coach who won by writing the plan the night before, visualizing the race until it was boring, logging everything, and training for the moment the goggles fill with water.",
    principles: [
      {
        title: "The plan is written the night before.",
        body: "In the evening, if tomorrow has no committed plan, you are asked to write its first two blocks. Nothing else happens until you do.",
      },
      {
        title: "Play the tape.",
        body: "The morning brief walks today's blocks in order as a visualization: where you'll be, what “done” looks like for each, and the first physical action of the first block.",
      },
      {
        title: "Keep the logbook.",
        body: "The daily reflection is a logbook, not a mood check: planned versus actual, block by block; the deviations become questions, because the cause is yours to name, not the coach's to guess; tomorrow's first block closes the entry.",
      },
      {
        title: "Train for adversity.",
        body: "When a session derails, the coach does not analyze — you trained for this; back to the block.",
      },
      {
        title: "Process, not outcome.",
        body: "The weekly reads adherence and consistency across the week, never scores.",
      },
    ],
    stance:
      "Calm and factual — a coach on the pool deck with a stopwatch, not a motivator. You talk about blocks, starts, and adherence: what was planned, what happened, what the next block is. You never talk about scores, streak pressure, or how the user should feel; a bad day is a data point in a long season and gets the same even tone as a good one. You don't dramatize adversity and you don't console it — you name the next block.",
    routines: [
      {
        slug: "morning-brief",
        name: "Play the tape",
        description:
          "Walk today's blocks in order, then the first physical action of the first one.",
        time: "08:00",
        change: "replaces",
        replaces: "the morning brief",
      },
      {
        slug: "daily-digest",
        name: "Logbook",
        description:
          "Planned versus actual, block by block — the day's entry in the logbook.",
        time: "21:00",
        change: "replaces",
        replaces: "the daily digest",
      },
      {
        slug: "weekly-digest",
        name: "The week's process",
        description:
          "Adherence and consistency across the week, and the one process fix for the next one.",
        time: "16:00",
        change: "replaces",
        replaces: "the weekly digest",
      },
      {
        slug: "tomorrows-tape",
        name: "Tomorrow's tape",
        description:
          "When tomorrow has no plan yet, ask for its first two blocks tonight.",
        time: "20:30",
        change: "adds",
      },
    ],
    closer: "For people who want less drama and more plan.",
  },
]

export const packs: PacksContent = {
  eyebrow: "Packs",
  title: "Choose how Locus coaches you.",
  intro:
    "A pack is a whole coaching method, expressed as the behaviours Locus runs for you — when it speaks, what it reads before it does, and how it talks to you when it does. Activate one and the day changes shape. Six ship with Locus.",
  definition:
    "Every AI behaviour in Locus is a routine: a plain file with a trigger, the tools it may use, and the instructions it follows. A pack is a set of those files with a point of view — a method, written down, that you can read before you accept it.",
  layering:
    "Locus's defaults sit underneath. The active pack sits on top of them. Your own edits sit on top of everything.",
  rules: [
    {
      title: "One at a time.",
      body: "A pack is a method, not a plugin. Activating one stands in for the last; they never stack, because two coaches talking at once is not a method.",
    },
    {
      title: "Switching keeps your edits.",
      body: "Nothing is copied into or removed from your routines folder. Before anything changes, a sheet shows you every routine the pack replaces, adds, or turns off — and every switch in it is yours to overrule.",
    },
    {
      title: "A pack changes the coach, not the record.",
      body: "It can change when a routine runs, what it reads, and how it speaks. It cannot change what Locus writes down about you — the portrait stays neutral whichever method you pick.",
    },
  ],
  rosterLabels: {
    replaces: "Replaces",
    adds: "Adds",
    retires: "Turns off",
  },
  runsLabel: "Runs",
  howToTitle: "How to use one",
  howTo:
    "Open Routines in Locus and pick a pack. You'll see the whole resulting roster before anything happens — what changes, what's added, what goes quiet — and you can adjust any of it on the way in. Switching back is the same gesture.",
  communityTitle: "Packs are meant to travel",
  community:
    "Because a pack is just files, it can be shared. You can export your own from the app and import someone else's today. A place to browse, publish and discuss them is what this page becomes next — the methods people actually run are worth more together than apart.",
  packs: PACKS,
  backLink: {
    text: "Packs are the layer we deliberately left open, described in",
    linkLabel: "the manifesto",
    href: "/#design-decisions",
  },
}

export function findPack(id: string): Pack | undefined {
  return PACKS.find((pack) => pack.id === id)
}
