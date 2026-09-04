/**
 * Is this User-Agent a real Mac — the only platform that can run the DMG?
 *
 * The trap: iPadOS Safari requests desktop sites by default and reports
 * `Macintosh; Intel Mac OS X`, with no iPad marker anywhere in the string.
 * A UA test alone therefore hands the DMG to iPads, which is precisely the
 * largest slice of the Instagram traffic. So this is only the server's first
 * guess; `refineIsMac` corrects it on the client.
 */
export function isMacUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  // Phones and tablets that identify honestly, checked first: an Android
  // tablet can carry "Mac OS X" inside a WebKit version token.
  if (/iPhone|iPod|iPad|Android|Windows|CrOS|Linux(?!.*Mac)/i.test(userAgent)) {
    return false
  }
  return /Macintosh|Mac OS X/i.test(userAgent)
}

/**
 * Client-side correction for the iPadOS-as-Mac case. No Mac ships a
 * touchscreen, so any touch-capable device claiming to be a Mac is an iPad.
 * Returns the server guess unchanged when it was already `false`.
 */
export function refineIsMac(serverGuess: boolean, maxTouchPoints: number): boolean {
  if (!serverGuess) return false
  return maxTouchPoints <= 1
}
