import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { depth, type DepthTile } from "@/content/depth"
import { cn } from "@/lib/utils"

const ROTATION_CLASS: Record<DepthTile["rotation"], string> = {
  left: "md:-rotate-1",
  right: "md:rotate-1",
  none: "",
}

const TILE_LAYOUT = [
  "md:col-span-7 md:row-start-1",
  "md:col-span-5 md:row-start-1 md:mt-12",
  "md:col-span-8 md:col-start-3 md:row-start-2",
] as const

export function Depth() {
  return (
    <section
      id={depth.id}
      aria-labelledby="depth-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-28">
        <SpringReveal className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            {depth.eyebrow}
          </span>
          <h2
            id="depth-heading"
            className="text-3xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-4xl"
          >
            {depth.headline}
          </h2>
          <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {depth.body}
          </p>
        </SpringReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-12 md:gap-10">
          {depth.tiles.map((tile, i) => (
            <SpringReveal
              key={tile.label}
              delay={100 + i * 80}
              className={cn("flex flex-col gap-3", TILE_LAYOUT[i])}
            >
              <div
                className={cn(
                  "overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/30 transition-transform",
                  ROTATION_CLASS[tile.rotation]
                )}
              >
                <AppScreenshot
                  src={tile.screenshot.src}
                  alt={tile.screenshot.alt}
                  width={tile.screenshot.width}
                  height={tile.screenshot.height}
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 700px"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[var(--fg)]">
                  {tile.label}
                </span>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {tile.caption}
                </p>
              </div>
            </SpringReveal>
          ))}
        </div>
      </PageShell>
    </section>
  )
}
