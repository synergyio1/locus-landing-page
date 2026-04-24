export type ChangelogEntry = {
  version: string
  date: string
  summary?: string
  added: string[]
  improved: string[]
  fixed: string[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: "v0.1.0",
    date: "2026-04-23",
    summary: "Initial release.",
    added: ["First public build of Locus for macOS."],
    improved: [],
    fixed: [],
  },
]
