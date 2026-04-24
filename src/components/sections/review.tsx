import { AppScreenshot } from "@/components/media/app-screenshot"
import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { DeviceFrame } from "@/components/ui/device-frame"
import { ParallaxImage } from "@/components/ui/parallax-image"
import { review } from "@/content/review"

export function Review() {
  const [primary] = review.panels
  return (
    <section
      id={review.id}
      aria-labelledby="review-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-32">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:items-center md:gap-16">
          <SpringReveal className="flex flex-col gap-4 md:order-1">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {review.eyebrow}
            </span>
            <h2
              id="review-heading"
              className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
            >
              {review.headline}
            </h2>
            <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              {review.body}
            </p>
          </SpringReveal>

          <SpringReveal delay={100} className="md:order-2 md:-mr-6">
            <ParallaxImage offset={24} direction={1}>
              <div className="flex flex-col gap-3">
                <DeviceFrame>
                  <AppScreenshot
                    src={primary.screenshot.src}
                    alt={primary.screenshot.alt}
                    width={primary.screenshot.width}
                    height={primary.screenshot.height}
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 58vw, 820px"
                  />
                </DeviceFrame>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {primary.caption}
                </p>
              </div>
            </ParallaxImage>
          </SpringReveal>
        </div>
      </PageShell>
    </section>
  )
}
