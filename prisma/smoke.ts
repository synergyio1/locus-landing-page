// One-shot smoke test for the Prisma + @prisma/adapter-pg wiring.
// Acceptance criterion from issue #35: Prisma client executes against
// the pooler URL without error.
//
// Run: `npx tsx prisma/smoke.ts`
// Delete after the next slice lands `src/lib/db/prisma.ts`.

import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not set")

  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })

  // `subscriptions` is currently @@ignore'd (no PK — fixed in Phase B
  // by the sibling-repo migration that adds UNIQUE(user_id)). Use
  // `profiles` for the smoke test instead.
  const rows = await prisma.profiles.findMany({ take: 0 })
  console.log("OK: prisma.profiles.findMany({take:0}) returned", rows)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error("SMOKE TEST FAILED:", err)
  process.exit(1)
})
