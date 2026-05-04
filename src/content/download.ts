export const MAC_DOWNLOAD_URL = "https://downloads.getlocus.tech/Locus-latest.dmg"

export type DownloadContent = {
  eyebrow: string
  headline: string
  body: string
  requirement: string
  notify: {
    label: string
    href: string
    note: string
  }
}

export const download: DownloadContent = {
  eyebrow: "Download",
  headline: "Coming soon.",
  body:
    "Locus is in final polish before the first public build. The Mac app will ship as a direct download and auto-update through Sparkle.",
  requirement: "Requires macOS 14 Sonoma or later.",
  notify: {
    label: "Notify me at launch",
    href: "mailto:support@getlocus.tech?subject=Notify%20me%20when%20Locus%20ships",
    note: "Drop us a line and we'll email you the day it ships.",
  },
}
