import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus terms of service."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "Terms",
    title: "Terms of service.",
    subtitle:
      "The terms that govern your use of the Locus app, the website, and Pro subscriptions.",
  })
}
