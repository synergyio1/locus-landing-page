#!/usr/bin/env node
/**
 * Locus Remote credit packs (prepaid AI compute) are sold as one-time Stripe
 * prices. LIVE already has its ladder; TEST has none, so there is nothing to
 * develop the web purchase flow against. This creates the three test-mode
 * prices and prints the STRIPE_CREDIT_PRICE_IDS line to paste into ./.env.
 *
 * Usage:
 *   node scripts/stripe-credit-packs.mjs                    # uses STRIPE_SECRET_KEY from ./.env
 *   node scripts/stripe-credit-packs.mjs --product=prod_…   # attach to an existing product
 *   node scripts/stripe-credit-packs.mjs --use-shell-key    # allow $STRIPE_SECRET_KEY to win
 *
 * Idempotent: prices are found via lookup_keys before anything is created, so
 * running it twice (or after a partial failure) never duplicates prices. The
 * printed order is ascending, and that order is what the account page renders.
 */

import { readFileSync } from "node:fs"

const PRODUCT_NAME = "Locus Remote credits"
const PACKS = [
  { lookupKey: "locus_credits_500", unitAmount: 500 },
  { lookupKey: "locus_credits_1000", unitAmount: 1000 },
  { lookupKey: "locus_credits_2000", unitAmount: 2000 },
]

const useShellKey = process.argv.includes("--use-shell-key")

function envFromDotenv(name) {
  try {
    const line = readFileSync(new URL("../.env", import.meta.url), "utf8")
      .split("\n")
      .find((l) => l.startsWith(`${name}=`))
    return line ? line.slice(name.length + 1).trim() : undefined
  } catch {
    return undefined
  }
}

const shellKey = process.env.STRIPE_SECRET_KEY
const dotenvKey = envFromDotenv("STRIPE_SECRET_KEY")

// A stray STRIPE_SECRET_KEY exported in the shell (from another Stripe
// account) would silently create these packs in the wrong place. Refuse
// rather than guess.
if (shellKey && dotenvKey && shellKey !== dotenvKey && !useShellKey) {
  console.error(
    "STRIPE_SECRET_KEY in the shell (…%s) differs from ./.env (…%s).\n" +
      "Run `unset STRIPE_SECRET_KEY` first, or pass --use-shell-key if the shell one is correct.",
    shellKey.slice(-4),
    dotenvKey.slice(-4)
  )
  process.exit(1)
}

const secretKey = useShellKey ? (shellKey ?? dotenvKey) : (dotenvKey ?? shellKey)
if (!secretKey) {
  console.error("No STRIPE_SECRET_KEY in ./.env or the environment")
  process.exit(1)
}

const mode = secretKey.startsWith("sk_live") ? "LIVE" : "TEST"
console.log(`Key: …${secretKey.slice(-4)} (${mode})`)
if (mode === "LIVE") {
  console.log(
    "Note: the live ladder already exists — this will reuse it if the lookup keys match."
  )
}

async function stripe(method, path, params) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      ...(params ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: params ? new URLSearchParams(params) : undefined,
  })
  const json = await res.json()
  if (json.error) throw new Error(`${method} ${path}: ${json.error.message}`)
  return json
}

async function findByLookupKey(lookupKey) {
  const { data } = await stripe("GET", `/prices?lookup_keys[]=${lookupKey}&limit=1`)
  return data[0]
}

async function resolveProductId() {
  const flag = process.argv.find((a) => a.startsWith("--product="))
  const explicit = process.env.STRIPE_PRODUCT ?? flag?.slice("--product=".length)
  if (explicit) return explicit

  // Reuse whatever product a previously-created pack is attached to.
  for (const pack of PACKS) {
    const existing = await findByLookupKey(pack.lookupKey)
    if (existing) {
      const productId =
        typeof existing.product === "string" ? existing.product : existing.product.id
      console.log(`Reusing product from ${pack.lookupKey}: ${productId}`)
      return productId
    }
  }

  const created = await stripe("POST", "/products", {
    name: PRODUCT_NAME,
    description: "Prepaid credits for Locus Remote AI compute.",
  })
  console.log(`+ created product ${created.id} (${PRODUCT_NAME})`)
  return created.id
}

async function ensurePrice(productId, { lookupKey, unitAmount }) {
  const existing = await findByLookupKey(lookupKey)
  if (existing) {
    if (existing.unit_amount !== unitAmount || existing.type !== "one_time") {
      throw new Error(
        `Price with lookup_key ${lookupKey} exists but is ${existing.unit_amount} / ${existing.type} — resolve manually.`
      )
    }
    console.log(`✓ ${lookupKey} already exists: ${existing.id}`)
    return existing
  }
  const created = await stripe("POST", "/prices", {
    product: productId,
    currency: "usd",
    unit_amount: String(unitAmount),
    lookup_key: lookupKey,
    transfer_lookup_key: "true",
  })
  console.log(`+ created ${lookupKey}: ${created.id} ($${unitAmount / 100})`)
  return created
}

const productId = await resolveProductId()
console.log(`Mode: ${mode} · Product: ${productId}\n`)

const prices = []
for (const pack of PACKS) {
  prices.push(await ensurePrice(productId, pack))
}

console.log(`\nPaste into ${mode === "LIVE" ? "Vercel project env (Production)" : "./.env"}:\n`)
console.log(`STRIPE_CREDIT_PRICE_IDS=${prices.map((p) => p.id).join(",")}`)
