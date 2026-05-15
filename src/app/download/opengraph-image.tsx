import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus for macOS — free download."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Download",
    title: "Download Locus for macOS.",
    subtitle:
      "The public DMG is open and free. Requires macOS Tahoe for now.",
  })
}
