import { NextResponse, type NextRequest } from "next/server"

import { createServerClient } from "@/lib/supabase/server"

function resolveNext(
  nextParam: string | null,
  requestUrl: string
): URL {
  const fallback = new URL("/account", requestUrl)
  if (!nextParam) return fallback

  try {
    const candidate = new URL(nextParam, requestUrl)
    if (candidate.origin !== new URL(requestUrl).origin) return fallback
    return candidate
  } catch {
    return fallback
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get("code")
  const nextParam = searchParams.get("next")

  if (!code) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("error", "missing_code")
    return NextResponse.redirect(loginUrl, 302)
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("error", "exchange_failed")
    return NextResponse.redirect(loginUrl, 302)
  }

  return NextResponse.redirect(resolveNext(nextParam, request.url), 302)
}
