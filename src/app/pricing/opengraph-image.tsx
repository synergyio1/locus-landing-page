import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus pricing — Free forever. Pro at $6/mo or $58/yr."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Pricing",
    title: "One app. One subscription.",
    subtitle: "Free keeps the loop. Pro is $6 per month or $58 per year.",
  })
}
