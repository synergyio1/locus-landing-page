"use client"

import * as React from "react"
import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { ProCta } from "@/components/sections/pro-cta"
import {
  pricing,
  type AiChoiceCard,
  type FeatureTab,
  type PricingCadence,
} from "@/content/pricing"
import { cn } from "@/lib/utils"

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

export function Pricing({
  headingLevel = "h2",
  isAuthed = false,
}: {
  headingLevel?: "h1" | "h2"
  isAuthed?: boolean
} = {}) {
  const Heading = headingLevel
  const [cadence, setCadence] = React.useState<PricingCadence>(
    pricing.defaultCadence
  )

  return (
    <section
      id={pricing.id}
      aria-labelledby="pricing-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-24 md:py-36">
        <SpringReveal className="flex max-w-[52ch] flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-text)]">
            {pricing.eyebrow}
          </span>
          <Heading
            id="pricing-heading"
            className="text-4xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
          >
            {pricing.headline}
          </Heading>
          <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {pricing.subline}
          </p>
        </SpringReveal>

        <SpringReveal delay={120} as="div" className="mt-12 md:mt-16">
          <PriceRow
            cadence={cadence}
            onCadenceChange={setCadence}
            isAuthed={isAuthed}
          />
        </SpringReveal>

        <SpringReveal delay={220} as="div" className="mt-14 md:mt-20">
          <FeatureTriptych />
        </SpringReveal>

        <SpringReveal delay={320} as="div" className="mt-12 md:mt-16">
          <AiChoiceStrip />
        </SpringReveal>

        <SpringReveal delay={400} as="div" className="mt-8">
          <PricingFooter />
        </SpringReveal>
      </PageShell>
    </section>
  )
}

function PriceRow({
  cadence,
  onCadenceChange,
  isAuthed,
}: {
  cadence: PricingCadence
  onCadenceChange: (cadence: PricingCadence) => void
  isAuthed: boolean
}) {
  const option = pricing.billing[cadence]

  return (
    <div className="grid gap-8 border-y border-[var(--border)] py-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] md:items-center md:py-10">
      <div className="flex min-w-0 flex-col gap-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:justify-start md:gap-5">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {pricing.plan.label}
          </span>
          <BillingToggle cadence={cadence} onChange={onCadenceChange} />
        </div>

        <div aria-live="polite" className="flex flex-col gap-2">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="font-mono text-[clamp(4.75rem,14vw,7.5rem)] font-semibold leading-none tracking-tight text-[var(--fg)] tabular-nums">
              $
              <span
                key={cadence}
                className="inline-block"
                style={{
                  animation: `spring-reveal 360ms ${EASE} both`,
                }}
              >
                {option.perMonth}
              </span>
            </span>
            <span className="pb-3 text-sm text-[var(--muted-foreground)] md:pb-4">
              /month
            </span>
          </div>
          <p
            key={`${cadence}-note`}
            className="text-sm text-[var(--muted-foreground)]"
            style={{
              animation: `spring-reveal 360ms ${EASE} 40ms both`,
            }}
          >
            {option.billedNote}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 border-t border-[var(--border)] pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
        <span className="w-fit rounded-md border border-[color-mix(in_oklab,var(--alive)_45%,transparent)] bg-[color-mix(in_oklab,var(--alive)_14%,transparent)] px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color-mix(in_oklab,var(--alive)_82%,var(--fg))]">
          {pricing.plan.trialChip}
        </span>
        <div className="flex flex-col gap-3">
          <ProCta
            cadence={cadence}
            isAuthed={isAuthed}
            label={pricing.plan.ctaLabel}
          />
          <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
            {pricing.plan.ctaNote}
          </p>
        </div>
      </div>
    </div>
  )
}

