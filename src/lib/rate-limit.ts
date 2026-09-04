type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Stops one hot instance from growing the map without bound. */
const MAX_TRACKED_KEYS = 10_000

function prune(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/**
 * Fixed-window limiter. In-memory, so on serverless it is per-instance and
 * per-region rather than global — enough to blunt a casual abuser hammering
 * one endpoint, not a substitute for a shared store if this ever needs to
 * hold against a real flood.
 */
export function consumeRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now: number = Date.now()
): boolean {
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) prune(now)
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (existing.count >= limit) return false

  existing.count += 1
  return true
}

/** Test seam: drops all tracked windows. */
export function resetRateLimits(): void {
  buckets.clear()
}
