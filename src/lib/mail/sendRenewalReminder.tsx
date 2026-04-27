import "server-only"

import { render } from "@react-email/render"

import {
  RenewalReminderEmail,
  type RenewalReminderPlan,
} from "@/emails/RenewalReminderEmail"

import { getMailClient, getMailFrom } from "./client"

export type RenewalReminderRecipient = {
  email: string
}

export type SendRenewalReminderOptions = {
  renewalDate: string
  plan: RenewalReminderPlan
}

export async function sendRenewalReminder(
  user: RenewalReminderRecipient,
  options: SendRenewalReminderOptions
): Promise<void> {
  const html = await render(
    <RenewalReminderEmail
      email={user.email}
      renewalDate={options.renewalDate}
      plan={options.plan}
    />
  )

  await getMailClient().emails.send({
    from: getMailFrom(),
    to: user.email,
    subject: "Your Locus Pro plan renews soon",
    html,
  })
}
