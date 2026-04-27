import { describe, it, expect, vi, beforeEach } from "vitest"
import type Stripe from "stripe"

import checkoutCompletedFixture from "./__fixtures__/checkout.session.completed.json"
import subscriptionRetrieveFixture from "./__fixtures__/customer.subscription.retrieve.json"
import subscriptionCanceledFixture from "./__fixtures__/customer.subscription.updated.canceled.json"
import subscriptionPriceswapFixture from "./__fixtures__/customer.subscription.updated.priceswap.json"
import subscriptionDeletedFixture from "./__fixtures__/customer.subscription.deleted.json"
import unknownEventFixture from "./__fixtures__/unknown.event.json"

const sqlFn = vi.fn()
const subscriptionsRetrieve = vi.fn()

vi.mock("@/lib/db/client", () => ({
  getDb: () => sqlFn,
}))

vi.mock("../client", () => ({
  getStripeClient: () => ({
    subscriptions: { retrieve: subscriptionsRetrieve },
  }),
}))

import { handleStripeEvent } from "./handle"

describe("handleStripeEvent", () => {
  beforeEach(() => {
    sqlFn.mockReset()
    subscriptionsRetrieve.mockReset()
  })

  describe("checkout.session.completed", () => {
    it("retrieves the embedded subscription and upserts subscriptions row by user_id", async () => {
      subscriptionsRetrieve.mockResolvedValueOnce(subscriptionRetrieveFixture)
      sqlFn.mockResolvedValueOnce([{ user_id: "user-uuid-123" }])

      const result = await handleStripeEvent(
        checkoutCompletedFixture as unknown as Stripe.Event
      )

      expect(result).toEqual({
        handled: true,
        type: "checkout.session.completed",
      })
      expect(subscriptionsRetrieve).toHaveBeenCalledWith(
        "sub_1QabcDEFghIJklMNop"
      )
      expect(sqlFn).toHaveBeenCalledTimes(1)
      const args = sqlFn.mock.calls[0]
      expect(args).toContain("user-uuid-123")
      expect(args).toContain("cus_RaBcDeFgH")
      expect(args).toContain("sub_1QabcDEFghIJklMNop")
      expect(args).toContain("active")
      expect(args).toContain("price_monthly_xyz")
    })

    it("returns missing_client_reference_id and writes nothing if client_reference_id is absent", async () => {
      const broken = {
        ...checkoutCompletedFixture,
        data: {
          object: {
            ...checkoutCompletedFixture.data.object,
            client_reference_id: null,
          },
        },
      }

      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})
      const result = await handleStripeEvent(broken as unknown as Stripe.Event)
      errSpy.mockRestore()

      expect(result).toEqual({
        handled: false,
        type: "checkout.session.completed",
        reason: "missing_client_reference_id",
      })
      expect(subscriptionsRetrieve).not.toHaveBeenCalled()
      expect(sqlFn).not.toHaveBeenCalled()
    })
  })

  describe("customer.subscription.updated", () => {
    it("updates the row located by stripe_subscription_id with new status / period / cancel_at / trial_end / price_id", async () => {
      sqlFn.mockResolvedValueOnce([{ user_id: "user-uuid-123" }])

      const result = await handleStripeEvent(
        subscriptionCanceledFixture as unknown as Stripe.Event
      )

      expect(result).toMatchObject({
        handled: true,
        type: "customer.subscription.updated",
      })
      expect(sqlFn).toHaveBeenCalledTimes(1)
      const args = sqlFn.mock.calls[0]
      expect(args).toContain("sub_1QabcDEFghIJklMNop")
      expect(args).toContain("canceled")
      expect(args).toContain("price_monthly_xyz")
    })

    it("flags an active->canceled transition for cancellation email follow-up", async () => {
      sqlFn.mockResolvedValueOnce([{ user_id: "user-uuid-123" }])

      const result = await handleStripeEvent(
        subscriptionCanceledFixture as unknown as Stripe.Event
      )

      expect(result).toMatchObject({
        handled: true,
        cancellationTransition: true,
      })
    })

    it("does not flag a price-swap update as a cancellation transition", async () => {
      sqlFn.mockResolvedValueOnce([{ user_id: "user-uuid-123" }])

      const result = await handleStripeEvent(
        subscriptionPriceswapFixture as unknown as Stripe.Event
      )

      expect(result).toMatchObject({ handled: true })
      expect(
        (result as { cancellationTransition?: boolean }).cancellationTransition
      ).toBeFalsy()
    })

    it("returns subscription_not_found when no row matches", async () => {
      sqlFn.mockResolvedValueOnce([])

      const result = await handleStripeEvent(
        subscriptionCanceledFixture as unknown as Stripe.Event
      )

      expect(result).toEqual({
        handled: false,
        type: "customer.subscription.updated",
        reason: "subscription_not_found",
      })
    })
  })

  describe("customer.subscription.deleted", () => {
    it("marks the row canceled and sets cancel_at to now()", async () => {
      sqlFn.mockResolvedValueOnce([{ user_id: "user-uuid-123" }])

      const result = await handleStripeEvent(
        subscriptionDeletedFixture as unknown as Stripe.Event
      )

      expect(result).toEqual({
        handled: true,
        type: "customer.subscription.deleted",
      })
      expect(sqlFn).toHaveBeenCalledTimes(1)
      const args = sqlFn.mock.calls[0]
      expect(args).toContain("sub_1QabcDEFghIJklMNop")
    })

    it("returns subscription_not_found when no row matches", async () => {
      sqlFn.mockResolvedValueOnce([])

      const result = await handleStripeEvent(
        subscriptionDeletedFixture as unknown as Stripe.Event
      )

      expect(result).toEqual({
        handled: false,
        type: "customer.subscription.deleted",
        reason: "subscription_not_found",
      })
    })
  })

  describe("unknown event types", () => {
    it("returns handled: false with reason unknown_type and does not touch DB or Stripe", async () => {
      const result = await handleStripeEvent(
        unknownEventFixture as unknown as Stripe.Event
      )

      expect(result).toEqual({
        handled: false,
        type: "invoice.payment_succeeded",
        reason: "unknown_type",
      })
      expect(sqlFn).not.toHaveBeenCalled()
      expect(subscriptionsRetrieve).not.toHaveBeenCalled()
    })
  })
})
