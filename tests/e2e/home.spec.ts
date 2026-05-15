import { test, expect } from "@playwright/test"

test("home page responds 200 and renders the sticky nav", async ({ page }) => {
  const response = await page.goto("/")
  expect(response?.status()).toBe(200)

  const nav = page.getByRole("navigation", { name: "Primary" })
  await expect(nav).toBeVisible()

  await expect(
    page.getByRole("link", { name: "Download", exact: true })
  ).toBeVisible()
})

test("hero renders headline, CTAs, and the product demo", async ({
  page,
}) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "The missing OS for modern work.",
    })
  ).toBeVisible()

  const download = page.getByRole("link", { name: /download free for macos/i })
  await expect(download.first()).toHaveAttribute("href", "/download")

  const seeDay = page.getByRole("link", { name: /see a day in locus/i })
  await expect(seeDay).toHaveAttribute("href", "#day-in-locus")

  const demo = page.getByTestId("hero-widget")
  await expect(demo).toBeVisible()
  await expect(
    demo.getByRole("tab", { name: /session tracking/i })
  ).toBeVisible()
})

test("'A day in Locus' placeholder renders the three value modes", async ({
  page,
}) => {
  await page.goto("/")

  const section = page.locator("#day-in-locus")
  await expect(section).toBeVisible()

  const labels = ["Session Tracking", "Day Visibility", "Review Loop"]
  for (const label of labels) {
    await expect(
      section.getByRole("heading", { level: 3, name: label })
    ).toBeVisible()
  }
})

test("home page uses the OS narrative section inventory", async ({ page }) => {
  await page.goto("/")

  await expect(page.locator("#day-in-locus")).toBeVisible()
  await expect(page.locator("#pricing")).toBeVisible()
  await expect(page.locator("#faq")).toBeVisible()

  await expect(page.locator("#personas")).toHaveCount(0)
  await expect(page.locator("#review")).toHaveCount(0)
  await expect(page.locator("#depth")).toHaveCount(0)
})
