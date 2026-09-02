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
}

export const download: DownloadContent = {
  eyebrow: "Download",
  headline: "Download Locus for macOS.",
  body:
    "The Mac download is open. Install Locus, sign in, and your 7-day trial starts inside the app — every feature included, no card required.",
  requirement: "Requires macOS Tahoe for now.",
  support: "Support for older macOS versions will come later.",
  cta: {
    label: "Download for macOS",
    href: MAC_DOWNLOAD_URL,
    note: "Direct DMG download. No web login required; Locus asks you to sign in after launch.",
  },
}
