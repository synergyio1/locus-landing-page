# `#locus-newusers` alerts

Ops pings for the two things worth knowing in real time: somebody signed up,
somebody paid (or left). Deliberately low-ceremony — this is a pulse check, not
analytics. PostHog remains the durable record.

## What fires

| Event | Source | Where |
| --- | --- | --- |
| New user | Supabase `auth.users` database webhook | `src/app/api/supabase/user-created/route.ts` |
| New subscription | Stripe `checkout.session.completed` | `src/lib/stripe/events/handle.ts` |
| Credit pack | Stripe `checkout.session.completed` (credit metadata) | same |
| Cancellation | Stripe `customer.subscription.deleted` | same |

Renewals (`invoice.paid`) deliberately do **not** ping. They grow into steady
noise as subscribers accumulate and drown the signal.

## Environment

| Var | Purpose |
| --- | --- |
| `SLACK_NEWUSERS_WEBHOOK_URL` | Slack incoming webhook. **Unset = every helper no-ops silently**, which is the intended state locally and in previews. |
| `LOCUS_SUPABASE_WEBHOOK_SECRET` | Shared secret the Supabase webhook presents as `x-locus-webhook-secret`. Generate with `openssl rand -hex 32`. |

## Wiring the signup webhook

Supabase dashboard → **Database → Webhooks → Create a new hook**:

- Table: `auth.users`
- Events: **Insert** and **Update** (both are required — see below)
- Type: HTTP Request, `POST`, `https://getlocus.tech/api/supabase/user-created`
- HTTP Header: `x-locus-webhook-secret` = the value of `LOCUS_SUPABASE_WEBHOOK_SECRET`

If the dashboard will not offer `auth.users` (the UI lists `public` by default),
create the trigger from the SQL editor instead — substituting the real secret,
and running it there rather than committing it to a migration:

```sql
create trigger locus_new_user_webhook
after insert or update on auth.users
for each row
execute function supabase_functions.http_request(
  'https://getlocus.tech/api/supabase/user-created',
  'POST',
  '{"Content-Type":"application/json","x-locus-webhook-secret":"REPLACE_ME"}',
  '{}',
  '5000'
);
```

### Why both INSERT and UPDATE

`auth.users` is the one table both surfaces write: the Mac app signs in with
`signInWithIdToken`, the website with `signInWithOtp` / `signInWithOAuth`. But
neither event alone is "a new user":

- **INSERT alone misses the website.** `signInWithOtp` inserts the row the moment
  somebody types an email — before the code is entered. Announcing that means
  announcing people who never finished, and anyone who typed a stranger's address.
- **UPDATE alone is far too loud.** GoTrue stamps `last_sign_in_at` on every
  sign-in, so every returning user is an UPDATE.

So the signal is the *edge* where an account becomes confirmed, and
`signup-event.ts` owns that decision:

| Delivery | Result |
| --- | --- |
| INSERT, already confirmed | ping — OAuth / native sign-in |
| INSERT, unconfirmed | silent — code requested, not yet entered |
| UPDATE, unconfirmed → confirmed | ping — the code was just entered |
| UPDATE, already confirmed | silent — a returning sign-in |

## Contract

Every helper is **fire-and-forget**: a Slack transport failure is logged and
swallowed. Slack being down must never fail a Stripe webhook (Stripe retries for
three days and then disables the endpoint — a chat outage would take billing
down with it) and must never fail a signup.

Every helper is **transport-injectable**, so tests pass a `vi.fn()` and a test
run can never post to the real channel.

The module owns no analytics. The Stripe handler already emits its own
`captureServerEvent` calls; a second one from in here would double-count the
funnel. Call sites own their own analytics.
