import { chromium } from "playwright"

const browser = await chromium.launch()

async function shot(label, width, height, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    reducedMotion: opts.reducedMotion ?? "no-preference",
  })
  const page = await ctx.newPage()
  await page.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded", timeout: 30000 })
  // Force SpringReveal: nudge scroll + dispatch resize so IntersectionObserver re-evaluates
  await page.evaluate(() => { window.scrollTo(0, 1); window.scrollTo(0, 0); })
  await page.waitForTimeout(2500)
  await page.screenshot({ path: `/tmp/hero-${label}.png`, fullPage: false })
  await ctx.close()
}

await shot("desktop-anim", 1440, 900)
await shot("desktop-reduced", 1440, 900, { reducedMotion: "reduce" })
await shot("mobile-anim", 390, 844)
await browser.close()
console.log("done")
