import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { ManifestoToc } from "@/components/sections/manifesto-toc"
import { RotatingWord } from "@/components/ui/rotating-word"
import { manifesto, type ManifestoBlock } from "@/content/manifesto"
import { stripInlineMarks } from "@/lib/inline-marks"
import { cn } from "@/lib/utils"

// Manifesto body ink: the site's muted tone nudged a step toward the ink
// (Luis, 2026-08-17: "just a tiny bit darker") — scoped here, not the token.
const BODY_INK =
  "text-[color-mix(in_oklab,var(--muted-foreground)_75%,var(--fg))]"
const PARAGRAPH = `text-[15px] leading-relaxed md:text-base ${BODY_INK}`
const PARAGRAPH_EMPHASIS =
  "text-[15px] leading-relaxed text-[var(--fg)] md:text-base"
const SUBHEAD =
  "pt-4 text-lg font-semibold tracking-tight text-[var(--fg)] md:text-xl"

/** Clearance for anchor jumps: the fixed header is h-14/h-16, plus breath. */
const HEADING_ANCHOR = "scroll-mt-24"

/**
 * The founder statement. Superlogical-style: one reading column, plain
 * sentences, signed. Same section rhythm as pricing (hairline top border,
 * py-24/36) and the FAQ's two-column split — the statement headline stays
 * pinned on the left while the letter scrolls on the right.
 *
 * The pinned rail also carries the length layer (2026-08-19): a "4 min read"
 * note and a scroll-spy mini-TOC (md+ only) so the letter's shape and end
 * are visible before anyone commits to it. The letter itself stays whole —
 * no pagination, no read-more. The six design decisions closed the letter
 * until 2026-09-02; they are now their own section right below
 * (design-decisions.tsx).
 *
 * The copy's ==marks== (Luis's thesis lines) were drawn as Cobalt ink
 * underlines (ui/ink-underline.tsx) until 2026-09-02; Luis cut the underlines,
 * so paragraphs render the marks stripped. Underlined version at e21eb81.
 */
export function Manifesto() {
  const tocItems = manifesto.blocks.flatMap((b) =>
    b.kind === "h" ? [{ id: b.id, label: b.text }] : []
  )

  return (
    <section
      id={manifesto.id}
      aria-labelledby="manifesto-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-16">
          {/* Statement — pinned while the letter scrolls past on md+. */}
          <div className="md:sticky md:top-28 md:self-start">
            <SpringReveal className="flex flex-col gap-4 md:border-l md:border-[color-mix(in_oklab,var(--accent)_35%,transparent)] md:pl-6">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-text)]">
                {manifesto.eyebrow}
              </span>
              <h2
                id="manifesto-heading"
                className="text-balance text-2xl font-semibold leading-[1.08] tracking-tighter text-[var(--fg)] md:text-3xl lg:text-4xl"
              >
                {manifesto.headline}{" "}
                <RotatingWord
                  words={manifesto.rotating}
                  className="text-[var(--accent-text)]"
                />
              </h2>
              <p className="text-[13px] leading-relaxed text-[var(--muted-foreground)]">
                {manifesto.letterNote}
              </p>
              <ManifestoToc items={tocItems} className="mt-4 hidden md:flex" />
            </SpringReveal>
          </div>

          {/* The letter — a single reading measure. */}
          <div className="max-w-[64ch]">
            <SpringReveal delay={100} as="div" className="flex flex-col gap-4">
              {manifesto.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </SpringReveal>

            <SpringReveal delay={180} as="div" className="mt-12 flex flex-col gap-2">
              <p className={PARAGRAPH_EMPHASIS}>{manifesto.signature.closing}</p>
              <p className="text-[15px] text-[var(--fg)] md:text-base">
                <span aria-hidden className="text-[var(--muted-foreground)]">
                  &mdash;{" "}
                </span>
                <span className="font-medium">{manifesto.signature.name}</span>
              </p>
            </SpringReveal>
          </div>
        </div>
      </PageShell>
    </section>
  )
}

function Block({ block }: { block: ManifestoBlock }) {
  switch (block.kind) {
    case "h":
      return (
        <h3 id={block.id} className={cn(SUBHEAD, HEADING_ANCHOR)}>
          {block.text}
        </h3>
      )
    case "p":
      return (
        <p className={block.emphasis ? PARAGRAPH_EMPHASIS : PARAGRAPH}>
          {stripInlineMarks(block.text)}
        </p>
      )
    case "quote":
      return (
        <blockquote className="my-2 border-l-2 border-[color-mix(in_oklab,var(--accent)_60%,transparent)] pl-5">
          <p className="text-base font-medium leading-snug text-[var(--fg)] md:text-lg">
            &ldquo;{block.text}&rdquo;
          </p>
          <footer className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            &mdash; {block.attribution}
          </footer>
        </blockquote>
      )
    case "parts":
      return (
        <div className="flex flex-col gap-5">
          <p className={PARAGRAPH}>{block.intro}</p>
          <ol className="flex flex-col gap-4">
            {block.items.map((part, i) => (
              <li
                key={part.name}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4"
              >
                <span
                  aria-hidden
                  className="pt-[3px] font-mono text-xs tracking-[0.18em] text-[var(--accent-text)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] font-medium text-[var(--fg)] md:text-base">
                    {part.name}
                  </span>
                  <span className={PARAGRAPH}>{part.text}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )
  }
}
