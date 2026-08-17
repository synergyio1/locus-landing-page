import Image from "next/image"

import { DeviceFrame } from "@/components/ui/device-frame"
import { cn } from "@/lib/utils"
import type { FlywheelPoster } from "@/content/flywheel"

type ClipSurfaceProps = {
  /** Short screen name shown in the clip chip, e.g. "Focus session". */
  label: string
  alt: string
  /** Screenshot poster standing in until the recording lands; null renders the empty slot. */
  poster: FlywheelPoster | null
  sizes?: string
  className?: string
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className={cn("shrink-0", className)}
      fill="currentColor"
    >
      <path d="M3.2 2.2v7.6L9.8 6z" />
    </svg>
  )
}

/**
 * The inside of a clip placeholder — poster (or empty slot) plus the quiet
 * play chip that marks where a product recording will land. Swapping a slot
 * to real video means replacing the Image/empty block with a <video poster>;
 * the chip and frame stay.
 */
export function ClipSurface({
  label,
  alt,
  poster,
  sizes,
  className,
}: ClipSurfaceProps) {
  return (
    <div
      data-slot="clip-surface"
      className={cn(
        "relative h-full w-full overflow-hidden bg-[color-mix(in_oklab,var(--fg)_3%,var(--bg))]",
        className
      )}
    >
      {poster ? (
        <>
          <Image
            src={poster.src}
            alt={alt}
            width={poster.width}
            height={poster.height}
            sizes={sizes ?? "(max-width: 768px) 100vw, 60vw"}
            className="h-full w-full object-cover"
          />
          <span className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(6,13,19,0.72)] px-3 py-1.5 backdrop-blur-md">
            <PlayGlyph className="h-2.5 w-2.5 text-[var(--accent-text)]" />
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[var(--fg)]">
              {label}
            </span>
          </span>
        </>
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full flex-col items-center justify-center gap-4"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] text-[var(--muted-foreground)]">
            <PlayGlyph className="ml-0.5 h-3.5 w-3.5" />
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            {label} · clip coming soon
          </span>
        </div>
      )}
    </div>
  )
}

type ClipFrameProps = ClipSurfaceProps

/** A standalone clip placeholder in the standard app-screenshot frame. */
export function ClipFrame({ className, ...surface }: ClipFrameProps) {
  return (
    <DeviceFrame className={cn("aspect-[16/10] bg-[var(--surface)]", className)}>
      <ClipSurface {...surface} />
    </DeviceFrame>
  )
}
