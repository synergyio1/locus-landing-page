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

test("hero renders headline, CTAs, and the CommandView screenshot", async ({
  page,
}) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Finish the things you keep starting.",
    })
  ).toBeVisible()

  const download = page.getByRole("link", { name: /download for macos/i })
  await expect(download.first()).toHaveAttribute("href", "/download")

  const seeDay = page.getByRole("link", { name: /see a day in locus/i })
  await expect(seeDay).toHaveAttribute("href", "#day-in-locus")

  const screenshot = page.getByRole("img", {
    name: /focus session running/i,
  })
  await expect(screenshot).toBeVisible()
})

test("'A day in Locus' showpiece renders the four stages in order", async ({
  page,
}) => {
  await page.goto("/")

  const section = page.locator("#day-in-locus")
  await expect(section).toBeVisible()

  const tabs = section.getByRole("tab")
  await expect(tabs).toHaveCount(4)

  const labels = ["Morning plan", "In the work", "Drift caught", "End of the day"]
  for (let i = 0; i < labels.length; i++) {
    await expect(tabs.nth(i)).toContainText(labels[i])
  }
})
