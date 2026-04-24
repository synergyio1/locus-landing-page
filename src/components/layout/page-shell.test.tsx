import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { PageShell } from "./page-shell"

describe("PageShell", () => {
  it("applies the 1400px max width container", () => {
    render(
      <PageShell data-testid="shell">
        <p>content</p>
      </PageShell>
    )

    const shell = screen.getByTestId("shell")
    expect(shell.className).toContain("max-w-[1400px]")
    expect(shell.className).toContain("mx-auto")
  })
})
