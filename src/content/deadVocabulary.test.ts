import { describe, expect, it } from "vitest"

import { changelog } from "./changelog"
import { download } from "./download"
import { hero } from "./hero"
import { manifesto } from "./manifesto"
import { pricing } from "./pricing"
import { privacy } from "./privacy"
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
  // Retired by the 2026-08-17 repricing ($3/mo · $30/yr · 30-day trial ·
  // Locus Remote prepaid credits). See product ADR-0010.
  ["14-day trial (now 30 days)", /14[- ]day|14 days free/i],
  ["$8/mo managed-AI add-on (now prepaid Remote credits)", /\$8\/mo|\$8 a month/i],
  ["Locus managed AI (now Locus Remote / Remote credits)", /locus managed|managed[- ]ai/i],
  ["$48/yr price point (now $30)", /\$48\b/],
  ["Save 33% (now '2 months free')", /save 33%/i],
]

// Registration is manual — a content module that isn't listed here is
// silently unlinted. Add every new src/content module.
const MODULES: Record<string, unknown> = {
  hero,
  manifesto,
  pricing,
  download,
  privacy,
  terms,
  changelog,
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
