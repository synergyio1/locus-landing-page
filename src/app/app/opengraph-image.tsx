import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "Locus, on screen — a walk through the app."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "The app",
    title: "Locus, on screen.",
    subtitle:
      "Six tabs and a chat in the title bar — all of it on your Mac.",
  })
}
