import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt =
  "Locus pricing — one plan, everything included. $3/mo, or $30/yr."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Pricing",
    title: "One plan. All of Locus.",
    subtitle: "$3 a month, or $30 a year. 30 days free, no card.",
  })
}
