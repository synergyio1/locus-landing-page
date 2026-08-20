import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt =
  "Locus architecture decisions — what was on the table, what we chose, and what it costs."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Architecture",
    title: "Architecture decisions",
    subtitle:
      "The six calls that shaped Locus — and what each one costs you.",
  })
}
