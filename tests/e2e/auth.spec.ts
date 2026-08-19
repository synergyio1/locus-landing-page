import { test, expect } from "@playwright/test"

test("unauthenticated /account redirects to /login?next=/account", async ({
  page,
}) => {
  const response = await page.goto("/account")
  expect(response?.status()).toBe(200)

  await expect(page).toHaveURL(
    (url) =>
      url.pathname === "/login" &&
      url.searchParams.get("next") === "/account"
  )
})

test("unauthenticated /billing redirects to /login?next=/billing", async ({
  page,
}) => {
  await page.goto("/billing")

  await expect(page).toHaveURL(
    (url) =>
      url.pathname === "/login" &&
      url.searchParams.get("next") === "/billing"
  )
})

test("login page renders the Google button and magic-link form", async ({
  page,
}) => {
  await page.goto("/login")

  await expect(
    page.getByRole("button", { name: /continue with google/i })
  ).toBeVisible()
  // Apple sign-in is not configured on the Supabase project and the button used to
  // error on click, so it must not come back.
  await expect(
    page.getByRole("button", { name: /apple/i })
  ).toHaveCount(0)
  await expect(page.getByLabel(/email/i)).toBeVisible()
  await expect(
    page.getByRole("button", { name: /send magic link/i })
  ).toBeVisible()
})

test("signup page renders the same form as login", async ({ page }) => {
  await page.goto("/signup")

  await expect(
    page.getByRole("button", { name: /continue with google/i })
  ).toBeVisible()
})

test("public pages are not gated by the proxy", async ({ page }) => {
  const response = await page.goto("/")
  expect(response?.status()).toBe(200)
  await expect(page).toHaveURL(/\/$/)
})
