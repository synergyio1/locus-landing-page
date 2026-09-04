/**
 * Decides whether a Supabase `auth.users` database-webhook delivery represents
 * a genuinely new user worth announcing in `#locus-newusers`.
 *
 * Why this needs real logic rather than "INSERT means new user":
 *
 *   - `auth.users` receives an UPDATE on essentially every sign-in, because
 *     GoTrue stamps `last_sign_in_at` and `updated_at`. Pinging on UPDATE
 *     unconditionally would announce every returning user forever.
 *   - The website's `signInWithOtp` INSERTS the row the moment somebody types
 *     an email, before the code is entered. Pinging on INSERT unconditionally
 *     would announce people who never finished — and anyone who typed someone
 *     else's address.
 *
 * So the signal is the *edge* where an account becomes confirmed:
 *
 *   INSERT already-confirmed  → ping. The Mac app's native Google sign-in
 *                               (`signInWithIdToken`) and website OAuth both
 *                               land here: the row is born confirmed.
 *   UPDATE unconfirmed→confirmed → ping. The website's email-code path, at the
 *                               moment the code is actually entered.
 *   everything else           → silence.
 *
 * Pure and side-effect free so the matrix above is cheap to test.
 */

/** The envelope Supabase posts for a database webhook. */
export type SupabaseWebhookPayload = {
  type?: string
  table?: string
  schema?: string
  record?: AuthUserRecord | null
  old_record?: AuthUserRecord | null
}

/** Only the `auth.users` columns this module reads. */
export type AuthUserRecord = {
  id?: string | null
  email?: string | null
  email_confirmed_at?: string | null
  phone_confirmed_at?: string | null
  confirmed_at?: string | null
  deleted_at?: string | null
  is_anonymous?: boolean | null
  raw_app_meta_data?: { provider?: string | null } | null
}

export type SignupDecision =
  | {
      ping: true
      user: { id: string | null; email: string | null; provider: string | null }
    }
  | { ping: false; reason: SignupSkipReason }

export type SignupSkipReason =
  | "wrong_table"
  | "delete"
  | "unknown_type"
  | "missing_record"
  | "anonymous"
  | "deleted_user"
  | "unconfirmed"
  | "no_confirmation_transition"

export function decideSignupPing(
  payload: SupabaseWebhookPayload,
): SignupDecision {
  // Defensive: the webhook is configured by hand in the Supabase dashboard, so
  // a mis-scoped trigger pointing at some other table should stay silent
  // rather than announce rows from it.
  if (payload.table && payload.table !== "users") {
    return { ping: false, reason: "wrong_table" }
  }
  if (payload.schema && payload.schema !== "auth") {
    return { ping: false, reason: "wrong_table" }
  }

  const type = payload.type?.toUpperCase()
  if (type === "DELETE") return { ping: false, reason: "delete" }
  if (type !== "INSERT" && type !== "UPDATE") {
    return { ping: false, reason: "unknown_type" }
  }

  const record = payload.record
  if (!record) return { ping: false, reason: "missing_record" }

  // Locus requires a real account (no anonymous mode), but GoTrue can still
  // mint anonymous rows if the feature is ever switched on — never announce one.
  if (record.is_anonymous === true) return { ping: false, reason: "anonymous" }
  if (record.deleted_at) return { ping: false, reason: "deleted_user" }

  if (!isConfirmed(record)) return { ping: false, reason: "unconfirmed" }

  // An INSERT that is already confirmed is the OAuth / native-sign-in path.
  // An UPDATE only counts on the unconfirmed→confirmed edge; a confirmed row
  // being touched again is just a returning user signing in.
  if (type === "UPDATE" && isConfirmed(payload.old_record)) {
    return { ping: false, reason: "no_confirmation_transition" }
  }

  return {
    ping: true,
    user: {
      id: record.id ?? null,
      email: record.email ?? null,
      provider: record.raw_app_meta_data?.provider ?? null,
    },
  }
}

/**
 * Confirmed by any channel. `confirmed_at` is a generated column equal to the
 * earlier of the email and phone timestamps, but it is read last so an
 * explicit per-channel value still decides when the generated one is absent
 * from the webhook payload.
 */
function isConfirmed(record: AuthUserRecord | null | undefined): boolean {
  if (!record) return false
  return Boolean(
    record.email_confirmed_at ??
      record.phone_confirmed_at ??
      record.confirmed_at,
  )
}
