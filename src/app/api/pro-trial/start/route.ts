import { NextResponse } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { createServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000

export async function POST() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  try {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + TRIAL_DURATION_MS)

    const rows = await prisma.$queryRaw<Array<{ expires_at: Date }>>`
      insert into app.pro_trials (user_id, started_at, expires_at)
      values (${user.id}::uuid, ${now}, ${expiresAt})
      on conflict (user_id) do nothing
      returning expires_at
    `

    const inserted = rows[0]
    if (!inserted) {
      return NextResponse.json({
        started: false,
        reason: "already-used",
      })
    }

    const returnedExpiresAt =
      inserted.expires_at instanceof Date
        ? inserted.expires_at.toISOString()
        : new Date(inserted.expires_at).toISOString()

    return NextResponse.json({ started: true, expiresAt: returnedExpiresAt })
  } catch (error) {
    console.error("Failed to start Pro trial", error)
    return NextResponse.json({ error: "trial_failed" }, { status: 500 })
  }
}
