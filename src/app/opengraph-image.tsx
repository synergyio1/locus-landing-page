import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus — a macOS focus system"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "macOS focus system",
    title: "Know where your hours actually went.",
    subtitle:
      "Sessions, projects, and habits — on-device. Free forever for the core loop.",
  })
}
