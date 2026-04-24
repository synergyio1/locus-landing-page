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
      name: "Know where your hours actually went.",
    })
  ).toBeVisible()

  const download = page.getByRole("link", { name: "Download for macOS" })
  await expect(download.first()).toHaveAttribute("href", "/download")

  const seeHow = page.getByRole("link", { name: "See how it works" })
  await expect(seeHow).toHaveAttribute("href", "#loop")

  const screenshot = page.getByRole("img", {
    name: /Command view with a focus session running/i,
  })
  await expect(screenshot).toBeVisible()
})

test("loop strip renders the four verbs and Stoic sub-line", async ({
  page,
}) => {
  await page.goto("/")

  const loopSection = page.locator("#loop")
  await expect(loopSection).toBeVisible()

  for (const label of ["Plan", "Focus", "Track", "Review"]) {
    await expect(loopSection.getByText(label, { exact: true })).toBeVisible()
  }

  await expect(
    loopSection.getByText(/execute on what's in your control/i)
  ).toBeVisible()
})
