"use client"

import * as React from "react"
import Link from "next/link"

import { PageShell } from "@/components/layout/page-shell"
import { SpringReveal } from "@/components/motion"
import { buttonVariants } from "@/components/ui/button"
import {
  pricing,
  type PricingCadence,
  type PricingPlan,
} from "@/content/pricing"
import { cn } from "@/lib/utils"

export function Pricing() {
  const [cadence, setCadence] = React.useState<PricingCadence>(
    pricing.defaultCadence
  )

  return (
    <section
      id={pricing.id}
      aria-labelledby="pricing-heading"
      className="border-t border-[var(--border)] bg-[var(--bg)]"
    >
      <PageShell className="py-20 md:py-28">
        <SpringReveal className="flex max-w-3xl flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            {pricing.eyebrow}
          </span>
          <h2
            id="pricing-heading"
            className="text-3xl font-medium leading-tight tracking-tight text-[var(--fg)] md:text-4xl"
          >
            {pricing.headline}
          </h2>
          <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {pricing.body}
          </p>
        </SpringReveal>

        <SpringReveal
          delay={80}
          className="mt-10 flex items-center gap-3 md:mt-12"
        >
          <CadenceToggle value={cadence} onChange={setCadence} />
        </SpringReveal>

        <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2 md:gap-8">
          {pricing.plans.map((plan, i) => (
            <SpringReveal key={plan.id} delay={120 + i * 80} as="div">
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
    <div
      role="radiogroup"
      aria-label="Billing cadence"
      className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1"
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
              "rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              active
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--fg)]"
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
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

  return (
    <article
      data-featured={plan.featured ? "true" : "false"}
      className={cn(
        "flex h-full flex-col gap-6 rounded-xl border p-6 md:p-8",
        plan.featured
          ? "border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[color-mix(in_oklab,var(--accent)_7%,var(--surface))]"
          : "border-[var(--border)] bg-[var(--surface)]"
      )}
    >
      <header className="flex flex-col gap-1">
        <h3 className="text-xl font-medium tracking-tight text-[var(--fg)]">
          {plan.name}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)]">{plan.tagline}</p>
      </header>

      <div className="flex items-baseline gap-2">
        {isFree ? (
          <span className="font-mono text-4xl text-[var(--fg)]">$0</span>
        ) : (
          <>
            <span className="font-mono text-4xl text-[var(--fg)]">
              ${price.amount}
            </span>
            <span className="text-sm text-[var(--muted-foreground)]">
              {price.unit}
            </span>
          </>
        )}
      </div>
      {price.note || price.savings ? (
        <p className="-mt-4 text-sm text-[var(--accent)]">
          {price.savings ?? price.note}
        </p>
      ) : null}

      <ul className="flex flex-col gap-2 text-sm leading-relaxed text-[var(--fg)]">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span
              aria-hidden
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--accent)]"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <Link
          href={plan.cta.href}
          className={cn(
            buttonVariants({
              size: "lg",
              variant: plan.featured ? "default" : "outline",
            }),
            "w-full"
          )}
        >
          {plan.cta.label}
        </Link>
      </div>
    </article>
  )
}
