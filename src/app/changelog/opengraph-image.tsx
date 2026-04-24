import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus changelog — what's new, version by version."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Changelog",
    title: "What's new in Locus",
    subtitle: "A hand-written log of every release. Newest first.",
  })
}
