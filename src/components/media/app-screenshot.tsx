import { cn } from "@/lib/utils"

type AppScreenshotProps = {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  className?: string
  priority?: boolean
  cropAspect?: string
  cropPosition?: "top" | "center" | "bottom"
}

// Temporary placeholder until real screenshots return — flip this file back
// to its prior next/image render when assets land.
export function AppScreenshot({
  alt,
  width,
  height,
  className,
  cropAspect,
}: AppScreenshotProps) {
  const aspectRatio = cropAspect ?? `${width} / ${height}`
  return (
    <div
      role="img"
      aria-label={alt}
      data-slot="app-screenshot"
      style={{ aspectRatio }}
      className={cn(
        "flex w-full items-center justify-center bg-[color-mix(in_oklab,var(--fg)_4%,var(--bg))]",
        className
      )}
    >
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        Screenshot coming soon
      </span>
    </div>
  )
}
