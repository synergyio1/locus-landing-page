import * as React from "react"
import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import {
  DecisionEmblem,
  type DecisionEmblemName,
} from "@/components/ui/decision-emblem"
import {
  designDecisions,
  type DesignDecision,
} from "@/content/design-decisions"
import { cn } from "@/lib/utils"

/** Cards per hand from lg up: two rows of three (Luis, 2026-09-02 — six in
 *  one line was "too much text in a line"). */
const PER_ROW = 3

/**
 * Fan geometry for one row of the lg+ deck. Cards pivot around their bottom
 * edge; the outer ones tilt outward and sit lower, so each row reads as a
 * hand of cards laid open on a table (Luis: "a beautiful stack of cards, like
 * a baralho open"). Symmetric around the centre of the row.
 */
function fan(indexInRow: number) {
  const offset = indexInRow - (PER_ROW - 1) / 2 // -1, 0, 1
  return {
    angle: offset * 4, // -4°, 0°, 4°
    drop: offset * offset * 10, // 10, 0, 10 px — the arc
  }
}

/**
 * The six design decisions as their own small section right under the
 * letter (they used to close the manifesto; pulled out 2026-09-02). Below lg
 * it is a plain grid of upright cards; from lg they fan out as two hands of
 * three, and a hovered card straightens and lifts to the front.
 */
export function DesignDecisions() {
  return (
    <section
      id={designDecisions.id}
      aria-labelledby="design-decisions-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-28">
        <SpringReveal as="div" className="flex max-w-[60ch] flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-text)]">
            {designDecisions.eyebrow}
          </span>
          <h2
            id="design-decisions-heading"
            className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-4xl"
          >
            {designDecisions.heading}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)] md:text-[15px]">
            {designDecisions.intro}
          </p>
        </SpringReveal>

        {/* The deck: two hands of three from lg, held a little narrower than
            the shell so the cards keep card proportions. `pt`/`pb` give the
            lifted centre and the dropped ends room to move. */}
        <SpringReveal
          delay={120}
          as="ol"
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:mx-auto lg:max-w-[1180px] lg:grid-cols-3 lg:gap-x-0 lg:gap-y-12 lg:px-6 lg:pt-4 lg:pb-6"
        >
          {designDecisions.items.map((decision, i) => (
            <DeckCard key={decision.id} decision={decision} index={i} />
          ))}
        </SpringReveal>

        <SpringReveal
          delay={200}
          as="p"
          className="mt-8 text-sm leading-relaxed text-[var(--muted-foreground)] md:mt-10"
        >
          {designDecisions.blog.text}{" "}
          {designDecisions.blog.href ? (
            <Link
              href={designDecisions.blog.href}
              className="text-[var(--accent-text)] underline decoration-[color-mix(in_oklab,var(--accent)_45%,transparent)] underline-offset-4 transition-colors hover:decoration-[var(--accent-text)]"
            >
              {designDecisions.blog.linkLabel}
            </Link>
          ) : (
            <>
              <span className="text-[var(--fg)]">{designDecisions.blog.linkLabel}</span>
              {designDecisions.blog.pendingNote
                ? ` ${designDecisions.blog.pendingNote}`
                : null}
            </>
          )}
          .
        </SpringReveal>
      </PageShell>
    </section>
  )
}

/** One playing-card-proportioned card, built the way a real card is: the
 *  index in the top corner, the copy, and the decision's emblem as the big
 *  pip in the bottom corner. */
function DeckCard({
  decision,
  index,
}: {
  decision: DesignDecision
  index: number
}) {
  const { angle, drop } = fan(index % PER_ROW)
  const emblem: DecisionEmblemName = decision.emblem
  const numeral = String(index + 1).padStart(2, "0")

  return (
    <li
      id={`decision-${decision.id}`}
      style={
        { "--fan": `${angle}deg`, "--arc": `${drop}px` } as React.CSSProperties
      }
      className={cn(
        "relative flex min-w-0 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6",
        // Hairline first, then the fill, then a soft ink shadow tucked under
        // the card — canvas carries the weight (DESIGN.md).
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_12px_32px_-20px_rgb(11_26_51/0.35)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        // lg+: the fan. The middle card of each hand overlaps its neighbours
        // and sits on top, the way the centre of a fanned hand does.
        "lg:min-h-[21rem] lg:[transform-origin:50%_100%] lg:[transform:rotate(var(--fan))_translateY(var(--arc))] lg:[&:nth-child(3n+2)]:z-[1] lg:[&:nth-child(3n+2)]:-mx-3",
        // Hover: straighten, lift to the front, rim the edge with a hint of Cobalt.
        "lg:hover:z-10 lg:hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] lg:hover:[transform:rotate(0deg)_translateY(-12px)] lg:hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_28px_48px_-22px_rgb(11_26_51/0.4)]"
      )}
    >
      <span
        aria-hidden
        className="font-mono text-xs tracking-[0.18em] text-[var(--accent-text)]"
      >
        {numeral}
      </span>
      <h3 className="mt-5 text-[17px] font-medium leading-snug text-[var(--fg)] md:text-lg">
        {decision.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted-foreground)] md:text-[15px]">
        {decision.summary}
      </p>
      <span className="mt-auto self-end pt-6 text-[var(--accent-text)]">
        <DecisionEmblem name={emblem} size={64} />
      </span>
    </li>
  )
}
