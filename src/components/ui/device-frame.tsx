import * as React from "react"

import { cn } from "@/lib/utils"

type DeviceFrameProps = React.HTMLAttributes<HTMLDivElement>

export function DeviceFrame({
  className,
  children,
  ...props
}: DeviceFrameProps) {
  return (
    <div
      data-slot="device-frame"
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--border)]",
        "shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
