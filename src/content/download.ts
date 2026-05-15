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
    "The public Mac download is open. Grab the free DMG, install Locus, and sign in inside the app when you want your account, trial, or Pro features.",
  requirement: "Requires macOS Tahoe for now.",
  support: "Support for older macOS versions will come later.",
  cta: {
    label: "Download free for macOS",
    href: MAC_DOWNLOAD_URL,
    note: "Direct DMG download. No web login required; Locus asks you to sign in after launch.",
  },
}
