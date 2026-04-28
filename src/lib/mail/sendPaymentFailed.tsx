import "server-only"

import { render } from "@react-email/render"

import { PaymentFailedEmail } from "@/emails/PaymentFailedEmail"

import { getMailClient, getMailFrom } from "./client"

export type PaymentFailedRecipient = {
  email: string
}

export type SendPaymentFailedOptions = {
  updatePaymentUrl: string
}

export async function sendPaymentFailed(
  user: PaymentFailedRecipient,
  options: SendPaymentFailedOptions
): Promise<void> {
  const html = await render(
    <PaymentFailedEmail
      email={user.email}
      updatePaymentUrl={options.updatePaymentUrl}
    />
  )

  await getMailClient().emails.send({
    from: getMailFrom(),
    to: user.email,
    subject: "Your Locus Pro payment failed — update your card",
    html,
  })
}
