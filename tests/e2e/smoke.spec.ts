import { test, expect } from "@playwright/test"

const ROUTES = [
  { path: "/", h1: /finish the things you keep starting\./i },
  { path: "/pricing", h1: /one app\. one subscription\./i },
  { path: "/changelog", h1: /what.s new in locus/i },
  { path: "/download", h1: /coming soon/i },
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

test("/sitemap.xml serves a valid sitemap listing all six routes", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml")
  expect(response.status()).toBe(200)
  const body = await response.text()
  for (const { path } of ROUTES) {
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
