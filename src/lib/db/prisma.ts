import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"

declare global {
  var __prisma: PrismaClient | undefined
}

function build(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClient =
  globalThis.__prisma ?? (globalThis.__prisma = build())
