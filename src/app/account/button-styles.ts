import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Account actions speak the site's pill language (rounded-full, `size-lg`
 * reserved for the hero CTAs). Two tones only: filled Cobalt for the one
 * action that matters on the page, and a Cobalt-tinted outline for the rest —
 * the plain `outline` variant reads as chrome next to a filled pill.
 */
export const accountButton = cn(buttonVariants())

export const accountButtonOutline = cn(
  buttonVariants({ variant: "outline" }),
  "border-[color-mix(in_oklab,var(--accent)_35%,transparent)] text-[var(--accent-text)] hover:bg-[var(--accent-subtle)]"
)

export const accountButtonError = "basis-full text-sm text-[var(--warn)]"
