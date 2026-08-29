import "server-only"

import type { organizationsModel } from "@/generated/prisma/models"

import { normalizeEmail } from "../org/normalizeEmail"

import { prisma } from "./prisma"

export type OrganizationRow = organizationsModel

export type CreateOrganizationInput = {
  name: string
  /** Belongs to the organization, not its creator — invoices outlive people. */
  billingEmail: string
}

export const OrganizationsRepo = {
  async create(input: CreateOrganizationInput): Promise<OrganizationRow> {
    return prisma.organizations.create({
      data: {
        name: input.name.trim(),
        billing_email: normalizeEmail(input.billingEmail),
      },
    })
  },

  async findById(orgId: string): Promise<OrganizationRow | null> {
    return prisma.organizations.findUnique({ where: { id: orgId } })
  },

  async rename(orgId: string, name: string): Promise<void> {
    await prisma.organizations.update({
      where: { id: orgId },
      data: { name: name.trim(), updated_at: new Date() },
    })
  },

  async setBillingEmail(orgId: string, billingEmail: string): Promise<void> {
    await prisma.organizations.update({
      where: { id: orgId },
      data: {
        billing_email: normalizeEmail(billingEmail),
        updated_at: new Date(),
      },
    })
  },
}
