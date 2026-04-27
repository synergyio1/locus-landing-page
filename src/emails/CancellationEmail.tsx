import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components"

export type CancellationEmailProps = {
  email: string
  accessUntil: string
}

function formatAccessUntil(accessUntil: string): string {
  const date = new Date(accessUntil)
  if (Number.isNaN(date.getTime())) return accessUntil
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function CancellationEmail({
  email,
  accessUntil,
}: CancellationEmailProps) {
  const formatted = formatAccessUntil(accessUntil)
  return (
    <Html>
      <Head />
      <Preview>Your Locus Pro subscription has been canceled.</Preview>
      <Body
        style={{
          backgroundColor: "#f7f7f5",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            maxWidth: "560px",
            padding: "40px",
          }}
        >
          <Heading style={{ color: "#1a1a1a", fontSize: "26px", margin: 0 }}>
            Subscription canceled
          </Heading>
          <Text style={{ color: "#1a1a1a", fontSize: "16px", lineHeight: 1.5 }}>
            We&rsquo;ve canceled the Locus Pro subscription for{" "}
            <strong>{email}</strong>.
          </Text>
          <Text style={{ color: "#1a1a1a", fontSize: "16px", lineHeight: 1.5 }}>
            You&rsquo;ll keep Pro access until <strong>{formatted}</strong>.
            After that, your account moves back to the Free tier — your data
            stays put.
          </Text>
          <Text style={{ color: "#5a5a5a", fontSize: "14px", lineHeight: 1.5 }}>
            Changed your mind?{" "}
            <Link href="https://getlocus.tech/account">
              Reactivate from your account
            </Link>{" "}
            anytime.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default CancellationEmail
