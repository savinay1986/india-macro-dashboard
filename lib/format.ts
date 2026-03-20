/**
 * Format a Current Account balance value (in absolute USD) as a signed billion-dollar string.
 * e.g. -32_000_000_000 → "-$32B", 50_000_000_000 → "+$50B"
 */
export function formatCAD(v: number): string {
  const b = v / 1_000_000_000;
  return `${b >= 0 ? "+$" : "-$"}${Math.abs(b).toFixed(0)}B`;
}
