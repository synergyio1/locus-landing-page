import AxeBuilder from "@axe-core/playwright"
import { test, expect } from "@playwright/test"

const ROUTES = [
  "/",
  "/pricing",
  "/changelog",
  "/download",
  "/privacy",
  "/terms",
  "/login",
  "/signup",
] as const

for (const path of ROUTES) {
  test(`${path} has no critical axe violations`, async ({ page }) => {
    await page.goto(path)

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze()

    const critical = results.violations.filter((v) => v.impact === "critical")

    expect(
      critical,
      `Critical axe violations on ${path}:\n${JSON.stringify(critical, null, 2)}`
    ).toEqual([])
  })
}
