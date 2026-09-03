import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

export type AuthLinkEmailProps = {
  /**
   * Where the button points. In production this is not a URL at all but the Go
   * template Supabase expands per recipient — see `scripts/supabase/auth-templates.tsx`.
   */
  confirmUrl: string
  heading: string
  intro: string
  action: string
  preview: string
  siteUrl?: string
}

const COBALT = "#0047AB"
const INK = "#0B1A33"
const MUTED = "#5C6880"
const BORDER = "#DFE5F0"
const PAPER = "#FFFFFF"
const GROUND = "#F1F4FA"

const FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const MONO =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace"

/**
 * The one email a person sees before they have an account, so it carries the
 * whole first impression of the brand: the site's near-white ground, cobalt, the
 * pill button and the mono eyebrow, all in the inline styles email clients need.
 *
 * Used for both Supabase auth emails that this product can send — the magic link
 * for a returning account and the confirmation for a new one — which differ only
 * in wording, hence the copy props.
 */
export function AuthLinkEmail({
  confirmUrl,
  heading,
  intro,
  action,
  preview,
  siteUrl = "https://getlocus.tech",
}: AuthLinkEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: GROUND,
          fontFamily: FONT,
          margin: 0,
          padding: "0 16px",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <Container
          style={{
            backgroundColor: PAPER,
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            margin: "40px auto",
            maxWidth: "480px",
            padding: "40px",
          }}
        >
          <Section>
            <Img
              src={`${siteUrl}/brand/locus/locus-mark-cobalt-512.png`}
              alt="Locus"
              width="30"
              height="30"
              style={{ display: "block", margin: 0 }}
            />
          </Section>

          <Text
            style={{
              color: COBALT,
              fontFamily: MONO,
              fontSize: "11px",
              letterSpacing: "0.18em",
              margin: "28px 0 0",
              textTransform: "uppercase",
            }}
          >
            Access
          </Text>

          <Heading
            as="h1"
            style={{
              color: INK,
              fontSize: "26px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "10px 0 0",
            }}
          >
            {heading}
          </Heading>

          <Text
            style={{
              color: MUTED,
              fontSize: "15px",
              lineHeight: 1.6,
              margin: "14px 0 0",
            }}
          >
            {intro}
          </Text>

          {/* A table, not the Button helper: Outlook drops padding on a bare
              anchor, and the pill radius has to survive the same markup. */}
          <Section style={{ margin: "28px 0 0" }}>
            <table cellPadding={0} cellSpacing={0} role="presentation">
              <tbody>
                <tr>
                  <td
                    style={{
                      backgroundColor: COBALT,
                      borderRadius: "999px",
                    }}
                  >
                    <Link
                      href={confirmUrl}
                      style={{
                        color: "#FFFFFF",
                        display: "inline-block",
                        fontSize: "15px",
                        fontWeight: 600,
                        padding: "13px 26px",
                        textDecoration: "none",
                      }}
                    >
                      {action}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Text
            style={{
              color: MUTED,
              fontSize: "13px",
              lineHeight: 1.6,
              margin: "24px 0 0",
            }}
          >
            The link works once, and only for a short while. If it stops
            working, ask for a fresh one from the sign-in page.
          </Text>

          <Hr
            style={{
              border: "none",
              borderTop: `1px solid ${BORDER}`,
              margin: "32px 0 0",
            }}
          />

          <Text
            style={{
              color: MUTED,
              fontSize: "13px",
              lineHeight: 1.6,
              margin: "20px 0 0",
            }}
          >
            You received this because someone asked to sign in to Locus with
            this address. If that wasn&rsquo;t you, ignore this email — opening
            it changes nothing on its own.
          </Text>

          <Text
            style={{
              color: MUTED,
              fontFamily: MONO,
              fontSize: "11px",
              letterSpacing: "0.12em",
              margin: "24px 0 0",
              textTransform: "uppercase",
            }}
          >
            <Link href={siteUrl} style={{ color: MUTED, textDecoration: "none" }}>
              getlocus.tech
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default AuthLinkEmail
