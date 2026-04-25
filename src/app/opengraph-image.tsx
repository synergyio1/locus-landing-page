import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus — finish the things you keep starting"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "AI-native execution OS — for macOS",
    title: "Finish the things you keep starting.",
    subtitle:
      "An AI plans your day, catches you when you drift, and on Friday walks you through what actually moved.",
  })
}
