# Backlog

Parked work for the Locus site + web portal. Each item says why it is parked and
what today's design already guarantees about it, so nothing here needs a rewrite
of what shipped.

Sibling logs: decisions live in `../../pomodoro-preview/docs/adr/`, the glossary in
`../../pomodoro-preview/CONTEXT.md`, session narratives in
`../../pomodoro-preview/grills/`.

---

## Teams / Organizations — deferred from v1 (grilled 2026-08-21)

v1 ships: Organizations owning one Stripe subscription, email-keyed seats, an
admin portal at `/team`, $4 per seat monthly / $40 yearly. See
[ADR-0016](../../pomodoro-preview/docs/adr/0016-organizations-own-seats.md).

### 1. Domain auto-join
Anyone signing in with an `@acme.com` address gets a seat automatically.
Expressible as a wildcard member row, so the schema does not block it.
**Parked because:** it collides with high-water seat billing — headcount (and the
invoice) would grow without an admin ever acting. Needs a cap, an approval queue,
or both before it is safe to sell.

### 2. Admin-funded credits
Admin buys Remote credits in the portal and allocates them to a member; the
allocation is a positive `app.credit_ledger` row with org provenance, so the
metering hot path in `responses-gateway` never learns what an Organization is.
**Parked because:** v1's centrally-funded compute answer is a company API key in
the BYO rail — better rates, the company's own dashboard, no prepaid float.
Revisit when a team actually asks. Never build a *pooled* org balance: without
per-member caps one person drains it, and with caps it becomes a budgeting product.

### 3. PO / bank transfer / net-30
v1 is card-only self-serve.
**Parked because:** it needs a human in the loop and Stripe invoicing setup, and
the first company big enough to demand it can be handled by email.

### 4. `/teams` marketing page
v1 puts one benefits-only row in the pricing section.
**Parked because:** a full page means inventing buyer objections before a buyer
has raised one. When it is written, the privacy story belongs there in its
*compliance* framing — "no employee activity is stored, so there is nothing to
take to legal or the works council" — never as "you cannot see their work",
which reads as a missing feature on a pricing page.

### 5. Org-wide routine packs
An admin publishes a pack (company onboarding routine, a team retro) that members
can adopt. The most interesting future item: the first thing an Organization
could offer its members that is not billing.
**Constraint to preserve:** adoption stays opt-in per member and obeys the
existing one-active-pack overlay rule. An org must never be able to push a pack
onto someone's Mac — that would make the Organization a data/behaviour authority,
which ADR-0016 explicitly refuses.

### 6. SSO / SCIM
**Parked because:** SCIM would replace the email-join model wholesale, and SSO is
only credible with an enterprise contract behind it. Build when someone pays for
it, not before.
