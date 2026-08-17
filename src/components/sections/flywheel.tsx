import { PageShell } from "@/components/layout/page-shell"
import { ClipFrame } from "@/components/media/clip-frame"
import { SpringReveal } from "@/components/motion"
import { FlywheelSwitcher } from "@/components/sections/flywheel-switcher"
import { cn } from "@/lib/utils"
import { flywheel, type FlywheelSensorRow } from "@/content/flywheel"

/**
 * Flywheel — the app tour, staged as the loop the product runs on:
 * 01 sensors (Focus/Sentinel as alternating text+clip rows), 02 capture and
 * 03 brains (each a Raycast-style clip switcher). All media slots are clip
 * placeholders — posters where screenshots exist, empty slots where the
 * captures are still to come. Content lives in src/content/flywheel.ts.
 */

type Stage = {
  index: string
  kicker: string
  title: string
  body: string
}

function StageHeader({ stage, className }: { stage: Stage; className?: string }) {
  return (
    <SpringReveal
      className={cn("border-t border-[var(--border)] pt-10 md:pt-12", className)}
    >
      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent-text)]">
          {stage.index} · {stage.kicker}
        </span>
        <h3 className="max-w-xl text-2xl font-semibold leading-[1.08] tracking-tight text-[var(--fg)] md:text-4xl">
          {stage.title}
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
          {stage.body}
        </p>
      </div>
    </SpringReveal>
  )
}

function SensorRow({
  row,
  flipped,
}: {
  row: FlywheelSensorRow
  flipped: boolean
}) {
  return (
    <div
      className={cn(
        "grid items-center gap-8 md:gap-14",
        flipped
          ? "md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
          : "md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      )}
    >
      <SpringReveal className={cn("flex flex-col gap-4", flipped && "md:order-2")}>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          {row.eyebrow}
        </span>
        <h4 className="max-w-md text-xl font-medium tracking-tight text-[var(--fg)] md:text-2xl">
          {row.title}
        </h4>
        <p className="max-w-md text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
          {row.body}
        </p>
      </SpringReveal>

      <SpringReveal delay={100} className={cn(flipped && "md:order-1")}>
        <ClipFrame
          label={row.clip.label}
          alt={row.clip.alt}
          poster={row.clip.poster}
          sizes="(max-width: 768px) 100vw, 55vw"
        />
      </SpringReveal>
    </div>
  )
}

export function Flywheel() {
  const { sensors, capture, brains } = flywheel

  return (
    <section
      id={flywheel.id}
      aria-labelledby="flywheel-heading"
      className="relative border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-24 md:py-36">
        <SpringReveal className="flex flex-col gap-5">
          <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {flywheel.eyebrow}
          </span>
          <h2
            id="flywheel-heading"
            className="max-w-2xl text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
          >
            {flywheel.headline}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {flywheel.body}
          </p>
        </SpringReveal>

        <StageHeader stage={sensors} className="mt-16 md:mt-24" />
        <div className="mt-10 flex flex-col gap-16 md:mt-14 md:gap-24">
          {sensors.rows.map((row, index) => (
            <SensorRow key={row.id} row={row} flipped={index % 2 === 1} />
          ))}
        </div>

        <StageHeader stage={capture} className="mt-20 md:mt-28" />
        <SpringReveal delay={100} className="mx-auto mt-10 w-full max-w-4xl md:mt-14">
          <FlywheelSwitcher
            idBase="flywheel-capture"
            label="Capture surfaces"
            clips={capture.clips}
          />
        </SpringReveal>

        <StageHeader stage={brains} className="mt-20 md:mt-28" />
        <SpringReveal delay={100} className="mx-auto mt-10 w-full max-w-4xl md:mt-14">
          <FlywheelSwitcher
            idBase="flywheel-brains"
            label="Agent surfaces"
            clips={brains.clips}
          />
        </SpringReveal>
      </PageShell>
    </section>
  )
}
