// The long form of the manifesto's decisions list (new 2026-08-20).
//
// The letter names six decisions in one line each; this is where each one is
// argued out — what was on the table, what we chose, why, and what it costs
// the reader. Titles and one-liners are NOT duplicated here: they are read
// from `manifesto.decisions`, so the two surfaces can never drift, and the
// order on this page is the order in the letter.
//
// Ground truth for every claim below is the product repo
// (/Users/cippa/Desktop/fly/pomodoro-preview): CONTEXT.md and docs/adr/ —
// 0001 (local-first, account as license), 0002/0008 (providers, Remote as a
// thin proxy), 0009 (every prompt is a routine file), 0010 (Remote credits),
// 0011 (memory compounding), 0015 (external MCP servers). Its README.md and
// ARCHITECTURE.md are pre-pivot; never source a claim from them.

import { manifesto, type ManifestoDecision } from "./manifesto"

/**
 * "shipped" — in the app today. "next" — decided and written down, not yet
 * built. A "next" decision must carry a `note` chip in the letter too
 * (pinned in architecture.test.ts), so the page and the letter can never
 * disagree about what exists.
 */
export type ArchitectureStatus = "shipped" | "next"

export type ArchitectureDeepDive = {
  status: ArchitectureStatus
  /** What was actually on the table, phrased as the question we had to answer. */
  question: string
  /** The call. Present tense, concrete, no hedging. */
  choice: string
  /** Why that one — the argument, not the benefits. */
  reasons: string[]
  /** What it costs the reader. Never empty: a decision with no cost is a slogan. */
  tradeoff: string
}

export type ArchitectureDecision = ManifestoDecision &
  ArchitectureDeepDive & { index: number }

const DEEP_DIVES: Record<string, ArchitectureDeepDive> = {
  "build-the-armor": {
    status: "shipped",
    question:
      "Write our own agent loop, or drive the one already installed on your Mac?",
    choice:
      "Locus drives your harness — the Claude Code or Codex binary you already have — and hands it a small tool server of its own. We write no agent loop, no model routing, no reasoning.",
    reasons: [
      "The agent loop is the fastest-moving part of this field. Anything we wrote would be a year behind by the time it shipped, and we would spend our days maintaining it instead of the product.",
      "What we can genuinely add is everything around the model: the sensors that see the day, the tools it can act with, and a UI that makes both legible. That is the armor. The brain is rented, and it keeps getting better without us.",
      "You already pay for a frontier harness. Reselling you a worse one at a markup is not a business worth being in.",
    ],
    tradeoff:
      "Locus is only as good as the harness beneath it, and a CLI that changes its flags can break us. We settle that with live probes against the installed binary rather than assumptions, and the seam stays deliberately narrow.",
  },
  "choose-your-model": {
    status: "shipped",
    question: "Which AI does Locus run on?",
    choice:
      "Whichever you want. A Claude Code or Codex subscription you already pay for, your own API key, or Locus Remote if you would rather set nothing up. The choice is one setting, and it is reversible.",
    reasons: [
      "Models change every few months. A product welded to one vendor ages at that vendor's pace, and its users inherit the wait.",
      "Most people we build for already pay for a frontier subscription. Charging them a second time for the same tokens is hard to justify, so we charge for the software and leave the compute on the account you chose.",
      "Locus Remote exists for the people who do not want any of that — bought as prepaid credits, metered as they are used, never a tier and never part of the trial.",
    ],
    tradeoff:
      "Behavior is not identical across providers: a routine tuned on one model reads differently on another, and one capability — the external tools below — exists only on the bring-your-own legs. We would rather name that than paper over it.",
  },
  "routines-are-files": {
    status: "shipped",
    question:
      "Where do the AI's behaviors live — inside our binary, or in your hands?",
    choice:
      "Every prompt the app runs is a Markdown file on your Mac. The morning digest, the chat reply, the coach that notices you drifting, even the classifier deciding whether the window in front of you matches what you said you would do. Read them, edit them, write your own, share them as packs.",
    reasons: [
      "A prompt sealed in a binary is a behavior you cannot argue with. As a file, it is one you can — and disagreeing with your tools is how they get better.",
      "Different people want different coaching. Hardcoding one personality picks a fight with everyone whose rhythm differs, so we left this layer open on purpose.",
      "One source of truth. No prompt exists in two places, which means what you read is exactly what runs — no shipped copy quietly overriding the visible one.",
    ],
    tradeoff:
      "You can absolutely edit a routine into something worse, and we let you: reset-to-default restores the shipped behavior in one click. The file is only the definition — what a routine is permitted to do is state the app holds, so importing someone else's pack grants it nothing until you say so.",
  },
  "external-tools": {
    status: "next",
    question:
      "Locus's agent can use Locus's tools. Should it be able to reach the rest of your world — Notion, Linear, a Telegram bot?",
    choice:
      "It uses the MCP servers you already connected to your own harness. Locus inherits them; it never hosts a server, installs one, or asks you for its credentials. You allow them one at a time in Settings, before the fact — nothing asks mid-run.",
    reasons: [
      "It matches the model already in your head — “the MCPs I connected to Claude Code.” No second integrations directory to maintain, no OAuth flows for us to hold tokens for, no server for us to run.",
      "This is the operating-system part of the claim, and the reason it belongs beside the other five. We are not trying to ship an app that does everything. We are trying to be the floor you plug your own parts into — the ones that make sense for your setup, and none of the ones that don't.",
      "A 7am routine cannot stop and ask permission, because nobody is there to answer. So consent is given in advance: a routine reaches only the servers its own file names, intersected with what you allowed, and chat may use any tool of an allowed server.",
    ],
    tradeoff:
      "It rides on your harness, so it is a bring-your-own-subscription capability: Locus Remote runs against a home that holds none of your configuration and can never see your servers. And what those tools do lands outside Locus — not an undoable action, not covered by autonomy mode. Newly discovered servers stay blocked; allowing one is always something you do on purpose.",
  },
  "gets-to-know-you": {
    status: "shipped",
    question: "Where does what the AI learns about you live?",
    choice:
      "In a Markdown wiki on your Mac, shown in the app as a tree you can open, correct, and delete from. The digests it writes land there too, so each one has the earlier ones to build on.",
    reasons: [
      "Adaptation you cannot inspect is indistinguishable from a system quietly getting you wrong — and you would have no way to tell which one you had.",
      "Compounding needs a durable artifact. A chat log is not memory; a file the next run actually reads is.",
      "It is a picture of you. The person in the picture should be able to edit it.",
    ],
    tradeoff:
      "Memory is only as good as what it was given, and a wrong note stays wrong until somebody fixes it. That is precisely why it is a tree of files you can read, rather than an embedding you cannot.",
  },
  "local-first": {
    status: "shipped",
    question: "Whose servers hold your day?",
    choice:
      "Nobody's. Sessions, projects, notes, chat history and the AI's memory of you are a database and plain files on your Mac. The account exists to carry your license — not your data.",
    reasons: [
      "The context that makes Locus useful is the most personal data you own: what you meant to do, what you actually did, and where the day went instead. The safest place for it is the machine you already trust with it.",
      "It keeps working when the network doesn't — and when a subscription lapses, the app goes read-only while your data stays there, intact and yours.",
      "It makes the promise checkable rather than rhetorical. Reveal-my-data-in-Finder is the export; deleting that folder is the deletion.",
    ],
    tradeoff:
      "No cross-device sync in this version, and no cloud backup we can restore for you — your backups are your Mac's backups. If you run Locus Remote, prompts do pass through our relay to reach a model: it meters usage totals and keeps no prompt or response content.",
  },
}

