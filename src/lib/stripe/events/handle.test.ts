import { describe, it, expect, vi, beforeEach } from "vitest"
import type Stripe from "stripe"

import checkoutCompletedFixture from "./__fixtures__/checkout.session.completed.json"
import subscriptionRetrieveFixture from "./__fixtures__/customer.subscription.retrieve.json"
import subscriptionCanceledFixture from "./__fixtures__/customer.subscription.updated.canceled.json"
import subscriptionPriceswapFixture from "./__fixtures__/customer.subscription.updated.priceswap.json"
import subscriptionDeletedFixture from "./__fixtures__/customer.subscription.deleted.json"
import invoicePaymentFailedFixture from "./__fixtures__/invoice.payment_failed.json"
import unknownEventFixture from "./__fixtures__/unknown.event.json"

const {
  promoteOrInsertFromSubscription,
  updateBySubscriptionId,
  markCanceledBySubscriptionId,
  queryRaw,
  subscriptionsRetrieve,
  sendWelcomeMock,
  sendCancellationMock,
  sendPaymentFailedMock,
} = vi.hoisted(() => ({
  promoteOrInsertFromSubscription: vi.fn(),
  updateBySubscriptionId: vi.fn(),
  markCanceledBySubscriptionId: vi.fn(),
  queryRaw: vi.fn(),
  subscriptionsRetrieve: vi.fn(),
  sendWelcomeMock: vi.fn(),
  sendCancellationMock: vi.fn(),
  sendPaymentFailedMock: vi.fn(),
}))

vi.mock("@/lib/db/subscriptionsRepo", () => ({
  SubscriptionsRepo: {
    promoteOrInsertFromSubscription,
    updateBySubscriptionId,
    markCanceledBySubscriptionId,
  },
}))

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    $queryRaw: queryRaw,
  },
}))

vi.mock("../client", () => ({
  getStripeClient: () => ({
    subscriptions: { retrieve: subscriptionsRetrieve },
  }),
}))

vi.mock("@/lib/mail/sendWelcome", () => ({
  sendWelcome: (...args: unknown[]) => sendWelcomeMock(...args),
}))

vi.mock("@/lib/mail/sendCancellation", () => ({
  sendCancellation: (...args: unknown[]) => sendCancellationMock(...args),
}))

vi.mock("@/lib/mail/sendPaymentFailed", () => ({
  sendPaymentFailed: (...args: unknown[]) => sendPaymentFailedMock(...args),
}))

import { handleStripeEvent } from "./handle"

