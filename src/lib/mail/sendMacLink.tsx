import "server-only"

import { render } from "@react-email/render"

import { MacLinkEmail } from "@/emails/MacLinkEmail"

import { getMailClient, getMailFrom } from "./client"

export type SendMacLinkOptions = {
  downloadUrl: string
}

export async function sendMacLink(
  email: string,
  options: SendMacLinkOptions
): Promise<void> {
  const html = await render(<MacLinkEmail downloadUrl={options.downloadUrl} />)

  await getMailClient().emails.send({
    from: getMailFrom(),
    to: email,
    subject: "Your Locus download link",
    html,
  })
}
