import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { BreathingDot, SpringReveal } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <PageShell as="section" className="py-24 md:py-32">
      <SpringReveal className="flex flex-col gap-6 md:max-w-2xl">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          <BreathingDot aria-hidden />
          Foundation preview
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--fg)] md:text-5xl">
          Know where your hours actually went.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)]">
          A macOS focus system for sessions, projects and habits. Real
          sections land in A.2 and onwards — this page renders under the new
          nav, tokens, and motion primitives.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/download" className={cn(buttonVariants({ size: "lg" }))}>
            Download for macOS
          </Link>
          <Link
            href="#loop"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            See how it works
          </Link>
        </div>
      </SpringReveal>
    </PageShell>
  );
}
