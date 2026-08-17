import { describe, expect, it } from "vitest"

import {
  hasBalancedInlineMarks,
  listInlineMarks,
  splitInlineMarks,
  stripInlineMarks,
} from "./inline-marks"

describe("inline marks", () => {
  it("splits plain and marked runs in reading order", () => {
    expect(splitInlineMarks("Born of ==necessity==: a ==system== we trust.")).toEqual([
      { text: "Born of ", marked: false },
      { text: "necessity", marked: true },
      { text: ": a ", marked: false },
      { text: "system", marked: true },
      { text: " we trust.", marked: false },
    ])
  })

  it("returns one plain run when nothing is marked", () => {
    expect(splitInlineMarks("Plain sentence.")).toEqual([
      { text: "Plain sentence.", marked: false },
    ])
  })

  it("lists and strips marks", () => {
    const text = "==so your mind can be present== in what is in front of you"
    expect(listInlineMarks(text)).toEqual(["so your mind can be present"])
    expect(stripInlineMarks(text)).toBe(
      "so your mind can be present in what is in front of you"
    )
  })

  it("flags a stray delimiter", () => {
    expect(hasBalancedInlineMarks("a ==b== c")).toBe(true)
    expect(hasBalancedInlineMarks("a ==b c")).toBe(false)
    expect(hasBalancedInlineMarks("a == b == c ==")).toBe(false)
  })
})
