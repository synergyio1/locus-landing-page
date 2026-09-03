/**
 * Renders Locus's branded sign-in emails and, with --push, installs them as the
 * Supabase project's auth email templates.
 *
 *   npx tsx scripts/supabase/auth-templates.tsx            # render + write to disk
 *   npx tsx scripts/supabase/auth-templates.tsx --push     # also PATCH the project
 *   npx tsx scripts/supabase/auth-templates.tsx --smtp     # point auth email at Resend
 *
 * Needs SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens) for
 * --push. SUPABASE_PROJECT_REF selects the project.
 *
 * ⚠️ Do not reach for `supabase config push` to do this instead. That command
 * ships the *whole* [auth] block from locus-api/supabase/config.toml, whose
 * site_url is http://127.0.0.1:3000 — it would point production's sign-in emails
 * at localhost. This script touches four template fields and nothing else.
 *
 * The hrefs below are Go templates, not URLs: Supabase expands {{ .SiteURL }},
 * {{ .TokenHash }} and {{ .RedirectTo }} per recipient. They deliberately point at
 * /auth/confirm rather than Supabase's own /auth/v1/verify, because that endpoint
 * signs a person in on a plain GET and inbox scanners fetch links before the
 * recipient does — which spends the single-use token and produces the
 * "Email link is invalid or has expired" failure. /auth/confirm only verifies on
 * a POST.
 */
import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

import { render } from "@react-email/render"

import { AuthLinkEmail } from "../../src/emails/AuthLinkEmail"

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF ?? "iqmdqompkvjoukvfrfvo"
const SITE_URL = process.env.SITE_URL ?? "https://www.getlocus.tech"

/**
 * ⚠️ Not {{ .SiteURL }}. This project's Site URL is `com.locus.app://auth/callback`
 * — the macOS app's deep link, which the app needs as its fallback — so expanding
 * it here would produce a link no browser can open. The website's origin is
 * written in literally.
 *
 * `{{ .RedirectTo }}` is the `emailRedirectTo` that asked for the link, so it says
 * which product is waiting: the website's own URL for a web sign-in, the app's
 * scheme for one started in the app. /auth/confirm reads it and offers the right
 * button.
 */
function confirmLink(type: string): string {
  return `${SITE_URL}/auth/confirm?token_hash={{ .TokenHash }}&type=${type}&next={{ .RedirectTo }}`
}

type Template = {
  /** Management API field carrying the subject line. */
  subjectField: string
  /** Management API field carrying the HTML body. */
  contentField: string
  subject: string
  /** The flow's own name, which Supabase's verify endpoint needs for app links. */
  type: string
  heading: string
  intro: string
  action: string
  preview: string
  file: string
}

const TEMPLATES: Template[] = [
  {
    subjectField: "mailer_subjects_magic_link",
    contentField: "mailer_templates_magic_link_content",
    subject: "Your Locus sign-in link",
    type: "magiclink",
    heading: "Sign in to Locus.",
    intro:
      "One click and you're back where you left off. No password to remember.",
    action: "Sign in to Locus",
    preview: "Your one-time link to sign in to Locus.",
    file: "magic-link.html",
  },
  {
    // signInWithOtp on an address Supabase has never seen sends the confirmation
    // template, not the magic link — a first-time visitor gets this one.
    subjectField: "mailer_subjects_confirmation",
    contentField: "mailer_templates_confirmation_content",
    subject: "Confirm your email for Locus",
    type: "signup",
    heading: "Confirm your address.",
    intro:
      "One click confirms this address and opens your Locus account. No password to set.",
    action: "Confirm and continue",
    preview: "Confirm your email address and open your Locus account.",
    file: "confirmation.html",
  },
]

async function build(): Promise<Record<string, string>> {
  const payload: Record<string, string> = {}

  const outDir = path.join(process.cwd(), "out", "auth-emails")
  await mkdir(outDir, { recursive: true })

  for (const template of TEMPLATES) {
    const html = await render(
      <AuthLinkEmail
        confirmUrl={confirmLink(template.type)}
        heading={template.heading}
        intro={template.intro}
        action={template.action}
        preview={template.preview}
        siteUrl={SITE_URL}
      />,
      { pretty: true }
    )

    // A template that lost its placeholders would send everyone a dead link.
    for (const token of [".TokenHash", ".RedirectTo"]) {
      if (!html.includes(token)) {
        throw new Error(`${template.file}: {{ ${token} }} did not survive rendering`)
      }
    }

    payload[template.subjectField] = template.subject
    payload[template.contentField] = html

    await writeFile(path.join(outDir, template.file), html, "utf8")
    console.log(`rendered ${path.relative(process.cwd(), path.join(outDir, template.file))}`)
  }

  return payload
}

async function patchAuthConfig(
  payload: Record<string, string | number | boolean>
): Promise<void> {
  const token = process.env.SUPABASE_ACCESS_TOKEN
  if (!token) {
    throw new Error(
      "SUPABASE_ACCESS_TOKEN is not set — create one at https://supabase.com/dashboard/account/tokens"
    )
  }

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error(
      `PATCH config/auth failed: ${response.status} ${await response.text()}`
    )
  }

  console.log(`pushed ${Object.keys(payload).length} fields to ${PROJECT_REF}`)
}

/**
 * Hands Supabase's auth email to Resend.
 *
 * Supabase's built-in mailer is a testing convenience: it sends from
 * `noreply@mail.app.supabase.io` and allows a couple of messages an hour across
 * the whole project, so on a live site most people asking to sign in simply never
 * receive anything. Custom SMTP replaces both the sender and the ceiling.
 *
 * Resend's SMTP username is the literal string `resend`; the password is an API
 * key, and a send-only restricted key is the right one to use here. The from
 * address has to be on a domain verified in Resend.
 */
async function configureSmtp(): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY is not set")

  const from = process.env.RESEND_FROM ?? "Locus <luis@getlocus.tech>"
  const address = from.includes("<") ? from.split("<")[1].replace(">", "") : from
  const perHour = Number(process.env.AUTH_EMAILS_PER_HOUR ?? 100)

  console.log("sender      :", from)
  console.log("smtp        : smtp.resend.com:587 as 'resend'")
  console.log("rate limit  :", perHour, "auth emails/hour")

  await patchAuthConfig({
    external_email_enabled: true,
    smtp_host: "smtp.resend.com",
    smtp_port: 587,
    smtp_user: "resend",
    smtp_pass: apiKey,
    smtp_admin_email: address.trim(),
    smtp_sender_name: "Locus",
    // The built-in mailer's ceiling is a handful an hour; it only lifts once the
    // project is sending through its own SMTP.
    rate_limit_email_sent: perHour,
  })
}

async function main(): Promise<void> {
  if (process.argv.includes("--smtp")) {
    await configureSmtp()
    return
  }

  const payload = await build()

  if (process.argv.includes("--push")) {
    await patchAuthConfig(payload)
  } else {
    console.log("\nrender only. re-run with --push to install on", PROJECT_REF)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
