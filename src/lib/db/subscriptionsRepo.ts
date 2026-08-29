import "server-only"

import type { subscriptionsModel } from "@/generated/prisma/models"

import { prisma } from "./prisma"

export type SubscriptionRow = subscriptionsModel

export type PromoteSubscriptionFields = {
  stripe_customer_id: string
  stripe_subscription_id: string
  status: string
  current_period_end: Date | null
  cancel_at: Date | null
  trial_end: Date | null
  price_id: string | null
}

export type UpdateSubscriptionFields = {
  status: string
  current_period_end: Date | null
  cancel_at: Date | null
  trial_end: Date | null
  price_id: string | null
}

export const SubscriptionsRepo = {
  async findByUserId(userId: string): Promise<SubscriptionRow | null> {
    return prisma.subscriptions.findUnique({ where: { user_id: userId } })
  },

  /**
   * Organization-owned rows are found by organization, never by the admin's
   * user id — admins come and go, and the subscription belongs to the company.
   */
  async findByOrgId(orgId: string): Promise<SubscriptionRow | null> {
    return prisma.subscriptions.findUnique({ where: { org_id: orgId } })
  },

  /**
   * Is this Stripe customer ours at all?
   *
   * The Stripe account is shared with other Synergy IO products, so a webhook
   * for a customer we have never seen belongs to a sibling app. `findFirst`
   * rather than `findUnique`: a customer id can appear on both a personal and
   * an organization row, and either one proves ownership.
   */
  async findByCustomerId(
    stripeCustomerId: string
  ): Promise<SubscriptionRow | null> {
    return prisma.subscriptions.findFirst({
      where: { stripe_customer_id: stripeCustomerId },
    })
  },

  /**
   * Mirrors `claimOrFetch` for organizations: an `incomplete` placeholder exists
   * from the moment the organization does, so an abandoned Checkout leaves a
   * recoverable "finish setup" state rather than nothing at all. `incomplete` is
   * not an entitling status, so it licenses nobody in the meantime.
   */
  async claimOrFetchForOrg(
    orgId: string,
    quantity: number
  ): Promise<{ row: SubscriptionRow; claimed: boolean }> {
    const inserted = await prisma.$queryRaw<SubscriptionRow[]>`
      insert into app.subscriptions (org_id, stripe_customer_id, status, quantity)
      values (${orgId}::uuid, '', 'incomplete', ${quantity})
      on conflict (org_id) do nothing
      returning *
    `
    if (inserted.length > 0) return { row: inserted[0], claimed: true }

    const existing = await prisma.subscriptions.findUnique({
      where: { org_id: orgId },
    })
    if (!existing) {
      throw new Error(
        `subscriptions row for organization ${orgId} disappeared between claim and re-read`
      )
    }
    return { row: existing, claimed: false }
  },

  async insertWithCustomer(
    userId: string,
    stripeCustomerId: string
  ): Promise<void> {
    await prisma.subscriptions.create({
      data: {
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        status: "incomplete",
      },
    })
  },

  async claimOrFetch(
    userId: string
  ): Promise<{ row: SubscriptionRow; claimed: boolean }> {
    const inserted = await prisma.$queryRaw<SubscriptionRow[]>`
      insert into app.subscriptions (user_id, stripe_customer_id, status)
      values (${userId}::uuid, '', 'incomplete')
      on conflict (user_id) do nothing
      returning *
    `
    if (inserted.length > 0) return { row: inserted[0], claimed: true }

    const existing = await prisma.subscriptions.findUnique({
      where: { user_id: userId },
    })
    if (!existing) {
      throw new Error(
        `subscriptions row for ${userId} disappeared between claim and re-read`
      )
    }
    return { row: existing, claimed: false }
  },

  async attachStripeCustomer(
    userId: string,
    stripeCustomerId: string
  ): Promise<void> {
    await prisma.subscriptions.update({
      where: { user_id: userId },
      data: { stripe_customer_id: stripeCustomerId },
    })
  },

  async promoteOrInsertFromSubscription(
    userId: string,
    fields: PromoteSubscriptionFields
  ): Promise<{ promoted: boolean }> {
    const promoted = await prisma.$queryRaw<Array<{ user_id: string }>>`
      update app.subscriptions set
        stripe_customer_id = ${fields.stripe_customer_id},
        stripe_subscription_id = ${fields.stripe_subscription_id},
        status = ${fields.status},
        current_period_end = ${fields.current_period_end},
        cancel_at = ${fields.cancel_at},
        trial_end = ${fields.trial_end},
        price_id = ${fields.price_id}
      where user_id = ${userId}::uuid
        and stripe_subscription_id is null
      returning user_id
    `
    if (promoted.length > 0) return { promoted: true }

    await prisma.$executeRaw`
      insert into app.subscriptions (
        user_id, stripe_customer_id, stripe_subscription_id, status,
        current_period_end, cancel_at, trial_end, price_id
      ) values (
        ${userId}::uuid, ${fields.stripe_customer_id},
        ${fields.stripe_subscription_id}, ${fields.status},
        ${fields.current_period_end}, ${fields.cancel_at},
        ${fields.trial_end}, ${fields.price_id}
      )
      on conflict (stripe_subscription_id) do update set
        stripe_customer_id = excluded.stripe_customer_id,
        status = excluded.status,
        current_period_end = excluded.current_period_end,
        cancel_at = excluded.cancel_at,
        trial_end = excluded.trial_end,
        price_id = excluded.price_id
    `
    return { promoted: false }
  },

  async updateBySubscriptionId(
    stripeSubscriptionId: string,
    fields: UpdateSubscriptionFields
  ): Promise<{ user_id: string } | null> {
    const rows = await prisma.$queryRaw<Array<{ user_id: string }>>`
      update app.subscriptions set
        status = ${fields.status},
        current_period_end = ${fields.current_period_end},
        cancel_at = ${fields.cancel_at},
        trial_end = ${fields.trial_end},
        price_id = ${fields.price_id}
      where stripe_subscription_id = ${stripeSubscriptionId}
      returning user_id
    `
    return rows[0] ?? null
  },

  async markCanceledBySubscriptionId(
    stripeSubscriptionId: string
  ): Promise<{ user_id: string } | null> {
    const rows = await prisma.$queryRaw<Array<{ user_id: string }>>`
      update app.subscriptions set
        status = 'canceled',
        cancel_at = now()
      where stripe_subscription_id = ${stripeSubscriptionId}
      returning user_id
    `
    return rows[0] ?? null
  },
}
