import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"

const { capture, setPersonProperties } = vi.hoisted(() => ({
  capture: vi.fn(),
  setPersonProperties: vi.fn(),
}))

vi.mock("posthog-js", () => ({
  default: { capture, setPersonProperties },
}))

import { DownloadCta } from "./download-cta"

function setTouchPoints(value: number) {
  Object.defineProperty(window.navigator, "maxTouchPoints", {
    value,
    configurable: true,
  })
}

describe("DownloadCta", () => {
  beforeEach(() => {
    capture.mockReset()
    setPersonProperties.mockReset()
    setTouchPoints(0)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it("offers the DMG to a Mac", () => {
    render(<DownloadCta initialIsMac />)

    const link = screen.getByRole("link", { name: /download the macOS DMG/i })
    expect(link.getAttribute("href")).toContain(".dmg")
    expect(screen.queryByRole("textbox")).toBeNull()
  })

  it("offers the email form when the server says this is not a Mac", () => {
    render(<DownloadCta initialIsMac={false} />)

    expect(screen.getByText(/Locus is a Mac app/i)).toBeTruthy()
    expect(screen.getByRole("button", { name: /send me the link/i })).toBeTruthy()
    expect(screen.queryByRole("link", { name: /DMG/i })).toBeNull()
  })

  it("demotes an iPad that the user agent reported as a Mac", async () => {
    setTouchPoints(5)
    render(<DownloadCta initialIsMac />)

    await waitFor(() => {
      expect(screen.getByText(/Locus is a Mac app/i)).toBeTruthy()
    })
    expect(screen.queryByRole("link", { name: /DMG/i })).toBeNull()
  })

  it("sends the address and records the request against the ad's person", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true })))
    vi.stubGlobal("fetch", fetchMock)

    render(<DownloadCta initialIsMac={false} />)

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "reader@example.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: /send me the link/i }))

    await waitFor(() => {
      expect(screen.getByText(/check your inbox/i)).toBeTruthy()
    })

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/mac-link",
      expect.objectContaining({ method: "POST" })
    )
    expect(setPersonProperties).toHaveBeenCalledWith({
      email: "reader@example.com",
    })
    expect(capture).toHaveBeenCalledWith("mac_link_requested", {
      platform: "non_mac",
    })
  })

  it("keeps the form up and stays quiet in PostHog when the send fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 500 }))
    )

    render(<DownloadCta initialIsMac={false} />)

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "reader@example.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: /send me the link/i }))

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toMatch(/couldn't send/i)
    })
    expect(capture).not.toHaveBeenCalled()
    expect(screen.queryByText(/check your inbox/i)).toBeNull()
  })

  it("catches a malformed address before making a request", () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    render(<DownloadCta initialIsMac={false} />)

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "nope" },
    })
    fireEvent.click(screen.getByRole("button", { name: /send me the link/i }))

    expect(screen.getByRole("alert").textContent).toMatch(/doesn't look right/i)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
