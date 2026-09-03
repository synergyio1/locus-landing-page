import { DEFAULT_NEXT, sanitizeNext } from "./sanitize-next"

/**
 * Where to land after a token hash from an email verifies.
 *
 * Supabase interpolates `{{ .RedirectTo }}` into the email template, and that is
 * the *whole* `emailRedirectTo` URL we asked for — `https://getlocus.tech/auth/
 * confirm?next=%2Fbilling`, not `/billing`. Supabase can also drop it entirely
 * (an `emailRedirectTo` outside the project's redirect allow list is silently
 * replaced by the Site URL), so every shape has to degrade to something sane.
 *
 * Three cases, in order:
 *   1. a same-site path        → used as-is
 *   2. a same-origin URL       → its path, unwrapping a nested `next` when it
 *                                points back at an auth route (that path would
 *                                otherwise bounce the user through sign-in again)
 *   3. anything else           → the account page
 */
const AUTH_ROUTES = new Set(["/auth/confirm", "/auth/callback", "/login", "/signup"])

export function resolveEmailNext(
  raw: string | null | undefined,
  requestUrl: string
): string {
  if (!raw) return DEFAULT_NEXT
  if (raw.startsWith("/")) return sanitizeNext(raw)

  let candidate: URL
  let origin: string
  try {
    candidate = new URL(raw)
    origin = new URL(requestUrl).origin
  } catch {
    return DEFAULT_NEXT
  }

  if (candidate.origin !== origin) return DEFAULT_NEXT

  if (AUTH_ROUTES.has(candidate.pathname)) {
    return sanitizeNext(candidate.searchParams.get("next"))
  }

  return sanitizeNext(`${candidate.pathname}${candidate.search}${candidate.hash}`)
}
