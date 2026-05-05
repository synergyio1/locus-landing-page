/**
 * PersonaSection content — typed source of truth for the tabbed "Locus in
 * your work" section between Day-in-Locus and Pricing. Visitors see the
 * generic hero first, hear the Day-in-Locus narrative, then arrive here
 * and switch tabs to find someone with their job.
 *
 * PERSONAS-02 shipped Maya (`designer`). PERSONAS-03 added Dev
 * (`developer`). PERSONAS-04 completes the set with Frida (`founder`) and
 * Pim (`product`). Layout renders cleanly with all four tabs.
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
    {
      id: "developer",
      initials: "DS",
      name: "Dev Singh",
      role: "Senior iOS Engineer",
      blurb:
        "An iOS engineer at a payments-infrastructure startup. iOS 18 migration on a tight ship-by date, code-review queue every morning, Xcode + Cursor + Terminal all day.",
      tools: ["Xcode", "Cursor", "GitHub", "Linear"],
      anchor: {
        src: "/screenshots/screens/developer/dark/CommandView_running.png",
        alt: "Locus running a focus session on Dev's iOS 18 migration project, with Xcode and Cursor windows classified as on-track.",
        width: 2880,
        height: 1800,
      },
      supporting: {
        src: "/screenshots/screens/developer/dark/ProjectDetail.png",
        alt: "Dev's iOS 18 migration — project detail view showing the URLSession migration on AddressService with deadline tracking and linked tasks.",
        width: 2880,
        height: 1800,
      },
    },
    {
      id: "founder",
      initials: "FH",
      name: "Frida Hernández",
      role: "Founder, Series A SaaS",
      blurb:
        "A second-time founder running a finance-ops B2B SaaS. Q2 board deck mid-progress, 47-day journaling streak, Pages + Notion + Stripe protecting the writing time the meeting/Slack hurricane wants to take.",
      tools: ["Pages", "Notion", "Calendar", "Stripe"],
      anchor: {
        src: "/screenshots/screens/founder/dark/CommandView_running.png",
        alt: "Locus running a focus session on Frida's Q2 board deck project, with Pages and Notion windows classified as on-track and Slack as work-but-shallow.",
        width: 2880,
        height: 1800,
      },
      supporting: {
        src: "/screenshots/screens/founder/dark/ProjectDetail.png",
        alt: "Frida's Q2 board deck — project detail view showing the cohort retention argument with deadline tracking and linked tasks.",
        width: 2880,
        height: 1800,
      },
    },
    {
      id: "product",
      initials: "PT",
      name: "Pim Tanaka",
      role: "Senior Product Manager",
      blurb:
        "A growth PM at a B2B sales-enablement company. PRD on a tight scoping deadline, daily metrics scan, Notion + Linear + Looker carrying the structured-thinking work that doesn't fit between meetings.",
      tools: ["Notion", "Linear", "Looker", "Pages"],
      anchor: {
        src: "/screenshots/screens/product/dark/CommandView_running.png",
        alt: "Locus running a focus session on Pim's collaborative comments PRD, with Notion and Linear windows classified as on-track.",
        width: 2880,
        height: 1800,
      },
      supporting: {
        src: "/screenshots/screens/product/dark/ProjectDetail.png",
        alt: "Pim's PRD — collaborative comments — project detail view showing the activation hypotheses with deadline tracking and linked tasks.",
        width: 2880,
        height: 1800,
      },
    },
  ],
}
