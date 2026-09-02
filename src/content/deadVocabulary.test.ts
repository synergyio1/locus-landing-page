import { describe, expect, it } from "vitest"

import { appShowcase } from "./app-showcase"
import { appTour } from "./app-tour"
import { authCopy } from "./auth"
import { download } from "./download"
import { hero } from "./hero"
import { manifesto } from "./manifesto"
import { packs } from "./packs"
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
  ["digest by email (email digests are disabled)", /by email/i],
  ["Friday review (now the weekly review)", /friday review/i],
  // Retired by the 2026-08-17 repricing ($3/mo · $30/yr ·
  // Locus Remote prepaid credits). See product ADR-0010.
  ["14-day trial (now 7 days)", /14[- ]day|14 days free/i],
  // Trial cut 30 → 7 days on 2026-09-02. The 30-day *refund* is still live
  // copy, so only the trial phrasings are banned.
  ["30-day trial (now 7 days)", /30[- ]day (free |pro )?trial|30 days free/i],
  ["$8/mo managed-AI add-on (now prepaid Remote credits)", /\$8\/mo|\$8 a month/i],
  ["Locus managed AI (now Locus Remote / Remote credits)", /locus managed|managed[- ]ai/i],
  ["$48/yr price point (now $30)", /\$48\b/],
  ["Save 33% (now '2 months free')", /save 33%/i],
  // Retired by the app's Execution re-org (2026-08-27/28): six flat tabs, no
  // families, chat in the titlebar. See src/content/app-showcase.ts.
  ["nine screens / three families (now six tabs + chat)", /nine screens|three families/i],
]

// Registration is manual — a content module that isn't listed here is
// silently unlinted. Add every new src/content module.
const MODULES: Record<string, unknown> = {
  authCopy,
  hero,
  manifesto,
  pricing,
  download,
  privacy,
  terms,
  appTour,
  appShowcase,
  packs,
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
