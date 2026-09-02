import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus for macOS — download."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Download",
    title: "Download Locus for macOS.",
    subtitle:
      "Install, sign in, and your 7-day trial starts in the app. Requires macOS Tahoe.",
  })
}
