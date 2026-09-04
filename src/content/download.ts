export const MAC_DOWNLOAD_URL = "https://downloads.getlocus.tech/Locus-latest.dmg"

export type DownloadContent = {
  eyebrow: string
  headline: string
  body: string
  requirement: string
  support: string
  cta: {
    label: string
    href: string
    note: string
  }
  /**
   * What a non-Mac visitor sees instead of the DMG button. Most paid social
   * traffic arrives on a phone, where the download is unusable — so the ask
   * becomes an email that carries the link to the Mac they already own.
   */
  otherPlatform: {
    headline: string
    body: string
    label: string
    placeholder: string
    cta: string
    pending: string
    note: string
    success: {
      headline: string
      body: string
    }
    errors: {
      invalid: string
      failed: string
    }
  }
}

export const download: DownloadContent = {
  eyebrow: "Download",
  headline: "Download Locus for macOS.",
  body:
    "The Mac download is open. Install Locus, sign in, and your 7-day trial starts inside the app — every feature included, no card required.",
  requirement: "Requires macOS Tahoe for now.",
  support: "Support for older macOS versions will come later.",
  cta: {
    label: "Download the app",
    href: MAC_DOWNLOAD_URL,
    note: "Direct DMG download. No web login required; Locus asks you to sign in after launch.",
  },
  otherPlatform: {
    headline: "Locus is a Mac app.",
    body:
      "You're not on a Mac right now, so the download won't run here. Leave your email and we'll send the link — open it when you're back at your desk.",
    label: "Email address",
    placeholder: "you@example.com",
    cta: "Send me the link",
    pending: "Sending…",
    note: "One email with the download link. Nothing else, and no card required.",
    success: {
      headline: "Sent. Check your inbox.",
      body:
        "The download link is on its way. Open it on your Mac — it needs macOS Tahoe.",
    },
    errors: {
      invalid: "That email doesn't look right. Check it and try again.",
      failed: "We couldn't send it just now. Please try again in a moment.",
    },
  },
}
