import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"
import { act, cleanup, render, screen } from "@testing-library/react"

const { replaceMock, refreshMock, router } = vi.hoisted(() => {
  const replaceMock = vi.fn()
  const refreshMock = vi.fn()
  // Stable identity, like the real App Router hook — a fresh object each
  // render would restart the polling effect and double-poll.
  return {
    replaceMock,
    refreshMock,
    router: { replace: replaceMock, refresh: refreshMock, push: vi.fn() },
  }
})

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}))

import { CreditBalance } from "./credit-balance"

const fetchMock = vi.fn()

function balanceResponse(cents: number) {
  return {
    ok: true,
    json: async () => ({ creditBalanceCents: cents }),
  } as unknown as Response
}

describe("CreditBalance", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    fetchMock.mockReset()
    replaceMock.mockReset()
    refreshMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("renders the balance and polls nothing outside a checkout return", async () => {
    render(<CreditBalance balanceCents={1234} checkoutPending={false} />)

    expect(screen.getByTestId("remote-credits-balance").textContent).toBe(
      "$12.34"
    )
    expect(screen.queryByRole("status")).toBeNull()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000)
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  // The grant lands on the webhook, a beat after Stripe redirects back.
  it("adopts the granted balance and clears the pending query param", async () => {
    fetchMock
      .mockResolvedValueOnce(balanceResponse(0))
      .mockResolvedValueOnce(balanceResponse(500))

    render(<CreditBalance balanceCents={0} checkoutPending />)

    expect(screen.getByRole("status").textContent).toMatch(
      /adding your credits/i
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(screen.getByTestId("remote-credits-balance").textContent).toBe(
      "$0.00"
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(screen.getByTestId("remote-credits-balance").textContent).toBe(
      "$5.00"
    )
    expect(replaceMock).toHaveBeenCalledWith("/account")
    expect(refreshMock).toHaveBeenCalledOnce()
    expect(screen.queryByRole("status")).toBeNull()
  })

  it("keeps polling through a transient failure", async () => {
    fetchMock
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(balanceResponse(2000))

    render(<CreditBalance balanceCents={0} checkoutPending />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000)
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(screen.getByTestId("remote-credits-balance").textContent).toBe(
      "$20.00"
    )
  })

  it("does not restart when the refreshed server balance arrives late", async () => {
    fetchMock.mockResolvedValue(balanceResponse(500))

    const { rerender } = render(
      <CreditBalance balanceCents={0} checkoutPending />
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(screen.getByTestId("remote-credits-balance").textContent).toBe(
      "$5.00"
    )

    // The server render catches up while ?credits=pending is still in the URL.
    rerender(<CreditBalance balanceCents={500} checkoutPending />)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(40_000)
    })

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(screen.queryByRole("status")).toBeNull()
  })

  it("gives up after thirty seconds and says so", async () => {
    fetchMock.mockResolvedValue(balanceResponse(0))

    render(<CreditBalance balanceCents={0} checkoutPending />)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(31_000)
    })

    expect(screen.getByRole("status").textContent).toMatch(/still settling/i)
    const callsAtDeadline = fetchMock.mock.calls.length

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000)
    })
    expect(fetchMock).toHaveBeenCalledTimes(callsAtDeadline)
  })
})
