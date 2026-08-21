import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og"
import { findPack, packs } from "@/content/packs"

export const alt = "A Locus pack — a whole coaching method."
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return packs.packs.map((pack) => ({ slug: pack.id }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pack = findPack(slug)
  return renderOgImage({
    eyebrow: pack?.inspiredBy ? `Pack · inspired by ${pack.inspiredBy}` : "Pack",
    title: pack?.name ?? "Packs",
    subtitle: pack?.summary ?? packs.intro,
  })
}
