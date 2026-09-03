import { redirect } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { authCopy } from "@/content/auth"
import { buildAppVerifyUrl, isAppCallback } from "@/lib/auth/app-callback"
import { isVerifyType } from "@/lib/auth/email-otp-type"
import { cn } from "@/lib/utils"

import { AuthLayout } from "../../login/auth-layout"

type PageProps = {
  searchParams: Promise<{
    token_hash?: string
    type?: string
    next?: string
  }>
}

/**
 * The landing page for the link in a sign-in email.
 *
 * ⚠️ This page must never verify anything. Mail providers and corporate scanners
 * GET every URL in an incoming message to check it for malware, and a Supabase
 * token hash is single-use — so a link that signs you in merely by being fetched
 * is spent before the recipient opens the mail. That is exactly the
 * `otp_expired` / "Email link is invalid or has expired" failure this route was
 * built to end. Only the click spends the token.
 *
 * One email template serves two products, so there are two buttons. A link asked
 * for on the website posts to `confirm/verify`, which mints a browser session. A
 * link asked for in the macOS app goes to Supabase's own verify endpoint, which
 * hands the session to the app over its custom scheme — the app's session has to
 * be minted against the code verifier in its keychain, and a browser cannot do
 * that. Both are only reached by a real click.
 *
 * `dynamic = "force-dynamic"` keeps the token hash out of any cache: it arrives
 * in the query string and gets echoed into the page.
 */
export const dynamic = "force-dynamic"

export default async function ConfirmPage({ searchParams }: PageProps) {
  const { token_hash: tokenHash, type, next } = await searchParams

  // A link with no credentials in it is either hand-typed or already stripped by
  // something in the middle; there is nothing to confirm, so say so on /login
  // rather than showing a button that cannot work.
  if (!tokenHash || !isVerifyType(type)) {
    redirect("/login?error=missing_token")
  }

  if (isAppCallback(next)) {
    const openInApp = buildAppVerifyUrl(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      tokenHash,
      type,
      next
    )
    return (
      <AuthLayout copy={authCopy.confirmApp}>
        <div className="flex flex-col gap-4">
          <a
            href={openInApp}
            rel="nofollow noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
            )}
          >
            {authCopy.confirmApp.submitLabel}
          </a>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            Didn&rsquo;t start this? Close the tab — nothing happens until you
            confirm.
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout copy={authCopy.confirm}>
      <form
        method="post"
        action="/auth/confirm/verify"
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="token_hash" value={tokenHash} />
        <input type="hidden" name="type" value={type} />
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <button
          type="submit"
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
          )}
        >
          {authCopy.confirm.submitLabel}
        </button>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          Didn&rsquo;t start this? Close the tab — nothing happens until you
          confirm.
        </p>
      </form>
    </AuthLayout>
  )
}
