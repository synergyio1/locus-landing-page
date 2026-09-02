import { test, expect } from "@playwright/test"

const ROUTES = [
  { path: "/", h1: /the missing os for modern work\./i },
  { path: "/pricing", h1: /one plan\. all of locus\./i },
  { path: "/app", h1: /from your decade down to today\./i },
  // Packs is hidden since 2026-08-30 (nav item, footer link and sitemap
  // entries pulled — see site-nav-client.tsx). The routes still serve, so
  // they stay in the smoke run, but they are deliberately not in the sitemap.
  { path: "/packs", h1: /choose how locus coaches you\./i, listed: false },
  { path: "/packs/relentless", h1: /^relentless$/i, listed: false },
  { path: "/download", h1: /download locus for macos/i },
  { path: "/privacy", h1: /privacy policy/i },
  { path: "/terms", h1: /terms of service/i },
] as const

for (const { path, h1 } of ROUTES) {
  test(`${path} responds 200 and renders a meaningful h1`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)

    const heading = page.getByRole("heading", { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText(h1)
  })
}

test("/sitemap.xml serves a valid sitemap listing every public route", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml")
  expect(response.status()).toBe(200)
  const body = await response.text()
  for (const route of ROUTES) {
    if ("listed" in route && route.listed === false) continue
    const { path } = route
    const url =
      path === "/" ? "https://getlocus.tech" : `https://getlocus.tech${path}`
    expect(body).toContain(`<loc>${url}</loc>`)
  }
})

test("/robots.txt allows all crawlers and references the sitemap", async ({
  request,
}) => {
  const response = await request.get("/robots.txt")
  expect(response.status()).toBe(200)
  const body = await response.text()
  expect(body).toMatch(/User-Agent:\s*\*/i)
  expect(body).toMatch(/Allow:\s*\//i)
  expect(body).toMatch(/Sitemap:\s*https:\/\/getlocus\.tech\/sitemap\.xml/i)
})
