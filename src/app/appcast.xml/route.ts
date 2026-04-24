export const dynamic = "force-static"

const FEED = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<rss version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Locus for macOS</title>
    <link>https://getlocus.tech/appcast.xml</link>
    <description>Release feed for Locus, consumed by the Sparkle auto-updater.</description>
    <language>en</language>
  </channel>
</rss>
`

export async function GET(): Promise<Response> {
  return new Response(FEED, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  })
}
