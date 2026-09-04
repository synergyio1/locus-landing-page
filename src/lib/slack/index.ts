import "server-only"

/**
 * The `#locus-newusers` notifier — one narrow surface for telling Slack that
 * somebody just signed up, bought, or left.
 *
 * Two design constraints, both pinned by the unit tests:
 *
 *   1. Fire-and-forget. A Slack transport failure is swallowed and never
 *      propagates into the caller. Slack downtime must not fail a Stripe
 *      webhook (Stripe would retry for three days and eventually disable the
 *      endpoint, taking Locus billing down over a chat message) and must not
 *      fail a signup.
 *   2. Transport-injectable. Tests pass a vi.fn() in place of the live
 *      `fetch`, so a test run never posts to the real channel.
 *
 * Unconfigured is a valid state: with no `SLACK_NEWUSERS_WEBHOOK_URL` the
 * helpers no-op silently. That keeps local dev and preview deploys quiet
 * without a feature flag.
 *
 * Deliberately NOT coupled to analytics. The Stripe handler already emits its
 * own `captureServerEvent` calls for purchases; emitting a second one from in
 * here would double-count the funnel. Call sites own their own analytics.
 */

export type SlackTransport = (
  url: string,
  body: { text: string },
) => Promise<unknown>

/** `webhookUrl` is injected in tests so one can never post to the real channel. */
export type NotifyOptions = {
  webhookUrl?: string
  transport?: SlackTransport
}

/** How the person authenticated, as Supabase records it in `raw_app_meta_data`. */
export type SignupProvider = "google" | "email" | "apple" | string

export type NewUserPayload = {
  email: string | null
  provider: SignupProvider | null
}

export type PurchasePayload = {
  email: string | null
  /** Minor units, as Stripe reports them (`amount_total`). */
  amountMinor: number | null
  currency: string | null
  priceId?: string | null
}

export type CancellationPayload = {
  email: string | null
  /** ISO timestamp the subscription stays usable until. */
  accessUntil: string | null
}

const defaultTransport: SlackTransport = (url, body) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

/**
 * A new person reached a confirmed Supabase account — from the Mac app's
 * native Google sign-in or from the website. Fired by the `auth.users`
 * database webhook; see `signup-event.ts` for which rows qualify.
 */
export async function notifyNewUser(
  payload: NewUserPayload,
  opts: NotifyOptions = {},
): Promise<void> {
  const who = payload.email ?? "(no email)"
  const via = payload.provider ? ` · via ${payload.provider}` : ""
  await send(`:wave: *New user* — \`${who}\`${via}`, opts)
}

/** A first paid subscription landed. */
export async function notifySubscription(
  payload: PurchasePayload,
  opts: NotifyOptions = {},
): Promise<void> {
  const who = payload.email ?? "(no email)"
  const amount = formatMoney(payload.amountMinor, payload.currency)
  const money = amount ? ` · ${amount}` : ""
  await send(`:moneybag: *New subscription* — \`${who}\`${money}`, opts)
}

/** A one-time Remote credit pack was bought. */
export async function notifyCreditPurchase(
  payload: PurchasePayload,
  opts: NotifyOptions = {},
): Promise<void> {
  const who = payload.email ?? "(no email)"
  const amount = formatMoney(payload.amountMinor, payload.currency)
  const money = amount ? ` · ${amount}` : ""
  await send(`:coin: *Credit pack* — \`${who}\`${money}`, opts)
}

/** An active subscription went to canceled. */
export async function notifyCancellation(
  payload: CancellationPayload,
  opts: NotifyOptions = {},
): Promise<void> {
  const who = payload.email ?? "(no email)"
  const until = payload.accessUntil
    ? ` · access until ${payload.accessUntil.slice(0, 10)}`
    : ""
  await send(`:broken_heart: *Cancelled* — \`${who}\`${until}`, opts)
}

/**
 * Renders Stripe minor units as money. Returns null rather than a misleading
 * "0.00" when the amount is absent, so the caller can omit the clause.
 */
export function formatMoney(
  amountMinor: number | null | undefined,
  currency: string | null | undefined,
): string | null {
  if (amountMinor === null || amountMinor === undefined) return null
  if (!Number.isFinite(amountMinor)) return null
  const code = (currency ?? "usd").toUpperCase()
  const symbol = code === "USD" ? "$" : code === "EUR" ? "€" : `${code} `
  return `${symbol}${(amountMinor / 100).toFixed(2)}`
}

async function send(text: string, opts: NotifyOptions): Promise<void> {
  const url = opts.webhookUrl ?? process.env.SLACK_NEWUSERS_WEBHOOK_URL
  if (!url) return
  const transport = opts.transport ?? defaultTransport
  try {
    await transport(url, { text })
  } catch (error) {
    // Fire-and-forget: log so the miss is visible, never propagate.
    console.error("[slack] send failed", error)
  }
}
