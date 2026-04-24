import * as React from "react"

import { cn } from "@/lib/utils"

type PageShellProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: keyof React.JSX.IntrinsicElements
  bleed?: boolean
}

export function PageShell({
  as = "div",
  bleed = false,
  className,
  children,
  ...props
}: PageShellProps) {
  const Tag = as as React.ElementType
  return (
    <Tag
      data-slot="page-shell"
      className={cn(
        "mx-auto w-full max-w-[1400px]",
        bleed ? "" : "px-6 md:px-10",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
