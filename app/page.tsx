export const revalidate = 86400; // ISR: regenerate every 24 hours

import { INDICATORS } from "@/lib/indicators";
import { fetchIndicator, type DataPoint } from "@/lib/worldbank";
import { parseSurvey } from "@/lib/survey";
import surveyRaw from "@/data/survey-summary-2025-26.json";
import IndicatorChart from "@/components/IndicatorChart";
import SurveyCard from "@/components/SurveyCard";

export default async function Home() {
  // Fetch all 5 indicators in parallel; Promise.allSettled so a single failure
  // doesn't kill the whole page
  const results = await Promise.allSettled(
    INDICATORS.map((ind) => fetchIndicator(ind.code))
  );

  // Parse and Zod-validate the pre-generated survey summary
  let survey;
  let surveyError = false;
  try {
    survey = parseSurvey(surveyRaw);
  } catch (e) {
    console.error("Survey JSON schema validation failed:", e);
    surveyError = true;
  }

  // Pull the latest value for the 3 headline stats (GDP, CPI, CAD)
  const gdpData = results[0].status === "fulfilled" ? results[0].value : [];
  const cpiData = results[1].status === "fulfilled" ? results[1].value : [];
  const cadData = results[2].status === "fulfilled" ? results[2].value : [];

  const latestGDP = gdpData.filter((d) => d.value !== null).at(-1);
  const latestCPI = cpiData.filter((d) => d.value !== null).at(-1);
  const latestCAD = cadData.filter((d) => d.value !== null).at(-1);

  const formatCAD = (v: number) => {
    const b = v / 1_000_000_000;
    return `${b >= 0 ? "+" : ""}$${Math.abs(b).toFixed(0)}B`;
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">India Macro Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          AI-synthesized Economic Survey insights + live World Bank indicators,
          free and public.
        </p>
      </div>

      {/* Headline stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium">GDP Growth</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {latestGDP ? `${latestGDP.value?.toFixed(1)}%` : "—"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{latestGDP?.year ?? ""}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium">CPI Inflation</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {latestCPI ? `${latestCPI.value?.toFixed(1)}%` : "—"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{latestCPI?.year ?? ""}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium">Current Account</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {latestCAD ? formatCAD(latestCAD.value!) : "—"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{latestCAD?.year ?? ""}</p>
        </div>
      </div>

      {/* Economic Survey summary card */}
      <div className="mb-8">
        {surveyError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            Survey data unavailable — schema validation failed.
          </div>
        ) : survey ? (
          <SurveyCard survey={survey} />
        ) : null}
      </div>

      {/* Indicator chart grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDICATORS.map(({ format: _format, ...meta }, i) => (
          <IndicatorChart
            key={meta.code}
            indicator={meta}
            data={results[i].status === "fulfilled" ? (results[i] as PromiseFulfilledResult<DataPoint[]>).value : []}
            error={results[i].status === "rejected"}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-slate-200 text-xs text-slate-400">
        Data sources: World Bank Open Data · Ministry of Finance (Economic Survey) ·
        Built with Next.js + Tremor · Open source
      </div>
    </main>
  );
}
