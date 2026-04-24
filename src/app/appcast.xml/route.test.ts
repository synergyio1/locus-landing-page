import { describe, expect, it } from "vitest"

import { GET } from "./route"

describe("GET /appcast.xml", () => {
  it("responds 200 with an application/xml content type", async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toMatch(/application\/xml/)
  })

  it("returns a parseable XML document whose root is <rss> with a <channel> child", async () => {
    const response = await GET()
    const body = await response.text()

    const doc = new DOMParser().parseFromString(body, "application/xml")
    expect(doc.querySelector("parsererror")).toBeNull()

    expect(doc.documentElement.tagName).toBe("rss")
    expect(doc.documentElement.querySelector("channel")).not.toBeNull()
  })

  it("returns an empty Sparkle feed (no <item> children yet)", async () => {
    const response = await GET()
    const body = await response.text()
    const doc = new DOMParser().parseFromString(body, "application/xml")

    expect(doc.querySelectorAll("item").length).toBe(0)
  })
})
