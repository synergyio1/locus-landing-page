import "server-only"

import type { org_membersModel } from "@/generated/prisma/models"

import { normalizeEmail } from "../org/normalizeEmail"

import { prisma } from "./prisma"

export type OrgMemberRow = org_membersModel

export type AddMemberInput = {
  orgId: string
  /** As typed — kept for display and outbound mail. */
  email: string
  seat?: boolean
  admin?: boolean
}

export const OrgMembersRepo = {
  async listByOrg(orgId: string): Promise<OrgMemberRow[]> {
    return prisma.org_members.findMany({
      where: { org_id: orgId },
      orderBy: [{ admin: "desc" }, { normalized_email: "asc" }],
    })
  },

  async findByOrgAndEmail(
    orgId: string,
    email: string
  ): Promise<OrgMemberRow | null> {
    return prisma.org_members.findUnique({
      where: {
        org_id_normalized_email: {
          org_id: orgId,
          normalized_email: normalizeEmail(email),
        },
      },
    })
  },

  async add(input: AddMemberInput): Promise<OrgMemberRow> {
    return prisma.org_members.create({
      data: {
        org_id: input.orgId,
        email: input.email.trim(),
        normalized_email: normalizeEmail(input.email),
        seat: input.seat ?? false,
        admin: input.admin ?? false,
      },
    })
  },

  async setFlags(
    memberId: string,
    flags: { seat?: boolean; admin?: boolean }
  ): Promise<void> {
    await prisma.org_members.update({
      where: { id: memberId },
      data: {
        ...flags,
        // Demotion unbinds the verified account; a later re-promotion must bind
        // again rather than inherit a stale identity.
        ...(flags.admin === false ? { admin_user_id: null } : {}),
        updated_at: new Date(),
      },
    })
  },

  async remove(memberId: string): Promise<void> {
    await prisma.org_members.delete({ where: { id: memberId } })
  },

  async countSeats(orgId: string): Promise<number> {
    return prisma.org_members.count({ where: { org_id: orgId, seat: true } })
  },

  async countAdmins(orgId: string): Promise<number> {
    return prisma.org_members.count({ where: { org_id: orgId, admin: true } })
  },

  /**
   * Activates admin rows for an address that has just proved it controls that
   * mailbox by signing in. Until this runs, an admin row grants nothing.
   *
   * A seat is email-keyed and needs no verification — it only grants a licence.
   * Admin grants the company's card, and `auth.users.email` is mutable with only
   * partial uniqueness, so admin authority is pinned to a user id instead.
   */
  async bindAdminIdentity(email: string, userId: string): Promise<number> {
    const result = await prisma.org_members.updateMany({
      where: {
        normalized_email: normalizeEmail(email),
        admin: true,
        admin_user_id: null,
      },
      data: { admin_user_id: userId, updated_at: new Date() },
    })
    return result.count
  },

  /**
   * The authorization primitive. Returns the membership only when the caller is
   * a *bound* admin of that specific organization — never "the first
   * organization for this email".
   */
  async findBoundAdmin(
    orgId: string,
    userId: string
  ): Promise<OrgMemberRow | null> {
    return prisma.org_members.findFirst({
      where: { org_id: orgId, admin: true, admin_user_id: userId },
    })
  },

  async listAdminOrganizationIds(userId: string): Promise<string[]> {
    const rows = await prisma.org_members.findMany({
      where: { admin: true, admin_user_id: userId },
      select: { org_id: true },
      orderBy: { created_at: "asc" },
    })
    return rows.map((row) => row.org_id)
  },
}
