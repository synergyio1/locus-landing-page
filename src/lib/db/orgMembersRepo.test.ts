import { beforeEach, describe, expect, it, vi } from "vitest"

const { findMany, findUnique, findFirst, create, update, updateMany, del, count } =
  vi.hoisted(() => ({
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    del: vi.fn(),
    count: vi.fn(),
  }))

vi.mock("./prisma", () => ({
  prisma: {
    org_members: {
      findMany,
      findUnique,
      findFirst,
      create,
      update,
      updateMany,
      delete: del,
      count,
    },
  },
}))

import { OrgMembersRepo } from "./orgMembersRepo"

beforeEach(() => {
  for (const spy of [findMany, findUnique, findFirst, create, update, updateMany, del, count]) {
    spy.mockReset()
  }
})

describe("OrgMembersRepo.add", () => {
  it("stores the typed address for display and the canonical one for matching", async () => {
    create.mockResolvedValue({ id: "m1" })

    await OrgMembersRepo.add({ orgId: "org1", email: "  Bob@Acme.com ", seat: true })

    expect(create).toHaveBeenCalledWith({
      data: {
        org_id: "org1",
        email: "Bob@Acme.com",
        normalized_email: "bob@acme.com",
        seat: true,
        admin: false,
      },
    })
  })

  it("defaults both roles off, so a caller must say what it is granting", async () => {
    create.mockResolvedValue({ id: "m1" })

    await OrgMembersRepo.add({ orgId: "org1", email: "bob@acme.com" })

    expect(create.mock.calls[0][0].data).toMatchObject({ seat: false, admin: false })
  })
})

describe("OrgMembersRepo.findByOrgAndEmail", () => {
  it("looks up on the canonical form regardless of how the admin typed it", async () => {
    findUnique.mockResolvedValue(null)

    await OrgMembersRepo.findByOrgAndEmail("org1", "BOB@Acme.com ")

    expect(findUnique).toHaveBeenCalledWith({
      where: {
        org_id_normalized_email: {
          org_id: "org1",
          normalized_email: "bob@acme.com",
        },
      },
    })
  })
})

describe("OrgMembersRepo.setFlags", () => {
  it("unbinds the verified account when admin is revoked", async () => {
    update.mockResolvedValue({})

    await OrgMembersRepo.setFlags("m1", { admin: false })

    expect(update.mock.calls[0][0].data).toMatchObject({
      admin: false,
      admin_user_id: null,
    })
  })

  it("leaves the binding alone when only the seat changes", async () => {
    update.mockResolvedValue({})

    await OrgMembersRepo.setFlags("m1", { seat: true })

    expect(update.mock.calls[0][0].data).not.toHaveProperty("admin_user_id")
  })
})

describe("OrgMembersRepo.bindAdminIdentity", () => {
  it("activates only unbound admin rows for that address", async () => {
    updateMany.mockResolvedValue({ count: 2 })

    const bound = await OrgMembersRepo.bindAdminIdentity(" Bob@Acme.com", "user-1")

    expect(bound).toBe(2)
    expect(updateMany.mock.calls[0][0].where).toEqual({
      normalized_email: "bob@acme.com",
      admin: true,
      admin_user_id: null,
    })
    expect(updateMany.mock.calls[0][0].data).toMatchObject({
      admin_user_id: "user-1",
    })
  })

  it("never touches seat-only rows", async () => {
    updateMany.mockResolvedValue({ count: 0 })

    await OrgMembersRepo.bindAdminIdentity("bob@acme.com", "user-1")

    expect(updateMany.mock.calls[0][0].where).toMatchObject({ admin: true })
  })
})

describe("OrgMembersRepo.findBoundAdmin", () => {
  it("requires the organization AND the bound user id, not an email match", async () => {
    findFirst.mockResolvedValue(null)

    await OrgMembersRepo.findBoundAdmin("org1", "user-1")

    expect(findFirst).toHaveBeenCalledWith({
      where: { org_id: "org1", admin: true, admin_user_id: "user-1" },
    })
  })

  it("returns null for an admin of a different organization", async () => {
    findFirst.mockResolvedValue(null)
    expect(await OrgMembersRepo.findBoundAdmin("org2", "user-1")).toBeNull()
  })
})

describe("OrgMembersRepo.listAdminOrganizationIds", () => {
  it("lists only organizations where the caller is a bound admin", async () => {
    findMany.mockResolvedValue([{ org_id: "org1" }, { org_id: "org2" }])

    expect(await OrgMembersRepo.listAdminOrganizationIds("user-1")).toEqual([
      "org1",
      "org2",
    ])
    expect(findMany.mock.calls[0][0].where).toEqual({
      admin: true,
      admin_user_id: "user-1",
    })
  })
})

describe("OrgMembersRepo counts", () => {
  it("counts seats and admins independently", async () => {
    count.mockResolvedValue(3)

    await OrgMembersRepo.countSeats("org1")
    await OrgMembersRepo.countAdmins("org1")

    expect(count.mock.calls[0][0].where).toEqual({ org_id: "org1", seat: true })
    expect(count.mock.calls[1][0].where).toEqual({ org_id: "org1", admin: true })
  })
})