function BillingToggle({
  cadence,
  onChange,
}: {
  cadence: PricingCadence
  onChange: (cadence: PricingCadence) => void
}) {
  const options = [pricing.billing.monthly, pricing.billing.yearly]
  const refs = React.useRef<Partial<Record<PricingCadence, HTMLButtonElement>>>(
    {}
  )

  function select(next: PricingCadence) {
    onChange(next)
    refs.current[next]?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault()
      select("monthly")
    } else if (["ArrowRight", "ArrowDown"].includes(e.key)) {
      e.preventDefault()
      select("yearly")
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      className="relative grid shrink-0 grid-cols-2 rounded-full border border-[var(--border)] bg-[var(--bg)] p-1"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent)_24%,var(--surface-raised))] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] transition-transform duration-300"
        style={{
          transform:
            cadence === "yearly" ? "translateX(100%)" : "translateX(0)",
          transitionTimingFunction: EASE,
        }}
      />
      {options.map((option) => {
        const checked = cadence === option.cadence
        return (
          <button
            key={option.cadence}
            ref={(node) => {
              if (node) refs.current[option.cadence] = node
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => select(option.cadence)}
            onKeyDown={handleKeyDown}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              checked
                ? "text-[var(--fg)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--fg)]"
            )}
          >
            {option.toggleLabel}
            {option.savings ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-px text-[0.6rem] tracking-[0.08em] transition-colors duration-300",
                  checked
                    ? "bg-[color-mix(in_oklab,var(--accent)_40%,transparent)] text-[var(--accent-foreground)]"
                    : "bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] text-[var(--accent-text)]"
                )}
              >
                {option.savings}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function FeatureTriptych() {
  return (
    <div>
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-text)]">
        {pricing.featuresEyebrow}
      </span>

      <div className="mt-6 grid border-t border-[var(--border)] md:grid-cols-3">
        {pricing.featureTabs.map((featureTab, i) => (
          <FeatureColumn
            key={featureTab.tab}
            featureTab={featureTab}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}

function FeatureColumn({
  featureTab,
  index,
}: {
  featureTab: FeatureTab
  index: number
}) {
  const isLast = index === pricing.featureTabs.length - 1

  return (
    <article
      className={cn(
        "border-b border-[var(--border)] py-7 md:border-b-0",
        index > 0 && "md:border-l md:pl-8 lg:pl-10",
        !isLast && "md:pr-8 lg:pr-10",
        isLast && "border-b-0"
      )}
    >
      <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--accent-text)]">
        {featureTab.tab}
      </h3>
      <p className="mt-4 max-w-[16ch] text-balance text-2xl font-semibold leading-tight tracking-tight text-[var(--fg)] md:text-[1.7rem]">
        {featureTab.tagline}
      </p>
      <ul className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {featureTab.items.map((item, i) => (
          <li
            key={item}
            className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start py-3 text-sm leading-relaxed text-[var(--fg)]"
            style={{
              animation: `spring-reveal 420ms ${EASE} both`,
              animationDelay: `${160 + index * 80 + i * 50}ms`,
            }}
          >
            <span className="font-mono text-[0.68rem] text-[var(--muted-foreground)] tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function AiChoiceStrip() {
  return (
    <div className="border-y border-[var(--border)] py-6 md:py-7">
      <div className="grid gap-5 md:grid-cols-[0.36fr_1fr] md:items-start">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-text)]">
          {pricing.aiChoice.eyebrow}
        </span>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AiChoiceOption card={pricing.aiChoice.byo} tone="alive" />
            <AiChoiceOption card={pricing.aiChoice.managed} tone="accent" />
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-[var(--muted-foreground)]">
            {pricing.aiChoice.note}
          </p>
        </div>
      </div>
    </div>
  )
}

function AiChoiceOption({
  card,
  tone,
}: {
  card: AiChoiceCard
  tone: "alive" | "accent"
}) {
  return (
    <article className="border-t border-[var(--border)] pt-4">
      <span
        className={cn(
          "w-fit rounded-md border px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.14em]",
          tone === "alive"
            ? "border-[color-mix(in_oklab,var(--alive)_45%,transparent)] bg-[color-mix(in_oklab,var(--alive)_12%,transparent)] text-[color-mix(in_oklab,var(--alive)_82%,var(--fg))]"
            : "border-[color-mix(in_oklab,var(--accent)_50%,transparent)] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[var(--accent-text)]"
        )}
      >
        {card.badge}
      </span>
      <h3 className="mt-3 text-base font-semibold tracking-tight text-[var(--fg)]">
        {card.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
        {card.body}
      </p>
    </article>
  )
}

function PricingFooter() {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-6 md:flex-row md:items-center">
      <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
        {pricing.assurances.map((assurance, i) => (
          <React.Fragment key={assurance}>
            {i > 0 ? <li aria-hidden>·</li> : null}
            <li>{assurance}</li>
          </React.Fragment>
        ))}
      </ul>
      <Link
        href={pricing.download.href}
        className="inline-flex w-fit items-center gap-1 text-xs text-[var(--muted-foreground)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--fg)] hover:decoration-[var(--accent-text)]"
      >
        {pricing.download.label}
      </Link>
    </div>
  )
}
