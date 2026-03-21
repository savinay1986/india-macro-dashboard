import { describe, it, expect } from "vitest";
import { formatCAD } from "../lib/format";

// Regression: ISSUE-001 — headline Current Account Balance showed "$32B" instead of "-$32B" for negative values
// Found by /qa on 2026-03-20
// Report: .gstack/qa-reports/qa-report-localhost-2026-03-20.md
//
// Root cause: formatCAD in app/page.tsx used `${b >= 0 ? "+" : ""}${Math.abs(b).toFixed(0)}B`
// which dropped the "$" prefix and the negative sign for negative values.
// Fix: `${b >= 0 ? "+$" : "-$"}${Math.abs(b).toFixed(0)}B`

describe("formatCAD (headline Current Account formatter)", () => {
  it("shows negative sign and dollar prefix for negative values", () => {
    // This was the bug: -32B showed as "$32B" instead of "-$32B"
    expect(formatCAD(-32_000_000_000)).toBe("-$32B");
    expect(formatCAD(-105_000_000_000)).toBe("-$105B");
  });

  it("shows positive sign and dollar prefix for positive values", () => {
    expect(formatCAD(50_000_000_000)).toBe("+$50B");
    expect(formatCAD(1_000_000_000)).toBe("+$1B");
  });

  it("rounds to integer billions", () => {
    expect(formatCAD(-32_400_000_000)).toBe("-$32B");
    expect(formatCAD(50_900_000_000)).toBe("+$51B");
  });
});
