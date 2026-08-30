import type { MetadataRoute } from "next"

const SITE_URL = "https://getlocus.tech"

const ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/app", changeFrequency: "monthly", priority: 0.9 },
  { path: "/download", changeFrequency: "weekly", priority: 0.9 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
] as const

// Packs hidden 2026-08-30 (see site-nav-client.tsx): /packs and the per-pack
// URLs (`/packs/${pack.id}`, generated from `packs.packs`) left the sitemap
// with the nav item. Re-add both when the page relaunches.

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  )
}
