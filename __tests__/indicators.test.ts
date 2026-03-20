import { describe, it, expect } from "vitest";
import { INDICATORS } from "@/lib/indicators";

describe("INDICATORS formatters", () => {
  const gdp = INDICATORS.find((i) => i.code === "NY.GDP.MKTP.KD.ZG")!;
  const cpi = INDICATORS.find((i) => i.code === "FP.CPI.TOTL.ZG")!;
  const cad = INDICATORS.find((i) => i.code === "BN.CAB.XOKA.CD")!;
  const fdi = INDICATORS.find((i) => i.code === "BX.KLT.DINV.WD.GD.ZS")!;
  const exp = INDICATORS.find((i) => i.code === "NE.EXP.GNFS.ZS")!;

  it("formats GDP growth correctly", () => {
    expect(gdp.format(7.2)).toBe("7.2%");
    expect(gdp.format(0)).toBe("0.0%");
  });

  it("formats CPI inflation correctly", () => {
    expect(cpi.format(5.5)).toBe("5.5%");
    expect(cpi.format(10.12)).toBe("10.1%");
  });

  it("formats current account balance (positive)", () => {
    expect(cad.format(50_000_000_000)).toBe("$+50.0B");
  });

  it("formats current account balance (negative)", () => {
    expect(cad.format(-30_000_000_000)).toBe("$-30.0B");
  });

  it("formats FDI net inflows", () => {
    expect(fdi.format(2.1)).toBe("2.1% GDP");
  });

  it("formats exports", () => {
    expect(exp.format(21.3)).toBe("21.3% GDP");
  });

  it("all indicators have required fields", () => {
    for (const ind of INDICATORS) {
      expect(ind.code).toBeTruthy();
      expect(ind.label).toBeTruthy();
      expect(ind.unit).toBeTruthy();
      expect(ind.color).toBeTruthy();
    }
  });
});
