/**
 * `next` is where sign-in lands afterwards. It travels through query strings,
 * hidden form fields and (as Supabase's `redirect_to`) an email, so it is
 * untrusted at every hop: only a same-site path survives. An absolute URL, a
 * protocol-relative `//evil`, its backslash twin `/\evil` (which the URL parser
 * also reads as a host), whitespace, or nothing at all — all fall back to the
 * account page.
 */
export const DEFAULT_NEXT = "/account"

const SAME_SITE_PATH = /^\/(?![/\\])\S*$/

export function sanitizeNext(next: string | null | undefined): string {
  if (!next || !SAME_SITE_PATH.test(next)) return DEFAULT_NEXT
  return next
}
