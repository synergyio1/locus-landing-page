import { beforeEach, describe, expect, it, vi } from "vitest"

const { create, findUnique, update } = vi.hoisted(() => ({
  create: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
}))

vi.mock("./prisma", () => ({
  prisma: { organizations: { create, findUnique, update } },
}))

import { OrganizationsRepo } from "./organizationsRepo"

beforeEach(() => {
  create.mockReset()
  findUnique.mockReset()
  update.mockReset()
})

describe("OrganizationsRepo.create", () => {
  it("trims the name and canonicalizes the billing address", async () => {
    create.mockResolvedValue({ id: "org1" })

    await OrganizationsRepo.create({
      name: "  Acme Inc  ",
      billingEmail: " Billing@Acme.com ",
    })

    expect(create).toHaveBeenCalledWith({
      data: { name: "Acme Inc", billing_email: "billing@acme.com" },
    })
  })
})

describe("OrganizationsRepo.setBillingEmail", () => {
  it("canonicalizes the address so dunning cannot be sent to a variant", async () => {
    update.mockResolvedValue({})

    await OrganizationsRepo.setBillingEmail("org1", " Finance@ACME.com ")

    expect(update.mock.calls[0][0].data).toMatchObject({
      billing_email: "finance@acme.com",
    })
  })
})

describe("OrganizationsRepo.findById", () => {
  it("returns null when the organization does not exist", async () => {
    findUnique.mockResolvedValue(null)
    expect(await OrganizationsRepo.findById("org1")).toBeNull()
  })
})
