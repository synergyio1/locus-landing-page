#!/usr/bin/env node
// Brings the shared Synergy IO Stripe account into the shape the webhook
// filters and the per-app billing portals depend on.
//
// Idempotent — every step is a no-op when the object already matches, so it is
// safe to re-run after adding a product or a third app.
//
// Dry run by default. Nothing is written without --apply.
//
//   node scripts/stripe/migrate.mjs --env-file .env                 # preview (test)
//   node scripts/stripe/migrate.mjs --env-file .env --apply         # write (test)
//   node scripts/stripe/migrate.mjs --key sk_live_... --live --apply # write (LIVE)
//
// What it does NOT do, because Stripe has no API for it:
//   - set the account's card statement_descriptor_prefix (Dashboard →
//     Settings → Business → Public details). Set that to STL first, or the
//     per-product suffixes below have no prefix to attach to.
//   - set Checkout branding (logo/colors). That is account-level and therefore
//     shared by every app on the account.

import { createHash } from "node:crypto"

import {
  APPS,
  APP_LABEL,
  PRODUCT_IMAGE,
  STATEMENT_SUFFIX,
  classifyProduct,
  desiredName,
  isSubscriptionProduct,
  loadCatalog,
  makeStripe,
  parseArgs,
  resolveKey,
} from "./catalog.mjs"

// Per-app URLs shown inside that app's billing portal. Empty strings are
// omitted from the configuration rather than sent as blanks.
const PORTAL_URLS = {
  locus: {
    privacy_policy_url: "https://getlocus.tech/privacy",
    terms_of_service_url: "https://getlocus.tech/terms",
    headline: "Locus — manage your subscription",
  },
  // SoG routes are locale-prefixed (`/[locale]/privacy`), so these point at the
  // resolved locale rather than relying on a middleware redirect.
  sog: {
    privacy_policy_url: "https://www.shouldersofgiants.tech/en/privacy",
    terms_of_service_url: "https://www.shouldersofgiants.tech/en/terms",
    headline: "Shoulders of Giants — manage your subscription",
  },
}

const args = parseArgs(process.argv.slice(2))
const { key, live } = resolveKey(args)
const apply = Boolean(args["--apply"])
const stripe = makeStripe(key)

const planned = []
const skipped = []

function change(what, detail, run) {
  planned.push({ what, detail, run })
}

const account = await stripe.accounts.retrieve()
console.log(`\n${"═".repeat(72)}`)
console.log(`  ${live ? "LIVE" : "TEST"}  ${account.id}`)
console.log(`  mode: ${apply ? "APPLY — this will write" : "DRY RUN — nothing will be written"}`)
console.log(`${"═".repeat(72)}\n`)

if (!account.settings?.card_payments?.statement_descriptor_prefix) {
  console.log(
    `  ⚠  No card statement_descriptor_prefix on this account. Set it to "STL" in\n` +
      `     Dashboard → Settings → Business → Public details BEFORE relying on the\n` +
      `     per-product suffixes this script writes.\n`
  )
}

// ── 1. Products: app tag, name, statement descriptor, image ─────────────────
const { products, pricesByProduct } = await loadCatalog(stripe)

// Image inheritance: when PRODUCT_IMAGE leaves an app blank, adopt whatever
// image that app's products already carry. Lets an icon set by hand on one
// product spread to its siblings without anyone pasting a URL.
const inheritedImage = {}
for (const app of APPS) {
  if (PRODUCT_IMAGE[app]) continue
  const donor = products.find(
    (p) => classifyProduct(p, pricesByProduct) === app && (p.images ?? []).length > 0
  )
  if (donor) {
    inheritedImage[app] = donor.images[0]
    console.log(`  ℹ  ${APP_LABEL[app]}: inheriting product image from "${donor.name}"`)
  }
}

