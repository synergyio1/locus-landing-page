import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus — finish the things you keep starting"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "macOS",
    title: "Finish the things you keep starting.",
    subtitle:
      "An AI planner, an on-device monitor, and a Friday review — for the goals that keep getting pushed.",
  })
}
