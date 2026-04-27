import { NextResponse, type NextRequest } from "next/server"

import { getDb } from "@/lib/db/client"
import { sendRenewalReminder } from "@/lib/mail/sendRenewalReminder"
import type { RenewalReminderPlan } from "@/emails/RenewalReminderEmail"

export const runtime = "nodejs"

type ReminderRow = {
  id: string
  email: string
  current_period_end: string
  price_id: string | null
}

function planFor(priceId: string | null): RenewalReminderPlan {
  if (priceId && priceId === process.env.STRIPE_PRICE_YEARLY) return "yearly"
  return "monthly"
}

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  return handle(request)
}

async function handle(request: NextRequest) {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    console.error("[cron-renewal-reminders] CRON_SECRET is not configured")
    return NextResponse.json({ error: "not_configured" }, { status: 500 })
  }

  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const sql = getDb()
  const rows = await sql<ReminderRow[]>`
    select s.id, u.email, s.current_period_end, s.price_id
    from app.subscriptions s
    join auth.users u on u.id = s.user_id
    where s.current_period_end between now() + interval '6 days'
      and now() + interval '8 days'
      and s.renewal_reminder_sent = false
  `

  let sent = 0
  for (const row of rows) {
    if (!row.email) {
      console.warn(
        `[cron-renewal-reminders] subscription ${row.id} has no recipient email; skipping`
      )
      continue
    }
    try {
      await sendRenewalReminder(
        { email: row.email },
        {
          renewalDate: new Date(row.current_period_end).toISOString(),
          plan: planFor(row.price_id),
        }
      )
    } catch (error) {
      console.error(
        `[cron-renewal-reminders] failed to send reminder for subscription ${row.id}`,
        error
      )
      continue
    }
    await sql`
      update app.subscriptions
      set renewal_reminder_sent = true
      where id = ${row.id}
    `
    sent += 1
  }

  return NextResponse.json({ sent })
}
