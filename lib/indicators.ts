/**
 * INDICATORS — single source of truth for all 5 macro indicators.
 * Each entry drives: API fetch, chart color, axis label, value formatting.
 */

import type { Color } from "@tremor/react";

/** Serializable subset — safe to pass from Server → Client Component as a prop. */
export interface IndicatorMeta {
  code: string;
  label: string;
  unit: string;
  color: Color;
  headlineSuffix: string;
}

/** Full config including formatter — server-side use only (not passed as prop). */
export interface IndicatorConfig extends IndicatorMeta {
  format: (v: number) => string;
}

export const INDICATORS: IndicatorConfig[] = [
  {
    code: "NY.GDP.MKTP.KD.ZG",
    label: "GDP Growth",
    unit: "% per year",
    color: "emerald",
    format: (v) => `${v.toFixed(1)}%`,
    headlineSuffix: "%",
  },
  {
    code: "FP.CPI.TOTL.ZG",
    label: "CPI Inflation",
    unit: "% per year",
    color: "amber",
    format: (v) => `${v.toFixed(1)}%`,
    headlineSuffix: "%",
  },
  {
    code: "BN.CAB.XOKA.CD",
    label: "Current Account Balance",
    unit: "USD billions",
    color: "blue",
    format: (v) => {
      const b = v / 1_000_000_000;
      return `$${b >= 0 ? "+" : ""}${b.toFixed(1)}B`;
    },
    headlineSuffix: "B",
  },
  {
    code: "BX.KLT.DINV.WD.GD.ZS",
    label: "FDI Net Inflows",
    unit: "% of GDP",
    color: "violet",
    format: (v) => `${v.toFixed(1)}% GDP`,
    headlineSuffix: "% GDP",
  },
  {
    code: "NE.EXP.GNFS.ZS",
    label: "Exports",
    unit: "% of GDP",
    color: "teal",
    format: (v) => `${v.toFixed(1)}% GDP`,
    headlineSuffix: "% GDP",
  },
];
