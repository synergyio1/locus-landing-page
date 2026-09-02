import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"

export const alt = "From your decade down to today — a walk through the app."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "The app",
    title: "From your decade down to today.",
    subtitle:
      "Six tabs and a chat in the title bar — all of it on your Mac.",
  })
}
