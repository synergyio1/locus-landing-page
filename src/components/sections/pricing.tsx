"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { SpotlightBorder } from "@/components/ui/spotlight-border"
import {
  pricing,
  type PricingCadence,
  type PricingPlan,
} from "@/content/pricing"
import { cn } from "@/lib/utils"

export function Pricing({
  headingLevel = "h2",
}: {
  headingLevel?: "h1" | "h2"
} = {}) {
  const [cadence, setCadence] = React.useState<PricingCadence>(
    pricing.defaultCadence
  )
  const Heading = headingLevel

  return (
    <section
      id={pricing.id}
      aria-labelledby="pricing-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-32">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
          <SpringReveal className="flex max-w-2xl flex-col gap-4">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {pricing.eyebrow}
            </span>
            <Heading
              id="pricing-heading"
              className="text-3xl font-semibold leading-[1.05] tracking-tighter text-[var(--fg)] md:text-5xl"
            >
              {pricing.headline}
            </Heading>
            <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              {pricing.body}
            </p>
          </SpringReveal>

          <SpringReveal delay={80}>
            <CadenceToggle value={cadence} onChange={setCadence} />
          </SpringReveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-8">
          {pricing.plans.map((plan, i) => (
            <SpringReveal key={plan.id} delay={120 + i * 90} as="div">
              <PlanCard plan={plan} cadence={cadence} />
            </SpringReveal>
          ))}
        </div>

        <SpringReveal
          delay={280}
          className="mt-10 max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)] md:mt-12"
        >
          {pricing.unlockNote}
        </SpringReveal>
      </PageShell>
    </section>
  )
}

function CadenceToggle({
  value,
  onChange,
}: {
  value: PricingCadence
  onChange: (next: PricingCadence) => void
}) {
  const options: Array<{ value: PricingCadence; label: string }> = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ]
  return (
    <LayoutGroup id="pricing-cadence">
      <div
        role="radiogroup"
        aria-label="Billing cadence"
        className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      >
        {options.map((opt) => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={opt.label}
              onClick={() => onChange(opt.value)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
                active
                  ? "text-[var(--accent-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--fg)]"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="pricing-cadence-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-[var(--accent)]"
                />
              ) : null}
              <span className="relative">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}

function PlanCard({
  plan,
  cadence,
}: {
  plan: PricingPlan
  cadence: PricingCadence
}) {
  const price = plan.price[cadence]
  const isFree = plan.id === "free"

  const cardInner = (
    <article
      data-featured={plan.featured ? "true" : "false"}
      className={cn(
        "flex h-full flex-col gap-6 rounded-xl border p-6 md:p-8",
        plan.featured
          ? "border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[color-mix(in_oklab,var(--accent)_7%,var(--surface))] shadow-[inset_0_1px_0_color-mix(in_oklab,var(--accent)_45%,transparent)]"
          : "border-[var(--border)] bg-[var(--surface)]"
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-medium tracking-tight text-[var(--fg)]">
            {plan.name}
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            {plan.tagline}
          </p>
        </div>
        {plan.featured ? (
          <span className="rounded-full border border-[color-mix(in_oklab,var(--accent)_50%,transparent)] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent-text)]">
            Popular
          </span>
        ) : null}
      </header>

      <div className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
          <motion.div
            key={`${plan.id}-${cadence}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, position: "absolute" }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-baseline gap-2"
          >
            {isFree ? (
              <span className="font-mono text-4xl text-[var(--fg)] md:text-5xl">
                $0
              </span>
            ) : (
              <>
                <span className="font-mono text-4xl text-[var(--fg)] md:text-5xl">
                  ${price.amount}
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  {price.unit}
                </span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        {price.note || price.savings ? (
          <p className="text-sm text-[var(--accent-text)]">
            {price.savings ?? price.note}
          </p>
        ) : null}
      </div>

      <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-[var(--fg)]">
        {plan.features.map((feature, i) => (
          <li
            key={feature}
            className="flex gap-3"
            style={{
              animation: `spring-reveal 420ms cubic-bezier(0.22,1,0.36,1) both`,
              animationDelay: `${160 + i * 60}ms`,
            }}
          >
            <span
              aria-hidden
              className="mt-1.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_18%,transparent)]"
            >
              <svg
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-2.5 text-[var(--accent-text)]"
              >
                <path d="M2 6.5L5 9l5-6" />
              </svg>
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        {plan.featured ? (
          <MagneticButton href={plan.cta.href} className="w-full">
            <span
              className={cn(
                buttonVariants({ size: "lg", variant: "default" }),
                "w-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
              )}
            >
              {plan.cta.label}
            </span>
          </MagneticButton>
        ) : (
          <Link
            href={plan.cta.href}
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "w-full"
            )}
          >
            {plan.cta.label}
          </Link>
        )}
      </div>
    </article>
  )

  if (plan.featured) {
    return (
      <SpotlightBorder className="h-full rounded-xl" radius={320}>
        {cardInner}
      </SpotlightBorder>
    )
  }
  return cardInner
}