export type ArchitectureContent = {
  eyebrow: string
  title: string
  intro: string
  /** Sits under the intro; names what this page is not. */
  note: string
  lastUpdated: string
  indexLabel: string
  decisions: ArchitectureDecision[]
  backLink: { text: string; linkLabel: string; href: string }
}

export const architecture: ArchitectureContent = {
  eyebrow: "Architecture",
  title: "Architecture decisions",
  intro:
    "Six calls that shaped Locus more than any feature did. The manifesto names them in a line each. This page argues them out: what was on the table, what we chose, why, and what it costs you.",
  note: "Nothing here is a roadmap. A decision is listed once it is settled, and each one says plainly whether it is in the app today.",
  lastUpdated: "2026-08-20",
  indexLabel: "The six",
  // Order, titles and one-liners come from the letter; only the argument is
  // new. A decision without a deep dive throws at import instead of shipping
  // a blank entry.
  decisions: manifesto.decisions.map((decision, i) => {
    const dive = DEEP_DIVES[decision.id]
    if (!dive) {
      throw new Error(
        `architecture: no deep dive for manifesto decision "${decision.id}" — add one to DEEP_DIVES or drop it from the letter.`
      )
    }
    return { ...decision, ...dive, index: i + 1 }
  }),
  backLink: {
    text: "These six are the short list from",
    linkLabel: "the manifesto",
    href: "/#design-decisions",
  },
}

/**
 * Chip copy beside each decision. Every entry carries one — the reassuring
 * label on the five that shipped is what makes the sixth's label honest
 * rather than decorative.
 */
export const STATUS_LABELS: Record<ArchitectureStatus, string> = {
  shipped: "In the app today",
  next: "Decided · shipping next",
}
