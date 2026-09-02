// The six design decisions, pulled out of the manifesto letter on 2026-09-02
// (Luis: remove the six from the middle of the manifesto and make a very
// simple design-decisions part) into their own small section right under the
// letter — a fanned deck of six cards, one icon each. The list is the one the
// letter used to end on; the design-ideas blog note moved with it.

/**
 * The card's emblem — one bespoke mark per decision in ui/decision-emblem.tsx
 * (the deck's "suits"; the generic stroke icons were replaced 2026-09-02).
 */
export type DesignDecisionEmblem =
  | "armor"
  | "dial"
  | "files"
  | "modules"
  | "portrait"
  | "device"

export type DesignDecision = {
  /** Stable key; also the card's anchor fragment (`#decision-<id>`). */
  id: string
  title: string
  summary: string
  emblem: DesignDecisionEmblem
}

export type DesignDecisionsContent = {
  /**
   * Section anchor. Deliberately count-free (it was "five-decisions" until
   * the sixth arrived on 2026-08-20) — the next one shouldn't break links.
   */
  id: string
  eyebrow: string
  heading: string
  intro: string
  /**
   * Exactly the core design decisions Luis wants named — five as of 2026-08-17,
   * reframed the same day around build / borrow / leave-open; six as of
   * 2026-08-20, when "Plug in your own tools" joined the leave-open group
   * (product ADR-0015). The day feedback loop was cut from this list on
   * purpose, and "Bring your own AI" was folded into "Choose your model"
   * (they were redundant); don't re-add either.
   * Summaries stay under ~165 characters — Luis's cap from when they lived
   * in the letter column; on a deck card that is about eight short lines.
   *
   * A long-form "Architecture decisions" tab — each one argued out as
   * question / choice / why / cost — was built and then pulled the same day
   * (Luis: "it was just to record to do it later"). The draft page and
   * content module are recoverable at commit bb307b6.
   */
  items: DesignDecision[]
  blog: {
    text: string
    linkLabel: string
    /** Set once the design-ideas blog exists; until then the text renders plain. */
    href?: string
    /** Shown after the label only while `href` is unset. */
    pendingNote?: string
  }
}

export const designDecisions: DesignDecisionsContent = {
  id: "design-decisions",
  eyebrow: "How we built it",
  heading: "Six design decisions",
  intro:
    "Early on we split the system in three: the parts we should build ourselves, the parts we should borrow, and the parts we should leave open for the community to evolve. Most of what follows comes from that split.",
  items: [
    {
      id: "build-the-armor",
      emblem: "armor",
      title: "We build the armor, not the brain.",
      summary:
        "Rather than rebuild an agentic core, we lean on the state-of-the-art harnesses and put our craft where we truly add value: the sensors, tools, and UI around them.",
    },
    {
      id: "choose-your-model",
      emblem: "dial",
      title: "Choose your model.",
      summary:
        "Your Claude Code or Codex subscription, an API key (say, OpenRouter), or Locus Remote — your choice. Pick the model you prefer, and swap it anytime.",
    },
    {
      // id kept as the anchor; the app renamed Routine → Protocol (PRD #730).
      id: "routines-are-files",
      emblem: "files",
      title: "Protocols are files.",
      summary:
        "Different personalities want different approaches. So we left this part deliberately open: every AI behavior is a Markdown file — read, edit, share, or add your own.",
    },
    {
      id: "external-tools",
      emblem: "modules",
      title: "Plug in your own tools.",
      summary:
        "The MCP servers you already connected to your harness — Notion, Linear, your own — work in Locus too. You switch on the ones that make sense for your setup.",
    },
    {
      id: "gets-to-know-you",
      emblem: "portrait",
      title: "It gets to know you.",
      summary:
        "The more you use it, the better it adapts — your patterns, your rhythms, what actually works. That picture is a wiki on your Mac; if it's wrong, you fix it.",
    },
    {
      id: "local-first",
      emblem: "device",
      title: "Your day lives on your Mac.",
      summary:
        "Local-first and private by design: your data, your routines, and everything Locus knows about you stay on your device. You only log in for the subscription.",
    },
  ],
  blog: {
    text: "For the reasoning behind each of these, be sure to check our",
    linkLabel: "design ideas blog",
    // href: "/blog", — set once the blog exists; the pending note drops out by itself.
    pendingNote: "(coming soon)",
  },
}
