import "server-only"

import { render } from "@react-email/render"

import { WelcomeEmail } from "@/emails/WelcomeEmail"

import { getMailClient, getMailFrom } from "./client"

export type WelcomeRecipient = {
  email: string
  name?: string | null
}

export type SendWelcomeOptions = {
  downloadUrl: string
}

export async function sendWelcome(
  user: WelcomeRecipient,
  options: SendWelcomeOptions
): Promise<void> {
  const html = await render(
    <WelcomeEmail
      name={user.name ?? null}
      email={user.email}
      downloadUrl={options.downloadUrl}
    />
  )

  await getMailClient().emails.send({
    from: getMailFrom(),
    to: user.email,
    subject: "Welcome to Locus Pro",
    html,
  })
}
