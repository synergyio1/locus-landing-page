import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus privacy policy — data stays on your Mac."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Privacy",
    title: "Your focus data stays local.",
    subtitle:
      "What Locus collects, how it's used, and the rights you have over it.",
  })
}
