import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus packs — a whole coaching method, in one gesture."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Packs",
    title: "Choose how Locus coaches you.",
    subtitle:
      "A pack is a whole coaching method, expressed as the behaviours Locus runs. Six ship with the app.",
  })
}
