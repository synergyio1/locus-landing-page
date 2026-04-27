import "server-only"

import postgres, { type Sql } from "postgres"

let cached: Sql | null = null

export function getDb(): Sql {
  if (cached) return cached

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  cached = postgres(connectionString, {
    max: 4,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  })

  return cached
}
