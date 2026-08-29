/**
 * The single canonical form of an email address for seat and admin lookups.
 *
 * Every seat in a team is `(organization, normalized_email)`, joined to
 * `auth.users` at read time — so this function decides who a company is paying
 * for. It must produce exactly what the database check constraint produces
 * (`lower(btrim(email))`), or a row can be written that the view will never
 * match, and the company pays for a licence nobody receives.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isUsableEmail(email: string): boolean {
  const normalized = normalizeEmail(email)
  if (normalized.length === 0) return false
  // Deliberately permissive: this guards against blanks and obvious paste
  // accidents, not against every RFC-invalid address. The real proof that an
  // address exists is that somebody signs in with it.
  const at = normalized.indexOf("@")
  return at > 0 && at < normalized.length - 1 && !normalized.includes(" ")
}

/**
 * Normalizes a list of typed addresses, dropping blanks and collapsing
 * duplicates that differ only by case or whitespace — the buyer typing
 * `Bob@acme.com` and `bob@acme.com ` is covering one person, and must be
 * charged for one seat.
 */
export function normalizeEmailList(emails: readonly string[]): string[] {
  const seen = new Set<string>()
  for (const email of emails) {
    if (!isUsableEmail(email)) continue
    seen.add(normalizeEmail(email))
  }
  return [...seen]
}
