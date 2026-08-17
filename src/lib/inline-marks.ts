/**
 * Inline emphasis marks for copy modules: wrap a phrase in ==double equals==
 * and the renderer (sections/manifesto.tsx → ui/ink-underline.tsx) draws the
 * ink underline under it. Kept as plain text so the letter stays readable and
 * editable in the content file, and so JSON.stringify-based content lints
 * still see the words.
 */
export type InlineRun = { text: string; marked: boolean }

const MARK = /==([^=]+?)==/g

/** Split copy into plain and marked runs, in reading order. */
export function splitInlineMarks(text: string): InlineRun[] {
  const runs: InlineRun[] = []
  let last = 0
  for (const match of text.matchAll(MARK)) {
    const start = match.index
    if (start > last) runs.push({ text: text.slice(last, start), marked: false })
    runs.push({ text: match[1], marked: true })
    last = start + match[0].length
  }
  if (last < text.length) runs.push({ text: text.slice(last), marked: false })
  return runs
}

/** The marked phrases only, in reading order. */
export function listInlineMarks(text: string): string[] {
  return splitInlineMarks(text)
    .filter((run) => run.marked)
    .map((run) => run.text)
}

/** Copy with the mark syntax removed — for meta descriptions, plain-text uses. */
export function stripInlineMarks(text: string): string {
  return text.replace(MARK, "$1")
}

/** True when every `==` opens or closes a mark (no stray delimiter). */
export function hasBalancedInlineMarks(text: string): boolean {
  const delimiters = (text.match(/==/g) ?? []).length
  return delimiters % 2 === 0 && stripInlineMarks(text).includes("==") === false
}
