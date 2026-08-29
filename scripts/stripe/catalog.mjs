// Shared policy for the Synergy IO Stripe account, which hosts more than one
// product (Locus, Shoulders of Giants, and whatever comes next).
//
// Nothing here hardcodes an object id: live and test have different ids, and a
// third app will have ids that don't exist yet. Everything resolves from
// metadata, lookup_key, or name — so the same script runs safely in both modes.

import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"

/** The canonical app tag. Written to `metadata.app` on every object we own. */
export const APPS = ["locus", "sog"]

export const APP_LABEL = {
  locus: "Locus",
  sog: "Shoulders of Giants",
}

/**
 * Statement descriptor suffixes.
 *
 * A card charge shows `PREFIX* SUFFIX`, capped at 22 characters INCLUDING the
 * prefix and the "* " delimiter. With the account prefix set to "STL"
 * (Synergy Technology Ltd):
 *
 *   "STL* LOCUS APP"        → 14 chars
 *   "STL* SHOULDERS GIANTS" → 21 chars (1 to spare)
 *
 * If Stripe rejects the Shoulders suffix as too long, fall back to "SH GIANTS".
 * The prefix itself is account-level and can only be set in the Dashboard —
 * Settings → Business → Public details. This script cannot set it.
 */
export const STATEMENT_SUFFIX = {
  locus: "LOCUS APP",
  sog: "SHOULDERS GIANTS",
}

/**
 * Public HTTPS URL for each app's product image (what shows on the line item in
 * hosted Checkout).
 *
 * Leave a value empty to INHERIT: migrate.mjs looks for a product of that app
 * that already has an image and copies it to that app's other products. So an
 * icon set by hand on one product propagates to the rest without anyone
 * pasting a URL. An explicit value here always wins over inheritance, and
 * neither ever clears an image that is already set.
 *
 * NOTE: this is the *product* image, which is per-product and scriptable. The
 * Checkout *brand* logo and colors are account-level (Settings → Branding) and
 * therefore shared by every app on the account. There is no per-product
 * override for those.
 */
export const PRODUCT_IMAGE = {
  // Empty: inherit from whichever Locus product already carries the icon.
  locus: "",
  // Next serves src/app/icon.png here; verified 200 image/png.
  sog: "https://www.shouldersofgiants.tech/icon.png",
}

/** Prefix applied to product names so the Dashboard list is self-describing. */
const NAME_PREFIX = {
  locus: "Locus — ",
  sog: "Shoulders of Giants — ",
}

/**
 * Classify a product. Ordered most-trustworthy first; returns null rather than
 * guessing, so an unrecognized product is reported and left untouched.
 */
export function classifyProduct(product, pricesByProduct) {
  const existing = product.metadata?.app
  if (APPS.includes(existing)) return existing

  if (product.metadata?.sog_product) return "sog"
  if (product.metadata?.locus_product) return "locus"

  const lookupKeys = (pricesByProduct.get(product.id) ?? [])
    .map((p) => p.lookup_key)
    .filter(Boolean)
  if (lookupKeys.some((k) => k.startsWith("sog_"))) return "sog"
  if (lookupKeys.some((k) => k.startsWith("locus_"))) return "locus"

  if (/\blocus\b/i.test(product.name)) return "locus"

  return null
}

/**
 * The name this product should carry. Idempotent: a name that already starts
 * with the right prefix is returned unchanged, so re-running never compounds
 * prefixes.
 */
export function desiredName(product, app) {
  const prefix = NAME_PREFIX[app]
  if (product.name.startsWith(prefix)) return product.name

  let base = product.name.trim()
  // "Locus Pro" → "Pro"; the prefix re-adds the brand.
  base = base.replace(/^Locus\s+/i, "")
  // "Package — 5 hours" → "Package 5 hours", so the result isn't double-dashed.
  base = base.replace(/\s+—\s+/g, " ")
  // Title-case a lone lowercase word run ("Remote credits" → "Remote Credits").
  base = base.replace(/\b([a-z])(\w*)/g, (_, a, rest) => a.toUpperCase() + rest)

  return `${prefix}${base}`
}

/** True when any price on this product is recurring. */
export function isSubscriptionProduct(product, pricesByProduct) {
  return (pricesByProduct.get(product.id) ?? []).some((p) => p.recurring)
}

// ── env + client plumbing ───────────────────────────────────────────────────

export function loadEnvFile(envPath) {
  if (!envPath || !fs.existsSync(envPath)) return {}
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
      .map((line) => {
        const i = line.indexOf("=")
        return [line.slice(0, i).trim(), line.slice(i + 1).trim()]
      })
  )
}

/**
 * Resolve the secret key. Precedence: --key, then STRIPE_SECRET_KEY in the
 * environment, then an --env-file. Refuses to run against live mode unless
 * --live is passed explicitly, so a stray live key can't silently rewrite
 * production objects.
 */
export function resolveKey(args) {
  const fromFlag = args["--key"]
  const fromEnvFile = args["--env-file"]
    ? loadEnvFile(args["--env-file"]).STRIPE_SECRET_KEY
    : undefined
  const key = fromFlag || process.env.STRIPE_SECRET_KEY || fromEnvFile

  if (!key) {
    throw new Error(
      "No Stripe secret key. Pass --key sk_..., export STRIPE_SECRET_KEY, or pass --env-file path/to/.env"
    )
  }
  const live = key.startsWith("sk_live")
  if (live && !args["--live"]) {
    throw new Error(
      "That is a LIVE key. Re-run with --live to confirm you mean production."
    )
  }
  return { key, live }
}

export function makeStripe(key) {
  const require = createRequire(
    path.join(process.cwd(), "scripts/stripe/catalog.mjs")
  )
  const Stripe = require("stripe")
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" })
}

export function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith("--")) continue
    const next = argv[i + 1]
    if (next && !next.startsWith("--")) {
      args[token] = next
      i++
    } else {
      args[token] = true
    }
  }
  return args
}

/** Load every active product and price once, indexed for classification. */
export async function loadCatalog(stripe) {
  const products = []
  for await (const p of stripe.products.list({ limit: 100, active: true })) {
    products.push(p)
  }
  const prices = []
  for await (const pr of stripe.prices.list({ limit: 100, active: true })) {
    prices.push(pr)
  }
  const pricesByProduct = new Map()
  for (const price of prices) {
    const productId =
      typeof price.product === "string" ? price.product : price.product?.id
    if (!productId) continue
    if (!pricesByProduct.has(productId)) pricesByProduct.set(productId, [])
    pricesByProduct.get(productId).push(price)
  }
  return { products, prices, pricesByProduct }
}
