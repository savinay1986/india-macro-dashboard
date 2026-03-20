"use client";

import { useState } from "react";
import type { SurveyData } from "@/lib/survey";

interface Props {
  survey: SurveyData;
}

export default function SurveyCard({ survey }: Props) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? survey.takeaways : survey.takeaways.slice(0, 4);
  const remaining = survey.takeaways.length - 4;

  return (
    <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Economic Survey {new Date(survey.published).getFullYear()} — Key Takeaways
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          {survey.takeaways.length} insights
        </span>
      </div>

      <ol className="space-y-4">
        {visible.map((t, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{t.headline}</p>
              <p className="text-sm text-slate-600 mt-0.5">{t.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      {!expanded && remaining > 0 && (
        <button
          onClick={() => setExpanded(true)}
          onKeyDown={(e) => e.key === "Enter" && setExpanded(true)}
          className="mt-4 text-sm text-emerald-700 font-medium hover:text-emerald-900 transition-colors"
        >
          + {remaining} more takeaways
        </button>
      )}
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          onKeyDown={(e) => e.key === "Enter" && setExpanded(false)}
          className="mt-4 text-sm text-slate-500 font-medium hover:text-slate-700 transition-colors"
        >
          Show less
        </button>
      )}

      <div className="mt-5 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-400">
          AI-generated summary · {survey.generated_by} · Source: {survey.survey} ({survey.published})
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          Chief Economic Adviser: {survey.authored_by}
        </p>
      </div>
    </div>
  );
}