for (const product of products) {
  const app = classifyProduct(product, pricesByProduct)
  if (!app) {
    skipped.push(`product ${product.id} "${product.name}" — cannot attribute to an app, left untouched`)
    continue
  }

  const update = {}

  if (product.metadata?.app !== app) {
    update.metadata = { ...product.metadata, app }
  }

  const name = desiredName(product, app)
  if (name !== product.name) {
    update.name = name
  }

  // Only subscription products carry a statement_descriptor: Stripe applies it
  // to recurring invoices. One-time charges get their suffix from the Checkout
  // Session's payment_intent_data instead (set in application code).
  if (isSubscriptionProduct(product, pricesByProduct)) {
    const suffix = STATEMENT_SUFFIX[app]
    if (product.statement_descriptor !== suffix) {
      update.statement_descriptor = suffix
    }
  }

  const image = PRODUCT_IMAGE[app] || inheritedImage[app]
  if (image && !(product.images ?? []).includes(image)) {
    update.images = [image]
  }

  if (Object.keys(update).length === 0) continue

  const summary = Object.entries(update)
    .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : `"${v}"`}`)
    .join("  ")
  change(`product ${product.id}`, `${product.name} → ${summary}`, () =>
    stripe.products.update(product.id, update)
  )
}

// ── 2. Backfill metadata.app on existing subscriptions and customers ────────
// Objects created before the tag existed carry no app. A strict filter would
// not recognize them, so they get stamped from the product they bill.
const appOfProduct = new Map(
  products.map((p) => [p.id, classifyProduct(p, pricesByProduct)])
)

const subscriptions = (await stripe.subscriptions.list({ limit: 100, status: "all" })).data
const customerApps = new Map()

for (const subscription of subscriptions) {
  const productId = subscription.items.data[0]?.price?.product
  const app = appOfProduct.get(typeof productId === "string" ? productId : productId?.id)
  if (!app) {
    skipped.push(`subscription ${subscription.id} — its product is unattributed, left untouched`)
    continue
  }

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id
  if (customerId) customerApps.set(customerId, app)

  if (subscription.metadata?.app === app) continue
  change(`subscription ${subscription.id}`, `${subscription.status} → metadata.app="${app}"`, () =>
    stripe.subscriptions.update(subscription.id, {
      metadata: { ...subscription.metadata, app },
    })
  )
}

for (const [customerId, app] of customerApps) {
  const customer = await stripe.customers.retrieve(customerId)
  if (customer.deleted) continue
  if (customer.metadata?.app === app) continue
  change(`customer ${customerId}`, `${customer.email ?? "(no email)"} → metadata.app="${app}"`, () =>
    stripe.customers.update(customerId, { metadata: { ...customer.metadata, app } })
  )
}

// ── 3. One billing portal configuration per app ─────────────────────────────
// Without this every app shares the account's single default configuration,
// which offers every product on the account as a switch target.
const existingConfigs = (await stripe.billingPortal.configurations.list({ limit: 100 })).data

// Which recurring prices the portal may offer as switch targets.
//
// "Active" is NOT the same as "current". A superseded price stays active until
// somebody archives it, and on the live account Locus still has the old $6/mo
// and $60/yr alongside the current $3/$30 — offering all four would let a
// subscriber switch onto retired pricing. `lookup_key` is how this account
// marks its canonical prices, so when a product has any keyed recurring price,
// only those are offered and the unkeyed leftovers are reported.
const excludedPrices = []

function offeredPricesFor(product) {
  const recurring = (pricesByProduct.get(product.id) ?? []).filter((p) => p.recurring)
  const keyed = recurring.filter((p) => p.lookup_key)
  if (!keyed.length) return recurring

  for (const price of recurring) {
    if (price.lookup_key) continue
    const amount =
      price.unit_amount === null ? "custom" : `${(price.unit_amount / 100).toFixed(2)} ${price.currency}`
    excludedPrices.push(
      `${price.id} (${amount}/${price.recurring.interval}) on "${product.name}" — no lookup_key, kept out of the portal`
    )
  }
  return keyed
}

for (const app of APPS) {
  const appProducts = products.filter(
    (p) => appOfProduct.get(p.id) === app && isSubscriptionProduct(p, pricesByProduct)
  )

  const subscriptionUpdate = appProducts.length
    ? {
        enabled: true,
        default_allowed_updates: ["price"],
        proration_behavior: "create_prorations",
        products: appProducts.map((product) => ({
          product: product.id,
          prices: offeredPricesFor(product).map((price) => price.id),
        })),
      }
    : { enabled: false }

  const urls = PORTAL_URLS[app]
  const businessProfile = {}
  if (urls.headline) businessProfile.headline = urls.headline
  if (urls.privacy_policy_url) businessProfile.privacy_policy_url = urls.privacy_policy_url
  if (urls.terms_of_service_url) businessProfile.terms_of_service_url = urls.terms_of_service_url

  const params = {
    business_profile: businessProfile,
    features: {
      customer_update: { enabled: true, allowed_updates: ["email", "address", "tax_id"] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        cancellation_reason: {
          enabled: true,
          options: ["too_expensive", "missing_features", "switched_service", "unused", "other"],
        },
      },
      subscription_update: subscriptionUpdate,
    },
  }

  // Stripe validates `features.subscription_update.products` on write (a bogus
  // product or a price belonging to another product is rejected) but never
  // returns it on read, in any API version. So the applied scope is invisible
  // to a GET. Record it in metadata — that IS returned — so audit.mjs has
  // something to check and re-runs can tell "already correct" from "changed".
  params.metadata = {
    app,
    scoped_products: appProducts.map((p) => p.id).sort().join(","),
    policy_hash: createHash("sha256")
      .update(JSON.stringify([params.features, params.business_profile]))
      .digest("hex")
      .slice(0, 16),
  }

  const existing = existingConfigs.find((c) => c.metadata?.app === app)
  const scope = appProducts.length
    ? appProducts.map((p) => p.name).join(", ")
    : "cancel/invoice only (no subscription products)"

  if (existing?.metadata?.policy_hash === params.metadata.policy_hash) continue

  if (existing) {
    change(`portal config ${existing.id}`, `update ${APP_LABEL[app]} → ${scope}`, () =>
      stripe.billingPortal.configurations.update(existing.id, params)
    )
  } else {
    change(`portal config (new)`, `create ${APP_LABEL[app]} → ${scope}`, async () => {
      const created = await stripe.billingPortal.configurations.create(params)
      console.log(`      → ${created.id}   set STRIPE_PORTAL_CONFIG_${app.toUpperCase()} to this`)
      return created
    })
  }
}

// ── 4. Harden the account default configuration ─────────────────────────────
// Every portal session that does NOT name a configuration falls back to the
// account default — and that is not only application code. A link generated
// from the Dashboard, the hosted portal login page, or an old bookmarked
// session URL all land there too, so no amount of discipline in our own
// createPortalSession calls closes this.
//
// Since the default is shared by every app on the account, there is no correct
// product scope for it: any list it offers is another app's cross-sell. So plan
// switching is turned OFF there entirely. A session that forgets its
// configuration degrades to invoices, payment method, and cancel — never
// "here are a different product's plans".
const defaultConfig = existingConfigs.find(
  (c) => c.is_default && !APPS.includes(c.metadata?.app)
)
if (defaultConfig?.features?.subscription_update?.enabled) {
  change(
    `portal config ${defaultConfig.id} (account DEFAULT)`,
    `disable plan switching — it offers every app's products to whoever lands there`,
    () =>
      stripe.billingPortal.configurations.update(defaultConfig.id, {
        features: { subscription_update: { enabled: false } },
      })
  )
}

