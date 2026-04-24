import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { DeviceFrame } from "@/components/ui/device-frame"
import { SpotlightBorder } from "@/components/ui/spotlight-border"
import { TiltCard } from "@/components/ui/tilt-card"
import { depth } from "@/content/depth"
import { cn } from "@/lib/utils"

const TILE_LAYOUT = [
  "md:col-span-7 md:row-start-1",
  "md:col-span-5 md:row-start-1",
  "md:col-span-8 md:col-start-3 md:row-start-2",
] as const

const TILE_TILT = [5, 4, 6]
const TILE_CROP = ["16/10", "16/10", "21/9"] as const

export function Depth() {
  return (
    <section
      id={depth.id}
      aria-labelledby="depth-heading"
      className="relative border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-32">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
          <SpringReveal className="flex max-w-2xl flex-col gap-4">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {depth.eyebrow}
            </span>
            <h2
              id="depth-heading"
              className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
            >
              {depth.headline}
            </h2>
          </SpringReveal>
          <SpringReveal delay={100} className="max-w-md">
            <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              {depth.body}
            </p>
          </SpringReveal>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-12 md:gap-10">
          {depth.tiles.map((tile, i) => (
            <SpringReveal
              key={tile.label}
              delay={140 + i * 90}
              className={cn("flex flex-col gap-4", TILE_LAYOUT[i])}
            >
              <SpotlightBorder className="rounded-xl">
                <TiltCard max={TILE_TILT[i]} className="rounded-xl">
                  <DeviceFrame className="rounded-xl">
                    <AppScreenshot
                      src={tile.screenshot.src}
                      alt={tile.screenshot.alt}
                      width={tile.screenshot.width}
                      height={tile.screenshot.height}
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 55vw, 780px"
                      cropAspect={TILE_CROP[i]}
                      cropPosition="top"
                    />
                  </DeviceFrame>
                </TiltCard>
              </SpotlightBorder>
              <div className="flex items-baseline justify-between gap-4 px-1">
                <span className="text-sm font-medium text-[var(--fg)]">
                  {tile.label}
                </span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {String(i + 1).padStart(2, "0")} / 03
                </span>
              </div>
              <p className="max-w-md px-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {tile.caption}
              </p>
            </SpringReveal>
          ))}
        </div>
      </PageShell>
    </section>
  )
}
