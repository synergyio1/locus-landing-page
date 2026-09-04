import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"

import { MAC_DOWNLOAD_URL } from "@/content/download"
import { sendMacLink } from "@/lib/mail/sendMacLink"
import { consumeRateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"

const Body = z.object({
  email: z.string().trim().email().max(254),
})

// This endpoint mails an arbitrary address on an unauthenticated request, so
// it is limited twice: by caller, and by recipient so one inbox cannot be
// bombed from many IPs.
const PER_IP = { limit: 5, windowMs: 60_000 }
const PER_EMAIL = { limit: 3, windowMs: 60 * 60_000 }

function callerKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim()
  return ip && ip.length > 0 ? ip : "unknown"
}

export async function POST(request: NextRequest) {
  if (!consumeRateLimit(`mac-link:ip:${callerKey(request)}`, PER_IP)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  const json = await request.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 })
  }

  const email = parsed.data.email.toLowerCase()

  if (!consumeRateLimit(`mac-link:email:${email}`, PER_EMAIL)) {
    // Deliberately reported as success: telling a caller that this address has
    // already been mailed would turn the endpoint into a "who signed up" oracle.
    return NextResponse.json({ ok: true })
  }

  try {
    await sendMacLink(email, { downloadUrl: MAC_DOWNLOAD_URL })
  } catch (error) {
    console.error("[mac-link] failed to send download link", error)
    return NextResponse.json({ error: "send_failed" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
