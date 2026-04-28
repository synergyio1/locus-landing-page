import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

export type WelcomeEmailProps = {
  name?: string | null
  email: string
  downloadUrl: string
}

export function WelcomeEmail({ name, email, downloadUrl }: WelcomeEmailProps) {
  const greeting = name ? `Hey ${name},` : "Hey,"
  return (
    <Html>
      <Head />
      <Preview>You&rsquo;re in. Download Locus and finish what you keep starting.</Preview>
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
          <Heading style={{ color: "#0047AB", fontSize: "28px", margin: 0 }}>
            You&rsquo;re in.
          </Heading>
          <Text style={{ color: "#1a1a1a", fontSize: "16px", lineHeight: 1.5 }}>
            {greeting}
          </Text>
          <Text style={{ color: "#1a1a1a", fontSize: "16px", lineHeight: 1.5 }}>
            Welcome to Locus Pro. Sign in on your Mac with{" "}
            <strong>{email}</strong> to unlock the full app.
          </Text>
          <Section style={{ margin: "32px 0" }}>
            <Button
              href={downloadUrl}
              style={{
                backgroundColor: "#0047AB",
                borderRadius: "6px",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 600,
                padding: "12px 20px",
                textDecoration: "none",
              }}
            >
              Download Locus
            </Button>
          </Section>
          <Text style={{ color: "#5a5a5a", fontSize: "14px", lineHeight: 1.5 }}>
            Already installed? Open Locus and choose &ldquo;Sign in&rdquo; from
            the menu. Need help?{" "}
            <Link href="mailto:hi@getlocus.tech">hi@getlocus.tech</Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