// ── Execute ─────────────────────────────────────────────────────────────────
if (excludedPrices.length) {
  console.log(`■ PRICES KEPT OUT OF THE PORTAL (${excludedPrices.length})`)
  for (const line of excludedPrices) console.log(`  · ${line}`)
  console.log(
    `  These stay active and keep billing existing subscribers — they are simply\n` +
      `  not offered as switch targets. Archive them in Stripe if they are retired.\n`
  )
}

if (skipped.length) {
  console.log(`■ SKIPPED (${skipped.length})`)
  for (const line of skipped) console.log(`  · ${line}`)
  console.log()
}

console.log(`■ CHANGES (${planned.length})`)
if (!planned.length) {
  console.log(`  Account already matches policy. Nothing to do.\n`)
  process.exit(0)
}
for (const { what, detail } of planned) {
  console.log(`  · ${what}`)
  console.log(`      ${detail}`)
}

if (!apply) {
  console.log(`\n  Dry run. Re-run with --apply to write these ${planned.length} changes.\n`)
  process.exit(0)
}

console.log(`\n■ APPLYING`)
let ok = 0
const failures = []
for (const { what, run } of planned) {
  try {
    await run()
    ok++
    console.log(`  ✓ ${what}`)
  } catch (error) {
    failures.push({ what, message: error.message })
    console.log(`  ✗ ${what} — ${error.message}`)
  }
}

console.log(`\n  ${ok}/${planned.length} applied.`)
if (failures.length) {
  console.log(`  ${failures.length} failed:`)
  for (const { what, message } of failures) console.log(`    ${what}: ${message}`)
  process.exit(1)
}
console.log()
