import "server-only"

import { render } from "@react-email/render"

import { CancellationEmail } from "@/emails/CancellationEmail"

import { getMailClient, getMailFrom } from "./client"

export type CancellationRecipient = {
  email: string
}

export type SendCancellationOptions = {
  accessUntil: string
}

export async function sendCancellation(
  user: CancellationRecipient,
  options: SendCancellationOptions
): Promise<void> {
  const html = await render(
    <CancellationEmail
      email={user.email}
      accessUntil={options.accessUntil}
    />
  )

  await getMailClient().emails.send({
    from: getMailFrom(),
    to: user.email,
    subject: "Your Locus Pro subscription has been canceled",
    html,
  })
}
