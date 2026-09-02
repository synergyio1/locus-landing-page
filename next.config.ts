import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostHog ingestion proxy: events go to our own origin so ad blockers (and
  // strict in-app browsers) don't drop them. PostHog API paths end in a
  // trailing slash, which Next would otherwise 308 away from — hence skip.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ]
  },
  images: {
    qualities: [75, 90],
    // WebP only (the default), on purpose: the showcase captures are 2784px
    // RGBA PNGs and AVIF-encoding one per requested width took the optimizer
    // 30s+ cold in dev — a cold cache on Vercel would pay the same. WebP keeps
    // the alpha and encodes in a fraction of the time.
    formats: ["image/webp"],
    // Keep optimised variants at the edge for 31 days (Vercel's guidance for
    // static images): each width/format is encoded once, not per visitor.
    // The source PNGs live in /public with stable names, so to *replace* a
    // capture bump the filename (home-v2.png) rather than overwrite — an
    // overwrite can keep serving the cached variant for up to this long.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
