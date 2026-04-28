import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"

const fetchMock = vi.fn()
const pathnameRef: { current: string } = { current: "/" }

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameRef.current,
}))

import { ProCta } from "./pro-cta"

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock)
  fetchMock.mockReset()
  pathnameRef.current = "/"
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("<ProCta />", () => {
  describe("logged out", () => {
    it("renders an anchor (not a button) when isAuthed=false", () => {
      render(<ProCta isAuthed={false} cadence="monthly" label="Get Pro" />)
      const link = screen.getByRole("link", { name: /get pro/i })
      expect(link.tagName).toBe("A")
      expect(screen.queryByRole("button", { name: /get pro/i })).toBeNull()
    })

    it("renders a fallback href to /login with the current pathname encoded", () => {
      pathnameRef.current = "/pricing"
      render(<ProCta isAuthed={false} cadence="monthly" label="Get Pro" />)
      const link = screen.getByRole("link", { name: /get pro/i })
      expect(link.getAttribute("href")).toBe(
        "/login?next=%2Fpricing&notice=signin"
      )
    })

    it("on click, navigates with next built from window.location pathname + hash", () => {
      pathnameRef.current = "/"
      Object.defineProperty(window, "location", {
        configurable: true,
        value: {
          pathname: "/",
          hash: "#pricing",
          href: "http://localhost/",
        },
      })

      render(<ProCta isAuthed={false} cadence="monthly" label="Get Pro" />)
      const link = screen.getByRole("link", { name: /get pro/i })

      fireEvent.click(link)

      expect(window.location.href).toBe(
        "/login?next=%2F%23pricing&notice=signin"
      )
    })
  })

  describe("logged in", () => {
    it("renders a button (not a link) when isAuthed=true", () => {
      render(<ProCta isAuthed cadence="monthly" label="Get Pro" />)
      const btn = screen.getByRole("button", { name: /get pro/i })
      expect(btn.tagName).toBe("BUTTON")
      expect(screen.queryByRole("link", { name: /get pro/i })).toBeNull()
    })

    it("starts checkout for the selected cadence on click and redirects to the returned URL", async () => {
      fetchMock.mockResolvedValue(
        new Response(
          JSON.stringify({ url: "https://checkout.stripe.com/c/pay/cs_test" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
      Object.defineProperty(window, "location", {
        configurable: true,
        value: { href: "" },
      })

      render(<ProCta isAuthed cadence="yearly" label="Get Pro" />)
      const btn = screen.getByRole("button", { name: /get pro/i })

      fireEvent.click(btn)

      await waitFor(() => {
        expect(window.location.href).toBe(
          "https://checkout.stripe.com/c/pay/cs_test"
        )
      })

      expect(fetchMock).toHaveBeenCalledWith("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: "yearly" }),
      })
    })

    it("flips the label to 'Redirecting…' while pending", async () => {
      let resolve: (v: Response) => void = () => {}
      fetchMock.mockReturnValue(
        new Promise<Response>((r) => {
          resolve = r
        })
      )

      render(<ProCta isAuthed cadence="monthly" label="Get Pro" />)
      const btn = screen.getByRole("button", { name: /get pro/i })

      fireEvent.click(btn)

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /redirecting/i })
        ).toBeTruthy()
      })

      resolve(
        new Response(JSON.stringify({ url: "https://example.com" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    })

    it("renders an inline alert on http_error", async () => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ error: "boom" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      )

      render(<ProCta isAuthed cadence="monthly" label="Get Pro" />)
      const btn = screen.getByRole("button", { name: /get pro/i })

      fireEvent.click(btn)

      await waitFor(() => {
        expect(screen.getByRole("alert").textContent).toMatch(
          /couldn't start checkout/i
        )
      })
    })
  })
})
