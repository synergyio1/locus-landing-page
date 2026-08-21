import type { MetadataRoute } from "next"

import { packs } from "@/content/packs"

const SITE_URL = "https://getlocus.tech"

const ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/app", changeFrequency: "monthly", priority: 0.9 },
  { path: "/packs", changeFrequency: "weekly", priority: 0.9 },
  { path: "/download", changeFrequency: "weekly", priority: 0.9 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
] as const

// Every pack gets its own URL, generated from the catalog so a new pack can
// never ship without one.
const PACK_ROUTES = packs.packs.map((pack) => ({
  path: `/packs/${pack.id}`,
  changeFrequency: "monthly" as const,
  priority: 0.7,
}))

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [...ROUTES, ...PACK_ROUTES].map(
    ({ path, changeFrequency, priority }) => ({
      url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  )
}
