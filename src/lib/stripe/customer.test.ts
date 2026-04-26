import { describe, it, expect, vi, beforeEach } from "vitest"

const customersCreate = vi.fn()

vi.mock("./client", () => ({
  getStripeClient: () => ({
    customers: { create: customersCreate },
  }),
}))

import { getOrCreateCustomer } from "./customer"

type SubsBuilder = {
  select: ReturnType<typeof vi.fn>
  eq: ReturnType<typeof vi.fn>
  maybeSingle: ReturnType<typeof vi.fn>
  upsert: ReturnType<typeof vi.fn>
}

function makeSupabase(opts: {
  existingCustomerId?: string | null
  selectError?: { message: string } | null
  upsertError?: { message: string } | null
}) {
  const builder: SubsBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({
      data:
        opts.existingCustomerId === undefined
          ? null
          : { stripe_customer_id: opts.existingCustomerId },
      error: opts.selectError ?? null,
    }),
    upsert: vi
      .fn()
      .mockResolvedValue({ data: null, error: opts.upsertError ?? null }),
  }
  const supabase = {
    from: vi.fn().mockReturnValue(builder),
  }
  return { supabase, builder }
}

describe("getOrCreateCustomer", () => {
  beforeEach(() => {
    customersCreate.mockReset()
  })

  it("returns the existing stripe_customer_id without calling Stripe", async () => {
    const { supabase, builder } = makeSupabase({
      existingCustomerId: "cus_existing",
    })

    const id = await getOrCreateCustomer({
      // @ts-expect-error fake
      supabase,
      userId: "u1",
      email: "cook@example.com",
    })

    expect(id).toBe("cus_existing")
    expect(customersCreate).not.toHaveBeenCalled()
    expect(supabase.from).toHaveBeenCalledWith("subscriptions")
    expect(builder.upsert).not.toHaveBeenCalled()
  })

  it("creates a Stripe customer and upserts a stub subscription row when none exists", async () => {
    const { supabase, builder } = makeSupabase({ existingCustomerId: null })
    customersCreate.mockResolvedValue({ id: "cus_new" })

    const id = await getOrCreateCustomer({
      // @ts-expect-error fake
      supabase,
      userId: "u1",
      email: "cook@example.com",
    })

    expect(id).toBe("cus_new")
    expect(customersCreate).toHaveBeenCalledWith({
      email: "cook@example.com",
      metadata: { supabase_user_id: "u1" },
    })
    expect(builder.upsert).toHaveBeenCalledWith(
      {
        user_id: "u1",
        stripe_customer_id: "cus_new",
        status: "incomplete",
      },
      { onConflict: "user_id" }
    )
  })

  it("creates a customer when no subscription row exists at all", async () => {
    const { supabase } = makeSupabase({ existingCustomerId: undefined })
    customersCreate.mockResolvedValue({ id: "cus_brand_new" })

    const id = await getOrCreateCustomer({
      // @ts-expect-error fake
      supabase,
      userId: "u1",
      email: "cook@example.com",
    })

    expect(id).toBe("cus_brand_new")
    expect(customersCreate).toHaveBeenCalled()
  })

  it("throws when subscription lookup errors", async () => {
    const { supabase } = makeSupabase({
      selectError: { message: "boom" },
    })

    await expect(
      getOrCreateCustomer({
        // @ts-expect-error fake
        supabase,
        userId: "u1",
        email: "cook@example.com",
      })
    ).rejects.toThrow(/boom/)
    expect(customersCreate).not.toHaveBeenCalled()
  })

  it("throws when upsert fails", async () => {
    const { supabase } = makeSupabase({
      existingCustomerId: null,
      upsertError: { message: "constraint" },
    })
    customersCreate.mockResolvedValue({ id: "cus_new" })

    await expect(
      getOrCreateCustomer({
        // @ts-expect-error fake
        supabase,
        userId: "u1",
        email: "cook@example.com",
      })
    ).rejects.toThrow(/constraint/)
  })
})
