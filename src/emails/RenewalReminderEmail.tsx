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

export type RenewalReminderPlan = "monthly" | "yearly"

export type RenewalReminderEmailProps = {
  email: string
  renewalDate: string
  plan: RenewalReminderPlan
}

function formatRenewalDate(renewalDate: string): string {
  const date = new Date(renewalDate)
  if (Number.isNaN(date.getTime())) return renewalDate
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

function planLabel(plan: RenewalReminderPlan): string {
  return plan === "yearly" ? "yearly" : "monthly"
}

export function RenewalReminderEmail({
  email,
  renewalDate,
  plan,
}: RenewalReminderEmailProps) {
  const formatted = formatRenewalDate(renewalDate)
  return (
    <Html>
      <Head />
      <Preview>Your Locus Pro {planLabel(plan)} plan renews on {formatted}.</Preview>
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
            Your Locus Pro plan renews soon
          </Heading>
          <Text style={{ color: "#1a1a1a", fontSize: "16px", lineHeight: 1.5 }}>
            Heads up — your <strong>{planLabel(plan)}</strong> Locus Pro
            subscription for <strong>{email}</strong> renews on{" "}
            <strong>{formatted}</strong>.
          </Text>
          <Text style={{ color: "#1a1a1a", fontSize: "16px", lineHeight: 1.5 }}>
            If you&rsquo;d like to keep going, no action needed. If you want to
            switch plans or cancel, you can do that from your account.
          </Text>
          <Text style={{ color: "#5a5a5a", fontSize: "14px", lineHeight: 1.5 }}>
            <Link href="https://getlocus.tech/account">
              Manage your subscription
            </Link>{" "}
            on getlocus.tech.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default RenewalReminderEmail