describe("handleStripeEvent", () => {
  beforeEach(() => {
    promoteOrInsertFromSubscription.mockReset()
    updateBySubscriptionId.mockReset()
    markCanceledBySubscriptionId.mockReset()
    queryRaw.mockReset()
    subscriptionsRetrieve.mockReset()
    sendWelcomeMock.mockReset()
    sendWelcomeMock.mockResolvedValue(undefined)
    sendCancellationMock.mockReset()
    sendCancellationMock.mockResolvedValue(undefined)
    sendPaymentFailedMock.mockReset()
    sendPaymentFailedMock.mockResolvedValue(undefined)
  })

  describe("checkout.session.completed", () => {
    it("retrieves the embedded subscription and upserts subscriptions row by user_id", async () => {
      subscriptionsRetrieve.mockResolvedValueOnce(subscriptionRetrieveFixture)
      promoteOrInsertFromSubscription.mockResolvedValueOnce({ promoted: true })

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
      expect(promoteOrInsertFromSubscription).toHaveBeenCalledTimes(1)
      const [userId, fields] = promoteOrInsertFromSubscription.mock.calls[0]
      expect(userId).toBe("user-uuid-123")
      expect(fields).toMatchObject({
        stripe_customer_id: "cus_RaBcDeFgH",
        stripe_subscription_id: "sub_1QabcDEFghIJklMNop",
        status: "active",
        price_id: "price_monthly_xyz",
      })
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
      expect(promoteOrInsertFromSubscription).not.toHaveBeenCalled()
      expect(sendWelcomeMock).not.toHaveBeenCalled()
    })

    it("sends a welcome email after the upsert with the buyer's email + a download URL", async () => {
      subscriptionsRetrieve.mockResolvedValueOnce(subscriptionRetrieveFixture)
      promoteOrInsertFromSubscription.mockResolvedValueOnce({ promoted: true })
      const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
      process.env.NEXT_PUBLIC_SITE_URL = "https://preview.getlocus.tech"

      try {
        await handleStripeEvent(
          checkoutCompletedFixture as unknown as Stripe.Event
        )
      } finally {
        if (previousSiteUrl === undefined) {
          delete process.env.NEXT_PUBLIC_SITE_URL
        } else {
          process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl
        }
      }

      expect(sendWelcomeMock).toHaveBeenCalledTimes(1)
      const [recipient, options] = sendWelcomeMock.mock.calls[0]
      expect(recipient).toMatchObject({ email: "ada@example.com" })
      expect(options).toEqual({
        downloadUrl: "https://preview.getlocus.tech/download",
      })
    })

    it("falls back to looking up the user's email via auth.users when the session has none", async () => {
      const fixture = {
        ...checkoutCompletedFixture,
        data: {
          object: {
            ...checkoutCompletedFixture.data.object,
            customer_email: null,
            customer_details: null,
          },
        },
      }
      subscriptionsRetrieve.mockResolvedValueOnce(subscriptionRetrieveFixture)
      promoteOrInsertFromSubscription.mockResolvedValueOnce({ promoted: true })
      queryRaw.mockResolvedValueOnce([{ email: "fallback@example.com" }])

      await handleStripeEvent(fixture as unknown as Stripe.Event)

      expect(sendWelcomeMock).toHaveBeenCalledTimes(1)
      const [recipient] = sendWelcomeMock.mock.calls[0]
      expect(recipient).toMatchObject({ email: "fallback@example.com" })
    })

    it("does not throw if the welcome email send fails (handler must succeed for Stripe)", async () => {
      subscriptionsRetrieve.mockResolvedValueOnce(subscriptionRetrieveFixture)
      promoteOrInsertFromSubscription.mockResolvedValueOnce({ promoted: true })
      sendWelcomeMock.mockRejectedValueOnce(new Error("resend down"))
      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const result = await handleStripeEvent(
        checkoutCompletedFixture as unknown as Stripe.Event
      )
      errSpy.mockRestore()

      expect(result).toEqual({
        handled: true,
        type: "checkout.session.completed",
      })
    })
  })

  describe("customer.subscription.updated", () => {
    it("updates the row located by stripe_subscription_id with new status / period / cancel_at / trial_end / price_id", async () => {
      updateBySubscriptionId.mockResolvedValueOnce({ user_id: "user-uuid-123" })
      queryRaw.mockResolvedValueOnce([{ email: "ada@example.com" }])

      const result = await handleStripeEvent(
        subscriptionCanceledFixture as unknown as Stripe.Event
      )

      expect(result).toMatchObject({
        handled: true,
        type: "customer.subscription.updated",
      })
      const [stripeSubId, fields] = updateBySubscriptionId.mock.calls[0]
      expect(stripeSubId).toBe("sub_1QabcDEFghIJklMNop")
      expect(fields).toMatchObject({
        status: "canceled",
        price_id: "price_monthly_xyz",
      })
    })

    it("flags an active->canceled transition for cancellation email follow-up", async () => {
      updateBySubscriptionId.mockResolvedValueOnce({ user_id: "user-uuid-123" })
      queryRaw.mockResolvedValueOnce([{ email: "ada@example.com" }])

      const result = await handleStripeEvent(
        subscriptionCanceledFixture as unknown as Stripe.Event
      )

      expect(result).toMatchObject({
        handled: true,
        cancellationTransition: true,
      })
    })

    it("sends a cancellation email with the access-until date on an active->canceled transition", async () => {
      updateBySubscriptionId.mockResolvedValueOnce({ user_id: "user-uuid-123" })
      queryRaw.mockResolvedValueOnce([{ email: "ada@example.com" }])

      await handleStripeEvent(
        subscriptionCanceledFixture as unknown as Stripe.Event
      )

      expect(sendCancellationMock).toHaveBeenCalledTimes(1)
      const [recipient, options] = sendCancellationMock.mock.calls[0]
      expect(recipient).toMatchObject({ email: "ada@example.com" })
      expect(options.accessUntil).toBe(
        new Date(1738281600 * 1000).toISOString()
      )
    })

    it("does not send a cancellation email on a non-cancellation update (price swap)", async () => {
      updateBySubscriptionId.mockResolvedValueOnce({ user_id: "user-uuid-123" })

      await handleStripeEvent(
        subscriptionPriceswapFixture as unknown as Stripe.Event
      )

      expect(sendCancellationMock).not.toHaveBeenCalled()
    })

    it("does not flag a price-swap update as a cancellation transition", async () => {
      updateBySubscriptionId.mockResolvedValueOnce({ user_id: "user-uuid-123" })

      const result = await handleStripeEvent(
        subscriptionPriceswapFixture as unknown as Stripe.Event
      )

      expect(result).toMatchObject({ handled: true })
      expect(
        (result as { cancellationTransition?: boolean }).cancellationTransition
      ).toBeFalsy()
    })

    it("does not throw if the cancellation email send fails", async () => {
      updateBySubscriptionId.mockResolvedValueOnce({ user_id: "user-uuid-123" })
      queryRaw.mockResolvedValueOnce([{ email: "ada@example.com" }])
      sendCancellationMock.mockRejectedValueOnce(new Error("resend down"))
      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const result = await handleStripeEvent(
        subscriptionCanceledFixture as unknown as Stripe.Event
      )
      errSpy.mockRestore()

      expect(result).toMatchObject({
        handled: true,
        cancellationTransition: true,
      })
    })

    it("returns subscription_not_found when no row matches", async () => {
      updateBySubscriptionId.mockResolvedValueOnce(null)

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
      markCanceledBySubscriptionId.mockResolvedValueOnce({
        user_id: "user-uuid-123",
      })

      const result = await handleStripeEvent(
        subscriptionDeletedFixture as unknown as Stripe.Event
      )

      expect(result).toEqual({
        handled: true,
        type: "customer.subscription.deleted",
      })
      expect(markCanceledBySubscriptionId).toHaveBeenCalledWith(
        "sub_1QabcDEFghIJklMNop"
      )
    })

    it("returns subscription_not_found when no row matches", async () => {
      markCanceledBySubscriptionId.mockResolvedValueOnce(null)

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

  describe("invoice.payment_failed", () => {
    it("dispatches the dunning email with the hosted_invoice_url and customer email", async () => {
      const result = await handleStripeEvent(
        invoicePaymentFailedFixture as unknown as Stripe.Event
      )

      expect(result).toEqual({
        handled: true,
        type: "invoice.payment_failed",
      })
      expect(sendPaymentFailedMock).toHaveBeenCalledTimes(1)
      const [recipient, options] = sendPaymentFailedMock.mock.calls[0]
      expect(recipient).toEqual({ email: "ada@example.com" })
      expect(options).toEqual({
        updatePaymentUrl: "https://invoice.stripe.com/i/test_xyz",
      })
    })

    it("does not write to the DB beyond the events row", async () => {
      await handleStripeEvent(
        invoicePaymentFailedFixture as unknown as Stripe.Event
      )
      expect(promoteOrInsertFromSubscription).not.toHaveBeenCalled()
      expect(updateBySubscriptionId).not.toHaveBeenCalled()
      expect(markCanceledBySubscriptionId).not.toHaveBeenCalled()
    })

    it("falls back to the account URL when hosted_invoice_url is absent", async () => {
      const fixture = {
        ...invoicePaymentFailedFixture,
        data: {
          object: {
            ...invoicePaymentFailedFixture.data.object,
            hosted_invoice_url: null,
          },
        },
      }
      const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
      process.env.NEXT_PUBLIC_SITE_URL = "https://preview.getlocus.tech"
      try {
        await handleStripeEvent(fixture as unknown as Stripe.Event)
      } finally {
        if (previousSiteUrl === undefined) {
          delete process.env.NEXT_PUBLIC_SITE_URL
        } else {
          process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl
        }
      }
      const [, options] = sendPaymentFailedMock.mock.calls[0]
      expect(options.updatePaymentUrl).toBe(
        "https://preview.getlocus.tech/account"
      )
    })

    it("does not throw if the dunning email send fails", async () => {
      sendPaymentFailedMock.mockRejectedValueOnce(new Error("resend down"))
      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      const result = await handleStripeEvent(
        invoicePaymentFailedFixture as unknown as Stripe.Event
      )
      errSpy.mockRestore()

      expect(result).toEqual({
        handled: true,
        type: "invoice.payment_failed",
      })
    })

    it("returns handled:true without error when no recipient email is available", async () => {
      const fixture = {
        ...invoicePaymentFailedFixture,
        data: {
          object: {
            ...invoicePaymentFailedFixture.data.object,
            customer_email: null,
            customer: "cus_RaBcDeFgH",
          },
        },
      }
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

      const result = await handleStripeEvent(fixture as unknown as Stripe.Event)
      warnSpy.mockRestore()

      expect(result).toEqual({
        handled: true,
        type: "invoice.payment_failed",
      })
      expect(sendPaymentFailedMock).not.toHaveBeenCalled()
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
      expect(promoteOrInsertFromSubscription).not.toHaveBeenCalled()
      expect(updateBySubscriptionId).not.toHaveBeenCalled()
      expect(markCanceledBySubscriptionId).not.toHaveBeenCalled()
      expect(subscriptionsRetrieve).not.toHaveBeenCalled()
    })
  })
})
