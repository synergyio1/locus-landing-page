"use client"

import * as React from "react"

import { DownloadLink } from "@/components/analytics/download-link"
import { MacLinkForm } from "@/components/download/mac-link-form"
import { buttonVariants } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { download } from "@/content/download"
import { refineIsMac } from "@/lib/platform/detect"
import { cn } from "@/lib/utils"

/**
 * Chooses between the DMG and the email-the-link form.
 *
 * The server's User-Agent guess arrives as `initialIsMac`; an iPad in its
 * default desktop mode is indistinguishable from a Mac at that point, so the
 * first client render corrects it via touch support. Only iPads change after
 * hydration, so no other visitor sees the CTA move.
 */
export function DownloadCta({ initialIsMac }: { initialIsMac: boolean }) {
  const [isMac, setIsMac] = React.useState(initialIsMac)

  React.useEffect(() => {
    setIsMac(refineIsMac(initialIsMac, navigator.maxTouchPoints))
  }, [initialIsMac])

  if (isMac) {
    return (
      <div className="flex flex-col gap-3">
        <DownloadLink
          href={download.cta.href}
          aria-label="Download the macOS DMG"
          className={cn(buttonVariants({ size: "lg" }), "self-start")}
        >
          <Icon name="download" />
          {download.cta.label}
        </DownloadLink>
        <p className="text-sm text-[var(--muted-foreground)]">
          {download.cta.note}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
          {download.otherPlatform.headline}
        </h2>
        <p className="text-base leading-relaxed text-[var(--muted-foreground)]">
          {download.otherPlatform.body}
        </p>
      </div>
      <MacLinkForm platform={initialIsMac ? "ipad" : "non_mac"} />
    </div>
  )
}
