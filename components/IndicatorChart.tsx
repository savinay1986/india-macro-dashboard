"use client";

import { AreaChart, Card } from "@tremor/react";
import type { DataPoint } from "@/lib/worldbank";
import type { IndicatorMeta } from "@/lib/indicators";

interface Props {
  indicator: IndicatorMeta;
  data: DataPoint[];
  error?: boolean;
}

/** Value formatters keyed by World Bank indicator code. Client-side only. */
const FORMATTERS: Record<string, (v: number) => string> = {
  "NY.GDP.MKTP.KD.ZG": (v) => `${v.toFixed(1)}%`,
  "FP.CPI.TOTL.ZG": (v) => `${v.toFixed(1)}%`,
  "BN.CAB.XOKA.CD": (v) => {
    const b = v / 1_000_000_000;
    return `$${b >= 0 ? "+" : ""}${b.toFixed(1)}B`;
  },
  "BX.KLT.DINV.WD.GD.ZS": (v) => `${v.toFixed(1)}% GDP`,
  "NE.EXP.GNFS.ZS": (v) => `${v.toFixed(1)}% GDP`,
};

const defaultFormatter = (v: number) => v.toFixed(1);

export default function IndicatorChart({ indicator, data, error }: Props) {
  const fmt = FORMATTERS[indicator.code] ?? defaultFormatter;

  const chartData = data.map((d) => ({
    year: d.year,
    [indicator.label]: d.value,
  }));

  const latest = data.filter((d) => d.value !== null).at(-1);

  return (
    <Card className="bg-white border border-slate-200">
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {indicator.label}
        </p>
        {latest && (
          <span className="text-lg font-bold text-slate-900">
            {fmt(latest.value!)}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-3">{indicator.unit}</p>

      {error || data.length === 0 ? (
        <div className="flex items-center justify-center h-24 text-slate-400 text-sm">
          Data unavailable
        </div>
      ) : (
        <AreaChart
          data={chartData}
          index="year"
          categories={[indicator.label]}
          colors={[indicator.color]}
          valueFormatter={fmt}
          showLegend={false}
          showGridLines={false}
          className="h-28"
          connectNulls={false}
        />
      )}

      <p className="text-xs text-slate-400 mt-2">
        Source: World Bank · Data as of {latest?.year ?? "—"} · Updated daily
      </p>
    </Card>
  );
}
