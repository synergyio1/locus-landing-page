import { NextResponse } from "next/server"

import { getDb } from "@/lib/db/client"
import { createServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  const sql = getDb()

  try {
    const rows = await sql<Array<{ expires_at: Date | string }>>`
      insert into app.pro_trials (user_id, started_at, expires_at)
      values (${user.id}, now(), now() + interval '7 days')
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

    const expiresAt =
      inserted.expires_at instanceof Date
        ? inserted.expires_at.toISOString()
        : new Date(inserted.expires_at).toISOString()

    return NextResponse.json({ started: true, expiresAt })
  } catch (error) {
    console.error("Failed to start Pro trial", error)
    return NextResponse.json({ error: "trial_failed" }, { status: 500 })
  }
}
