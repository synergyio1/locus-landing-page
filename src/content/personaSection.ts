/**
 * PersonaSection content — typed source of truth for the tabbed "Locus in
 * your work" section between Day-in-Locus and Pricing. Visitors see the
 * generic hero first, hear the Day-in-Locus narrative, then arrive here
 * and switch tabs to find someone with their job.
 *
 * PERSONAS-02 ships only Maya (`designer`). PERSONAS-03 / -04 will
 * append Dev / Frida / Pim. Layout must render cleanly with 1 → 4 tabs.
 */

export type PersonaTabId = "designer" | "developer" | "founder" | "product"

export type PersonaScreenshot = {
  src: string
  alt: string
  width: number
  height: number
}

export type PersonaTab = {
  id: PersonaTabId
  /** Initial(s) for the avatar pill. */
  initials: string
  /** Display name — first + last is fine. */
  name: string
  /** Role line under the name. */
  role: string
  /** One-line summary of the persona's working life. */
  blurb: string
  /** Bundle-ID-ish "tools they use" pills, max ~4. */
  tools: string[]
  /** Anchor PNG — the running-session shot for that persona. */
  anchor: PersonaScreenshot
  /** Supporting PNG — the strongest-narrative ProjectDetail shot. */
  supporting: PersonaScreenshot
}

export type PersonaSectionContent = {
  id: string
  eyebrow: string
  headline: string
  body: string
  defaultTab: PersonaTabId
  tabs: PersonaTab[]
}

export const personaSection: PersonaSectionContent = {
  id: "personas",
  eyebrow: "See Locus in your work",
  headline: "Whose Locus would you like to look at?",
  body: "The hero above shows what Locus looks like in general. Switch tabs to see what Locus looks like for someone with your job — same product, your projects, your tools, your shape of day.",
  defaultTab: "designer",
  tabs: [
    {
      id: "designer",
      initials: "ML",
      name: "Maya Lin",
      role: "Senior Product Designer",
      blurb:
        "A designer at a Series B fintech. Q2 onboarding redesign mid-progress, sketch warm-up streak, Figma + Linear all day.",
      tools: ["Figma", "Linear", "Notion", "Pages"],
      anchor: {
        src: "/screenshots/screens/designer/dark/CommandView_running.png",
        alt: "Locus running a focus session on Maya's Q2 onboarding redesign project, with a Figma window classified as on-track.",
        width: 2880,
        height: 1800,
      },
      supporting: {
        src: "/screenshots/screens/designer/dark/ProjectDetail.png",
        alt: "Maya's Q2 onboarding redesign — project detail view showing 18 of 28 sessions logged with linked Dribbble references in the notes canvas.",
        width: 2880,
        height: 1800,
      },
    },
  ],
}
