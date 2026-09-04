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

export type MacLinkEmailProps = {
  downloadUrl: string
}

export function MacLinkEmail({ downloadUrl }: MacLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Locus download link — open this one on your Mac.</Preview>
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
            Open this on your Mac.
          </Heading>
          <Text style={{ color: "#1a1a1a", fontSize: "16px", lineHeight: 1.5 }}>
            You asked for the Locus download link from your phone. Here it is —
            it needs a Mac running macOS Tahoe.
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
          <Text style={{ color: "#1a1a1a", fontSize: "16px", lineHeight: 1.5 }}>
            Install it, sign in, and your 7-day trial starts inside the app.
            Every feature included, no card required.
          </Text>
          <Text style={{ color: "#5a5a5a", fontSize: "14px", lineHeight: 1.5 }}>
            Didn&rsquo;t ask for this? Ignore it and nothing happens. Questions:{" "}
            <Link href="mailto:hi@getlocus.tech">hi@getlocus.tech</Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default MacLinkEmail
