#!/usr/bin/env node
// Read-only audit of the shared Synergy IO Stripe account.
//
// Answers one question: can an event or a portal session from one app reach
// another app? Writes nothing. Safe to run against live.
//
//   node scripts/stripe/audit.mjs --env-file .env
//   node scripts/stripe/audit.mjs --key sk_live_... --live

import {
  APPS,
  APP_LABEL,
  classifyProduct,
  isSubscriptionProduct,
  loadCatalog,
  makeStripe,
  parseArgs,
  resolveKey,
} from "./catalog.mjs"

const args = parseArgs(process.argv.slice(2))
const { key, live } = resolveKey(args)
const stripe = makeStripe(key)

const problems = []
const flag = (severity, message) => problems.push({ severity, message })

const account = await stripe.accounts.retrieve()
console.log(`\n${"═".repeat(72)}`)
console.log(`  ${live ? "LIVE" : "TEST"}  ${account.id}  ${account.settings?.dashboard?.display_name ?? ""}`)
console.log(`${"═".repeat(72)}`)

// ── Statement descriptor ────────────────────────────────────────────────────
const prefix = account.settings?.card_payments?.statement_descriptor_prefix
const accountDescriptor = account.settings?.payments?.statement_descriptor
console.log(`\n■ STATEMENT DESCRIPTOR`)
console.log(`  card prefix        ${prefix || "(NOT SET)"}`)
console.log(`  account descriptor ${accountDescriptor || "(NOT SET)"}`)
if (!prefix) {
  flag(
    "HIGH",
    `No card statement_descriptor_prefix. Every charge shows "${accountDescriptor ?? "the account name"}" ` +
      `regardless of which app sold it. Set it in Dashboard → Settings → Business → Public details.`
  )
}

// ── Catalog ─────────────────────────────────────────────────────────────────
const { products, prices, pricesByProduct } = await loadCatalog(stripe)
const appOfProduct = new Map()

console.log(`\n■ PRODUCTS (${products.length})`)
for (const product of products) {
  const app = classifyProduct(product, pricesByProduct)
  appOfProduct.set(product.id, app)
  const tagged = APPS.includes(product.metadata?.app)
  const sub = isSubscriptionProduct(product, pricesByProduct)
  console.log(
    `  ${tagged ? "✓" : "✗"} ${(app ?? "UNKNOWN").padEnd(7)} ${product.id}  "${product.name}"` +
      `${sub ? "  [subscription]" : ""}`
  )
  if (!app) {
    flag(
      "HIGH",
      `Product ${product.id} "${product.name}" cannot be attributed to an app. ` +
        `Tag it by hand before enabling strict webhook filtering.`
    )
  } else if (!tagged) {
    flag("MEDIUM", `Product ${product.id} "${product.name}" has no metadata.app (inferred: ${app}).`)
  }
  if (sub && !product.statement_descriptor) {
    flag(
      "MEDIUM",
      `Subscription product ${product.id} "${product.name}" has no statement_descriptor — ` +
        `its renewals inherit the generic account descriptor.`
    )
  }
}

console.log(`\n■ PRICES (${prices.length})`)
for (const price of prices) {
  const productId = typeof price.product === "string" ? price.product : price.product?.id
  const app = appOfProduct.get(productId)
  const amount = price.unit_amount === null ? "custom" : `${(price.unit_amount / 100).toFixed(2)} ${price.currency}`
  console.log(
    `  ${price.lookup_key ? "✓" : "✗"} ${(app ?? "UNKNOWN").padEnd(7)} ${price.id}  ${amount.padEnd(14)}` +
      `${price.recurring ? `recurring/${price.recurring.interval}` : "one_time"}  ${price.lookup_key ?? "(no lookup_key)"}`
  )
  if (!price.lookup_key) {
    flag(
      "LOW",
      `Price ${price.id} (${amount}, ${app ?? "unknown app"}) has no lookup_key — code must hardcode its id.`
    )
  }
}

