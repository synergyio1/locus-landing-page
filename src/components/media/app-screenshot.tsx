import * as React from "react"
import Image, { type ImageProps } from "next/image"

import { cn } from "@/lib/utils"

type AppScreenshotProps = Omit<ImageProps, "src" | "alt"> & {
  src: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
}

export function AppScreenshot({
  src,
  alt,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1400px) 60vw, 840px",
  priority,
  className,
  ...props
}: AppScreenshotProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      data-slot="app-screenshot"
      className={cn("h-auto w-full select-none", className)}
      {...props}
    />
  )
}
