import { test, expect } from "@playwright/test"

test("home page responds 200 and renders the sticky nav", async ({ page }) => {
  const response = await page.goto("/")
  expect(response?.status()).toBe(200)

  const nav = page.getByRole("navigation", { name: "Primary" })
  await expect(nav).toBeVisible()

  await expect(
    nav.getByRole("link", { name: "Manifesto", exact: true })
  ).toHaveAttribute("href", "/#manifesto")
  await expect(
    page.getByRole("link", { name: "Log in", exact: true })
  ).toHaveAttribute("href", "/login")
  // The header carries no Download — the hero owns that CTA.
  await expect(
    page.locator("header").getByRole("link", { name: /download/i })
  ).toHaveCount(0)
})

test("hero renders the locked headline and both CTAs", async ({ page }) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "The missing OS for modern work.",
    })
  ).toBeVisible()

  const download = page.getByRole("link", { name: /download for macos/i })
  await expect(download.first()).toHaveAttribute("href", "/download")

  const readManifesto = page.getByRole("link", { name: /read the manifesto/i })
  await expect(readManifesto).toHaveAttribute("href", "#manifesto")
})

test("manifesto renders the statement, the decisions, and the sign-off", async ({
  page,
}) => {
  await page.goto("/")

  const section = page.locator("#manifesto")
  await expect(section).toBeVisible()

  await expect(
    section.getByRole("heading", {
      level: 2,
      name: /we are building a system you can trust with/i,
    })
  ).toBeVisible()

  await expect(
    section.getByRole("heading", { level: 3, name: /six decisions/i })
  ).toBeVisible()
  await expect(section.getByText("Luis", { exact: true })).toBeVisible()
})

test("home page is hero → manifesto → showcase → pricing, nothing else", async ({
  page,
}) => {
  await page.goto("/")

  await expect(page.locator("#manifesto")).toBeVisible()
  await expect(page.locator("#showcase")).toBeVisible()
  await expect(page.locator("#pricing")).toBeVisible()

  // Sections retired 2026-08-17 (and earlier) — anti-drift net.
  for (const id of [
    "#transformation",
    "#app-demo",
    "#flywheel",
    "#day-in-locus",
    "#armor-reactor",
    "#faq",
    "#personas",
    "#review",
    "#depth",
  ]) {
    await expect(page.locator(id)).toHaveCount(0)
  }
  await expect(page.getByTestId("hero-widget")).toHaveCount(0)

  // Section order.
  const ids = await page
    .locator("main > section[id]")
    .evaluateAll((els) => els.map((el) => el.id))
  expect(ids).toEqual(["manifesto", "showcase", "pricing"])
})
