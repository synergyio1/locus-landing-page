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

export type PaymentFailedEmailProps = {
  email: string
  updatePaymentUrl: string
}

export function PaymentFailedEmail({
  email,
  updatePaymentUrl,
}: PaymentFailedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your card was declined — update it to keep Locus Pro.</Preview>
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
            Your card was declined
          </Heading>
          <Text style={{ color: "#1a1a1a", fontSize: "16px", lineHeight: 1.5 }}>
            We tried to renew Locus Pro for <strong>{email}</strong> and the
            charge didn&rsquo;t go through. Update your card to keep your Pro
            access from lapsing.
          </Text>
          <Section style={{ margin: "32px 0" }}>
            <Button
              href={updatePaymentUrl}
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
              Update payment method
            </Button>
          </Section>
          <Text style={{ color: "#5a5a5a", fontSize: "14px", lineHeight: 1.5 }}>
            We&rsquo;ll keep retrying for a few days. Need help?{" "}
            <Link href="mailto:hi@getlocus.tech">hi@getlocus.tech</Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PaymentFailedEmail
