"use client"

import * as React from "react"

type UseAutoCycleArgs = {
  length: number
  intervalMs: number
  paused: boolean
  reduced: boolean
}

type UseAutoCycleReturn = {
  activeIndex: number
  setActiveIndex: (next: number) => void
}

export function useAutoCycle({
  length,
  intervalMs,
  paused,
  reduced,
}: UseAutoCycleArgs): UseAutoCycleReturn {
  const [activeIndex, setActiveIndexState] = React.useState(0)
  const tickRef = React.useRef(0)

  const setActiveIndex = React.useCallback(
    (next: number) => {
      tickRef.current += 1
      setActiveIndexState(((next % length) + length) % length)
    },
    [length]
  )

  React.useEffect(() => {
    if (reduced || paused || length <= 1) return
    const myTick = tickRef.current
    const timer = window.setTimeout(() => {
      if (tickRef.current !== myTick) return
      setActiveIndexState((current) => (current + 1) % length)
      tickRef.current += 1
    }, intervalMs)
    return () => window.clearTimeout(timer)
  }, [activeIndex, intervalMs, length, paused, reduced])

  return { activeIndex, setActiveIndex }
}
