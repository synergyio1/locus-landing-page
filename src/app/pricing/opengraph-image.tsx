import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt =
  "Locus pricing — one plan, everything included. $4/mo billed yearly or $6/mo."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Pricing",
    title: "One plan. All of Locus.",
    subtitle: "$4 a month billed yearly, or $6 monthly. 14 days free.",
  })
}
