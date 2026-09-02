import { PostHogIdentify } from "@/components/analytics/posthog-identify"
import { SiteNavClient } from "@/components/site-nav-client"
import { createServerClient } from "@/lib/supabase/server"

export async function SiteNav() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <PostHogIdentify
        userId={user?.id ?? null}
        email={user?.email ?? null}
      />
      <SiteNavClient email={user?.email ?? null} />
    </>
  )
}
