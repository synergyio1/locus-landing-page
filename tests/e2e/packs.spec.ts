import { test, expect } from "@playwright/test"

const PACK_IDS = [
  "general",
  "quiet",
  "deep-work",
  "relentless",
  "compound",
  "process",
] as const

test("/packs lists every pack, each linking to its own page", async ({ page }) => {
  await page.goto("/packs")

  for (const id of PACK_IDS) {
    await expect(page.locator(`a[href="/packs/${id}"]`)).toHaveCount(1)
  }
  // No extras: the catalog is exactly the shipped set.
  await expect(page.locator('a[href^="/packs/"]')).toHaveCount(PACK_IDS.length)
})

test("a pack page argues the method and shows what it changes", async ({ page }) => {
  await page.goto("/packs/relentless")

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/relentless/i)
  // The credit line carries the lineage — the pack name never does.
  await expect(page.getByText(/inspired by kobe bryant/i)).toBeVisible()

  for (const section of ["The method", "The coach’s stance", "What changes"]) {
    await expect(
      page.getByRole("heading", { name: section, exact: true })
    ).toBeVisible()
  }

  // Relentless stands in for four routines and brings two of its own.
  await expect(page.getByRole("heading", { name: "Replaces" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Adds" })).toBeVisible()
  // The roster entry specifically — the phrase also appears in the summary
  // and as one of the method's principles.
  await expect(
    page.getByRole("heading", { level: 4, name: "No days off", exact: true })
  ).toBeVisible()
  await expect(page.getByText("07:00", { exact: true })).toBeVisible()
})

test("a pack that only turns things off says so", async ({ page }) => {
  await page.goto("/packs/quiet")
  await expect(page.getByRole("heading", { name: "Turns off" })).toBeVisible()
  // Quiet borrows from nobody, so it claims no stance.
  await expect(
    page.getByRole("heading", { name: "The coach’s stance" })
  ).toHaveCount(0)
})

test("packs never link the private community repo", async ({ page }) => {
  for (const path of ["/packs", "/packs/relentless"]) {
    await page.goto(path)
    await expect(page.locator('a[href*="github"]')).toHaveCount(0)
    await expect(page.getByText(/github/i)).toHaveCount(0)
  }
})

test("an unknown pack 404s rather than rendering an empty shell", async ({
  page,
}) => {
  const response = await page.goto("/packs/not-a-pack")
  expect(response?.status()).toBe(404)
})
