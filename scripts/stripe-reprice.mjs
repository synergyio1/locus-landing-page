#!/usr/bin/env node
/**
 * Repricing follow-up (2026-08-17 LP reset): the site sells $3/mo · $30/yr,
 * but STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY may still point at the old
 * $6/$58 prices. This script creates the new prices on the same product and
 * prints the env lines to paste into .env (local) and Vercel (prod).
 *
 * Usage:
 *   node scripts/stripe-reprice.mjs                 # uses STRIPE_SECRET_KEY from ./.env (test mode)
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/stripe-reprice.mjs   # live mode
 *   node scripts/stripe-reprice.mjs --archive-old   # additionally deactivates the old env prices
 *
 * Idempotent: prices are found via lookup_keys before anything is created,
 * so running it twice (or after a partial failure) never duplicates prices.
 */

import { readFileSync } from "node:fs"

const MONTHLY = { lookupKey: "locus_monthly_300", unitAmount: 300, interval: "month" }
const YEARLY = { lookupKey: "locus_yearly_3000", unitAmount: 3000, interval: "year" }

const archiveOld = process.argv.includes("--archive-old")

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

const secretKey = process.env.STRIPE_SECRET_KEY ?? envFromDotenv("STRIPE_SECRET_KEY")
if (!secretKey) {
  console.error("No STRIPE_SECRET_KEY in the environment or ./.env")
  process.exit(1)
}
const mode = secretKey.startsWith("sk_live") ? "LIVE" : "TEST"
const keySource = process.env.STRIPE_SECRET_KEY ? "shell environment (overrides ./.env!)" : "./.env"
console.log(`Key: …${secretKey.slice(-4)} (${mode}, from ${keySource})`)

const oldMonthly = process.env.STRIPE_PRICE_MONTHLY ?? envFromDotenv("STRIPE_PRICE_MONTHLY")
const oldYearly = process.env.STRIPE_PRICE_YEARLY ?? envFromDotenv("STRIPE_PRICE_YEARLY")

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
  // Explicit override wins: STRIPE_PRODUCT=prod_… or --product=prod_…
  const flag = process.argv.find((a) => a.startsWith("--product="))
  const explicit = process.env.STRIPE_PRODUCT ?? flag?.slice("--product=".length)
  if (explicit) return explicit
  // Reuse the product the current (old) price is attached to, in either mode.
  const probe = oldMonthly ?? oldYearly
  if (probe?.startsWith("prod_")) return probe
  if (probe) {
    try {
      const price = await stripe("GET", `/prices/${probe}`)
      return typeof price.product === "string" ? price.product : price.product.id
    } catch {
      // Old price ID belongs to the other mode (test vs live) — fall through.
    }
  }
  const { data } = await stripe("GET", "/products?active=true&limit=10")
  if (data.length === 1) return data[0].id
  console.error(
    data.length === 0
      ? `No active products in ${mode} mode — create the Locus product first.`
      : `Multiple active products in ${mode} mode — pick one and rerun with STRIPE_PRODUCT=prod_… node scripts/stripe-reprice.mjs:\n` +
          data.map((p) => `  ${p.id}  ${p.name}`).join("\n")
  )
  process.exit(1)
}

async function ensurePrice(productId, { lookupKey, unitAmount, interval }) {
  const existing = await findByLookupKey(lookupKey)
  if (existing) {
    if (existing.unit_amount !== unitAmount || existing.recurring?.interval !== interval) {
      throw new Error(
        `Price with lookup_key ${lookupKey} exists but is ${existing.unit_amount} / ${existing.recurring?.interval} — resolve manually.`
      )
    }
    console.log(`✓ ${lookupKey} already exists: ${existing.id}`)
    return existing
  }
  const created = await stripe("POST", "/prices", {
    product: productId,
    currency: "usd",
    unit_amount: String(unitAmount),
    "recurring[interval]": interval,
    lookup_key: lookupKey,
    transfer_lookup_key: "true",
  })
  console.log(`+ created ${lookupKey}: ${created.id} ($${unitAmount / 100}/${interval})`)
  return created
}

const productId = await resolveProductId()
console.log(`Mode: ${mode} · Product: ${productId}\n`)

const monthly = await ensurePrice(productId, MONTHLY)
const yearly = await ensurePrice(productId, YEARLY)

if (archiveOld) {
  // A price can't be archived while it is its product's default price.
  const product = await stripe("GET", `/products/${productId}`)
  if ([oldMonthly, oldYearly].includes(product.default_price)) {
    await stripe("POST", `/products/${productId}`, { default_price: monthly.id })
    console.log(`~ product default_price → ${monthly.id}`)
  }
  for (const oldId of [oldMonthly, oldYearly]) {
    if (!oldId || oldId === monthly.id || oldId === yearly.id) continue
    try {
      await stripe("POST", `/prices/${oldId}`, { active: "false" })
      console.log(`− archived old price ${oldId}`)
    } catch (e) {
      console.log(`! could not archive ${oldId}: ${e.message}`)
    }
  }
}

console.log(`\nPaste into ${mode === "LIVE" ? "Vercel project env (Production)" : "./.env"}:\n`)
console.log(`STRIPE_PRICE_MONTHLY=${monthly.id}`)
console.log(`STRIPE_PRICE_YEARLY=${yearly.id}`)
if (mode === "LIVE") console.log("\nThen redeploy so the new env takes effect.")
