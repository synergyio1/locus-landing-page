import Image, { type ImageProps } from "next/image"

import { cn } from "@/lib/utils"

type AppScreenshotProps = Omit<ImageProps, "src" | "alt"> & {
  src: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
  /**
   * Constrain the outer container to a specific aspect ratio and crop the
   * image via `object-cover` + `object-position`. Useful for source PNGs that
   * contain large empty regions (e.g. a sparse task list or a card with heavy
   * outer padding).
   */
  cropAspect?: string
  cropPosition?: "top" | "center" | "bottom"
}

export function AppScreenshot({
  src,
  alt,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1400px) 60vw, 840px",
  priority,
  className,
  cropAspect,
  cropPosition = "top",
  ...props
}: AppScreenshotProps) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      quality={90}
      loading={priority ? undefined : "lazy"}
      data-slot="app-screenshot"
      className={cn(
        cropAspect
          ? "absolute inset-0 h-full w-full object-cover select-none"
          : "h-auto w-full select-none",
        cropPosition === "top" && cropAspect && "object-top",
        cropPosition === "bottom" && cropAspect && "object-bottom",
        cropPosition === "center" && cropAspect && "object-center",
        className
      )}
      {...props}
    />
  )

  if (!cropAspect) return image

  return (
    <div
      data-slot="app-screenshot-crop"
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: cropAspect }}
    >
      {image}
    </div>
  )
}
