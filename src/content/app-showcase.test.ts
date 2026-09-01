import fs from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { appShowcase, type ShowcaseScreen } from "./app-showcase"

// The six subtitles, verbatim from the app's sidebar
// (pomodoro-preview/…/LocusUI/SidebarTab.swift, PRD #725). Sidebar order is
// shortcut order there, so the order here is load-bearing too.
const SIDEBAR: Array<[label: string, subtitle: string]> = [
  ["Home", "How it's going, across everything"],
  ["Vision", "Where you're going"],
  ["Path", "How you get there"],
  ["Execution", "When, and what happened"],
  ["Notes", "Capture and analyze"],
  ["System", "Your autopilot"],
]

// Tab names retired by the re-org. "Tasks"/"Commitments" survive as Path's
// panes and "Portrait" as Vision's second half — fine as words, never as tabs.
const RETIRED_TAB_NAMES = ["Focus", "Watch", "Flywheel", "Intelligence", "Tasks", "Commitments", "Portrait", "Memory", "Routines"]
const RETIRED_WORDS = /\b(Flywheel|Intelligence|Routines?|Sentinel)\b/

function readPngSize(file: string): { width: number; height: number } {
  const buf = fs.readFileSync(file)
  expect(buf.subarray(1, 4).toString("ascii"), `${file} is a PNG`).toBe("PNG")
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

function allScreens(): Array<[owner: string, screen: ShowcaseScreen]> {
  return [
    ...appShowcase.tabs.flatMap((tab) =>
      tab.panes.map((pane): [string, ShowcaseScreen] => [`${tab.label} › ${pane.label}`, pane.screen])
    ),
    ["Chat", appShowcase.chat.screen],
  ]
}

describe("app showcase content", () => {
  it("names the six tabs in sidebar order, with the app's own subtitles", () => {
    expect(appShowcase.tabs.map((t) => [t.label, t.subtitle])).toEqual(SIDEBAR)
    expect(new Set(appShowcase.tabs.map((t) => t.id)).size).toBe(6)
    for (const tab of appShowcase.tabs) {
      expect(tab.subtitle, tab.label).not.toMatch(/\.$/) // sidebar style
    }
  })

  it("never resurrects a retired tab", () => {
    for (const tab of appShowcase.tabs) {
      expect(RETIRED_TAB_NAMES, tab.label).not.toContain(tab.label)
    }
    expect(JSON.stringify(appShowcase)).not.toMatch(RETIRED_WORDS)
  })

  it("gives Path its two panes and every other tab one", () => {
    for (const tab of appShowcase.tabs) {
      if (tab.id === "path") {
        expect(tab.panes.map((p) => p.label)).toEqual(["Commitments", "Tasks"])
      } else {
        expect(tab.panes, tab.label).toHaveLength(1)
      }
    }
  })

  it("keeps chat as the titlebar surface, reachable by keyboard and by voice", () => {
    expect(appShowcase.chat.shortcut).toBe("⌘J")
    expect(appShowcase.chat.voiceShortcut).toBe("⌥1")
    expect(appShowcase.chat.caption).toContain("⌥1")
    expect(appShowcase.intro).toContain("⌥1")
    expect(appShowcase.chat.controls.autonomy).toEqual(["Ask", "Standard", "Auto"])
    expect(appShowcase.chat.controls.depth).toEqual(["Fast", "Deep"])
  })

  it("keeps captions short and the write-ups concise", () => {
    const entries = [...appShowcase.tabs, appShowcase.chat]
    for (const entry of entries) {
      expect(entry.caption.length, entry.label).toBeLessThanOrEqual(200)
      expect(entry.body.length, entry.label).toBeGreaterThanOrEqual(1)
      // Luis (2026-09-01): "a bit more concise" — one short paragraph, two for chat.
      expect(entry.body.join(" ").length, entry.label).toBeLessThanOrEqual(420)
      for (const paragraph of entry.body) {
        expect(paragraph.length, entry.label).toBeGreaterThan(40)
        expect(paragraph.length, entry.label).toBeLessThanOrEqual(320)
      }
      expect(entry.headline.length, entry.label).toBeGreaterThan(0)
      expect(entry.handoff.length, entry.label).toBeGreaterThan(0)
    }
  })

  it("points every screen at a light capture that exists at its declared size", () => {
    const missing: string[] = []
    for (const [owner, screen] of allScreens()) {
      expect(screen.src, owner).toMatch(/^\/app\/screens\/[a-z0-9-]+\.png$/)
      expect(screen.alt, owner).toBeTruthy()
      expect(screen.alt, owner).not.toMatch(/^(screenshot|image|picture)/i)
      expect(screen.width, owner).toBe(2784)
      expect(screen.height, owner).toBe(1824)

      const file = path.join(process.cwd(), "public", screen.src)
      if (!fs.existsSync(file)) {
        missing.push(`${owner} → public${screen.src}`)
        continue
      }
      expect(readPngSize(file), owner).toEqual({ width: screen.width, height: screen.height })
    }
    expect(
      missing,
      `Captures missing under public/app/screens — drop the 2784×1824 light captures in:\n  ${missing.join("\n  ")}`
    ).toEqual([])
  })

  it("carries the section anchor and a slow, in-view-only auto-advance", () => {
    expect(appShowcase.id).toBe("showcase")
    expect(appShowcase.autoAdvanceMs).toBeGreaterThanOrEqual(5000)
  })
})
