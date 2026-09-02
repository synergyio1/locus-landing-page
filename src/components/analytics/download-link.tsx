"use client"

import * as React from "react"
import posthog from "posthog-js"

/**
 * The DMG anchor with a `download_clicked` capture. The `download` attribute
 * keeps the page alive, so the default transport is fine here.
 */
export function DownloadLink({
  href,
  className,
  "aria-label": ariaLabel,
  children,
}: {
  href: string
  className?: string
  "aria-label"?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      download
      aria-label={ariaLabel}
      className={className}
      onClick={() => posthog.capture("download_clicked", { href })}
    >
      {children}
    </a>
  )
}
