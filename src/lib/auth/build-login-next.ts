export function buildLoginNext(
  pathname: string | null | undefined,
  hash: string | null | undefined
): string {
  const safePath =
    typeof pathname === "string" &&
    pathname.startsWith("/") &&
    !pathname.startsWith("//")
      ? pathname
      : "/"

  if (!hash) return safePath

  const frag = hash.startsWith("#") ? hash : `#${hash}`
  if (frag === "#") return safePath
  return `${safePath}${frag}`
}
