import { SiteNavClient } from "@/components/site-nav-client"
import { createServerClient } from "@/lib/supabase/server"

export async function SiteNav() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <SiteNavClient email={user?.email ?? null} />
}