// ── Webhook endpoints ───────────────────────────────────────────────────────
console.log(`\n■ WEBHOOK ENDPOINTS`)
const endpoints = (await stripe.webhookEndpoints.list({ limit: 100 })).data
if (!endpoints.length) {
  console.log(`  (none registered in ${live ? "live" : "test"} mode)`)
}
const eventOwners = new Map()
for (const endpoint of endpoints) {
  console.log(`  ${endpoint.status.padEnd(8)} ${endpoint.id}  ${endpoint.url}`)
  console.log(`      ${endpoint.enabled_events.length} events: ${endpoint.enabled_events.join(", ")}`)
  for (const type of endpoint.enabled_events) {
    if (!eventOwners.has(type)) eventOwners.set(type, [])
    eventOwners.get(type).push(endpoint.url)
  }
}
for (const [type, urls] of eventOwners) {
  if (urls.length > 1) {
    flag(
      "HIGH",
      `${urls.length} endpoints receive "${type}". Every one of them sees every app's events; ` +
        `each handler must filter on metadata.app and return 200 for anything that isn't its own.`
    )
  }
}

// ── Portal configurations ───────────────────────────────────────────────────
// Caveat: Stripe validates `features.subscription_update.products` on write but
// never returns it on read (checked against 2024-06-20, 2025-03-31.basil and
// 2026-04-22.dahlia — absent in all three). So a GET cannot prove what a
// configuration is scoped to. migrate.mjs records the intended scope in
// `metadata.scoped_products`; that is what this section reports. A config with
// no such metadata was not written by migrate.mjs and its scope is unknown —
// which, for the account default, means "assume unscoped".
console.log(`\n■ BILLING PORTAL CONFIGURATIONS`)
const configs = (await stripe.billingPortal.configurations.list({ limit: 100 })).data
for (const config of configs) {
  const update = config.features?.subscription_update
  const recorded = config.metadata?.scoped_products
  const scope = recorded
    ? `${recorded.split(",").filter(Boolean).length} product(s) [per metadata]`
    : "UNKNOWN — not written by migrate.mjs"
  console.log(
    `  ${config.id}  default=${config.is_default}  active=${config.active}  ` +
      `app=${config.metadata?.app ?? "(untagged)"}`
  )
  console.log(`      subscription_update.enabled=${update?.enabled ?? false}  scope=${scope}`)
  if (update?.enabled && !recorded) {
    flag(
      config.is_default ? "HIGH" : "MEDIUM",
      `Portal configuration ${config.id}${config.is_default ? " (the account DEFAULT)" : ""} ` +
        `enables plan switching with no recorded product scope. Any app that opens a portal session ` +
        `without an explicit \`configuration\` lands here and can offer another app's plans. ` +
        `Every createPortalSession call must pass its app's configuration id.`
    )
  }
}
const taggedConfigs = configs.filter((c) => APPS.includes(c.metadata?.app))
for (const app of APPS) {
  if (!taggedConfigs.some((c) => c.metadata.app === app)) {
    flag("MEDIUM", `No portal configuration tagged app=${app}. Run migrate.mjs to create one.`)
  }
}

// ── Live objects that predate the app tag ───────────────────────────────────
console.log(`\n■ SUBSCRIPTIONS`)
const subscriptions = (await stripe.subscriptions.list({ limit: 100, status: "all" })).data
if (!subscriptions.length) console.log(`  (none)`)
for (const subscription of subscriptions) {
  const priceId = subscription.items.data[0]?.price?.id
  const productId = subscription.items.data[0]?.price?.product
  const app = appOfProduct.get(productId) ?? "unknown"
  const tagged = APPS.includes(subscription.metadata?.app)
  console.log(
    `  ${tagged ? "✓" : "✗"} ${app.padEnd(7)} ${subscription.id}  ${subscription.status.padEnd(10)} ${priceId}`
  )
  if (!tagged) {
    flag(
      "MEDIUM",
      `Subscription ${subscription.id} (${app}) has no metadata.app — a strict filter would not recognize it. ` +
        `Run migrate.mjs to backfill.`
    )
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(72)}`)
console.log(`  FINDINGS`)
console.log(`${"═".repeat(72)}`)
const order = { HIGH: 0, MEDIUM: 1, LOW: 2 }
problems.sort((a, b) => order[a.severity] - order[b.severity])
if (!problems.length) {
  console.log(`  Nothing to flag.`)
} else {
  for (const { severity, message } of problems) {
    console.log(`\n  [${severity}] ${message}`)
  }
}
console.log(
  `\n  ${problems.filter((p) => p.severity === "HIGH").length} high, ` +
    `${problems.filter((p) => p.severity === "MEDIUM").length} medium, ` +
    `${problems.filter((p) => p.severity === "LOW").length} low\n`
)
