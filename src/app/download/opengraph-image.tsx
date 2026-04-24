import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus for macOS — coming soon."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Download",
    title: "Coming soon for macOS.",
    subtitle:
      "Requires macOS 14 Sonoma or later. Notify me at launch from the download page.",
  })
}
