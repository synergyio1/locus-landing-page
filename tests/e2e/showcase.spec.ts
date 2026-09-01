import { test, expect, type Page } from "@playwright/test"

// The showcase renders on `/` (with auto-advance) and on `/app`. Reduced
// motion makes both deterministic: no auto-advance, instant crossfades.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

const TAB_NAMES = ["Home", "Vision", "Path", "Execution", "Notes", "System", "Chat"]

async function visiblePanel(page: Page, tablist: ReturnType<Page["getByRole"]>) {
  const stage = tablist.locator("xpath=ancestor::*[@data-slot='showcase-stage']")
  const panels = stage.locator('[role="tabpanel"][aria-hidden="false"]')
  await expect(panels).toHaveCount(1)
  return panels.first()
}

for (const route of ["/", "/app"]) {
  test(`${route}: the showcase is a keyboard-navigable tablist over the six tabs and chat`, async ({
    page,
  }) => {
    await page.goto(route)
    const tablist = page.getByRole("tablist", { name: "Locus tabs" })
    await tablist.scrollIntoViewIfNeeded()
    await expect(tablist).toBeVisible()

    const tabs = tablist.getByRole("tab")
    await expect(tabs).toHaveCount(7)
    await expect(tabs).toHaveText(TAB_NAMES.map((n) => new RegExp(n)))

    await tabs.filter({ hasText: "Vision" }).click()
    await expect(tabs.filter({ hasText: "Vision" })).toHaveAttribute("aria-selected", "true")
    await expect(
      (await visiblePanel(page, tablist)).locator('[data-active="true"] img')
    ).toHaveAttribute("alt", /vision tab/i)

    await page.keyboard.press("ArrowRight")
    await expect(tabs.filter({ hasText: "Path" })).toHaveAttribute("aria-selected", "true")

    // Path's pane switch sits in the caption, outside the panels.
    const paneSwitch = page.getByRole("group", { name: "Path view" })
    await expect(paneSwitch).toBeVisible()
    await expect(paneSwitch.getByRole("button", { name: "Commitments" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    await paneSwitch.getByRole("button", { name: "Tasks" }).click()
    await expect(paneSwitch.getByRole("button", { name: "Tasks" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    await expect(
      (await visiblePanel(page, tablist)).locator('[data-active="true"] img')
    ).toHaveAttribute("alt", /tasks/i)

    // The write-up is opt-in: on md+ an "About {tab}" pill at the desktop's
    // top-right opens a side panel right beneath it (hover opens, click pins).
    const more = page.locator('button[aria-controls$="-more"]')
    await expect(more).toHaveText(/about path/i)
    await expect(more).toHaveAttribute("aria-expanded", "false")
    await more.click()
    await expect(more).toHaveAttribute("aria-expanded", "true")
    await expect(page.getByRole("region", { name: /about path/i })).toBeVisible()
    await expect(page.getByText(/Tasks are the atoms inside all three/)).toBeVisible()

    await tabs.filter({ hasText: "Chat" }).click()
    await expect(tabs.filter({ hasText: "Chat" })).toHaveAttribute("aria-selected", "true")
    await expect(page.getByText("⌘J").first()).toBeVisible()
    await expect(page.getByText("⌥1").first()).toBeVisible()
  })
}

test.describe("below md", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("the desktop chrome disappears and the dock becomes a strip with every tab", async ({
    page,
  }) => {
    await page.goto("/app")
    const tablist = page.getByRole("tablist", { name: "Locus tabs" })
    await tablist.scrollIntoViewIfNeeded()
    await expect(tablist.getByRole("tab")).toHaveCount(7)
    // The menu bar is md+ only.
    await expect(page.getByText("File", { exact: true })).toBeHidden()
    // No horizontal page scroll.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
