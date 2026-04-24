import { MarqueeRow } from "@/components/ui/marquee-row"
import { Icon, type IconName } from "@/components/ui/icon"

type TrustItem = { icon: IconName; label: string }

const TRUST_ITEMS: TrustItem[] = [
  { icon: "apple", label: "Works on Apple Silicon" },
  { icon: "moon", label: "macOS 14+" },
  { icon: "shield", label: "Local-first" },
  { icon: "bolt", label: "Menu-bar native" },
  { icon: "sparkle", label: "On-device classification" },
  { icon: "plan", label: "Private by default" },
]

export function TrustStrip() {
  const items = TRUST_ITEMS.map((item) => (
    <>
      <Icon
        name={item.icon}
        size={14}
        className="text-[var(--muted-foreground)]"
      />
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        {item.label}
      </span>
      <span
        aria-hidden
        className="ml-12 inline-block h-1 w-1 rounded-full bg-[var(--muted-foreground)]/50"
      />
    </>
  ))

  return (
    <section
      aria-label="Product highlights"
      className="border-y border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_96%,black)]"
    >
      <MarqueeRow items={items} duration={46} className="py-5" />
    </section>
  )
}
