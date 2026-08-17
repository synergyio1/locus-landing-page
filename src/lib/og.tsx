import { ImageResponse } from "next/og"

import { LOCUS_MARK_PATH, LOCUS_MARK_VIEWBOX } from "@/lib/locus-mark"

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = "image/png" as const

const BG = "#08152A"
const FG = "#E6EDF3"
const ACCENT_TEXT = "#6BA6F2"
const MUTED = "#8A9BB8"

function LogoMark({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={LOCUS_MARK_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={LOCUS_MARK_PATH} fill={ACCENT_TEXT} />
    </svg>
  )
}

export function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 96,
          background: `radial-gradient(circle at 18% 10%, #102A4D 0%, ${BG} 55%, ${BG} 100%)`,
          color: FG,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <LogoMark size={56} />
          <span
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {eyebrow}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: -3,
              fontWeight: 600,
              color: FG,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 34,
                lineHeight: 1.3,
                color: MUTED,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: MUTED,
            fontSize: 24,
          }}
        >
          <span style={{ color: FG, fontWeight: 500 }}>Locus</span>
          <span>getlocus.tech</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )
}
