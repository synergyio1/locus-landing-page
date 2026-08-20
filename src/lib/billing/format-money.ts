// Shared by the server-rendered balance and the client poller, so a balance
// never changes shape as it updates.
export function formatUsdCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

// Whole-dollar packs read better unadorned on a button: "Add $5", not
// "Add $5.00". Anything with cents keeps them.
export function formatUsdCentsCompact(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}
