import posthog from "posthog-js"

// Runs once per page load, before hydration (Next instrumentation-client
// convention). Pageviews, autocapture, UTM/first-touch attribution and web
// vitals all ride on the `defaults` preset; SPA navigations are captured via
// history-change pageviews, so no router hook is needed.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (key) {
  posthog.init(key, {
    // Same-origin proxy (see next.config.ts rewrites) so ad blockers and the
    // Instagram in-app browser don't eat the requests.
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-08-30",
  })
}
