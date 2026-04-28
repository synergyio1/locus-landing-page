export function initialsFromEmail(email: string | null | undefined): string {
  if (!email) return ""
  const at = email.indexOf("@")
  const local = at === -1 ? email : email.slice(0, at)
  const tokens = local
    .split(/[._\-+]+/)
    .map((token) => [...token])
    .filter((chars) => chars.length > 0)

  if (tokens.length === 0) return ""

  if (tokens.length >= 2) {
    return (tokens[0][0] + tokens[1][0]).toLocaleUpperCase()
  }

  const chars = tokens[0]
  if (chars.length === 1) return chars[0].toLocaleUpperCase()
  return (chars[0] + chars[1]).toLocaleUpperCase()
}
