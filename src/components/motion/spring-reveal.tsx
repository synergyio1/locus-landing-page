"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "./use-reduced-motion"

type SpringRevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number
  duration?: number
  as?: keyof React.JSX.IntrinsicElements
  translateY?: number
}

export function SpringReveal({
  delay = 0,
  duration = 520,
  translateY = 12,
  as = "div",
  className,
  style,
  children,
  ...props
}: SpringRevealProps) {
  const reduced = useReducedMotion()
  const ref = React.useRef<HTMLElement | null>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (reduced) {
      setVisible(true)
      return
    }
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  const Tag = as as React.ElementType

  const motionStyle: React.CSSProperties = reduced
    ? style ?? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${translateY}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-slot="spring-reveal"
      data-reduced-motion={reduced ? "true" : "false"}
      className={cn(className)}
      style={motionStyle}
      {...props}
    >
      {children}
    </Tag>
  )
}
