import { ImageResponse } from "next/og"

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = "image/png" as const

const BG = "#0A1620"
const FG = "#E6EDF3"
const ACCENT_TEXT = "#6BA6F2"
const MUTED = "#8A9BAE"

function LogoMark({ size = 56 }: { size?: number }) {
  const vb = 1024
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${vb} ${vb}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="512"
        cy="512"
        r="401"
        stroke={ACCENT_TEXT}
        strokeWidth="34"
        fill="none"
        opacity="0.22"
      />
      <circle
        cx="512"
        cy="512"
        r="290"
        stroke={ACCENT_TEXT}
        strokeWidth="60"
        fill="none"
        opacity="0.55"
      />
      <circle
        cx="512"
        cy="512"
        r="170"
        stroke={ACCENT_TEXT}
        strokeWidth="85"
        fill="none"
      />
      <circle cx="512" cy="512" r="60" fill={ACCENT_TEXT} />
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
