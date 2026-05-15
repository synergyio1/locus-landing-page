import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus — the missing OS for modern work"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "AI-native execution OS — for macOS",
    title: "The missing OS for modern work.",
    subtitle:
      "Declare intent, see what happened, and turn each day into a better tomorrow.",
  })
}
