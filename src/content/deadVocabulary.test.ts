import { describe, expect, it } from "vitest"

import { changelog } from "./changelog"
import { depth } from "./depth"
import { download } from "./download"
import { faq } from "./faq"
import { flywheel } from "./flywheel"
import { hero } from "./hero"
import { heroWidget } from "./heroWidget"
import { personaSection } from "./personaSection"
import { pricing } from "./pricing"
import { privacy } from "./privacy"
import { review } from "./review"
import { terms } from "./terms"

// Vocabulary retired by the 2026-07 product pivot (see PRD_landing_redesign.md
// and .agents/product-marketing-context.md). If any of these reappears in a
// content module it is re-drift toward the pre-pivot product, not a feature.
const BANNED: Array<[name: string, pattern: RegExp]> = [
  ["free tier", /free tier/i],
  ["Loop tier", /loop tier/i],
  ["Try Pro", /try pro/i],
  ["Pro (the retired paid tier)", /\bPro\b/],
  ["7-day trial", /7[- ]day/i],
  ["digest by email (email digests are disabled)", /by email/i],
  ["Friday review (now the weekly review)", /friday review/i],
]

const MODULES: Record<string, unknown> = {
  hero,
  faq,
  pricing,
  download,
  privacy,
  terms,
  review,
  depth,
  personaSection,
  heroWidget,
  changelog,
  flywheel,
}

describe("dead vocabulary", () => {
  for (const [moduleName, content] of Object.entries(MODULES)) {
    it(`${moduleName} contains no retired vocabulary`, () => {
      const serialized = JSON.stringify(content)
      for (const [name, pattern] of BANNED) {
        expect(
          pattern.test(serialized),
          `${moduleName} resurrects "${name}"`
        ).toBe(false)
      }
    })
  }
})
