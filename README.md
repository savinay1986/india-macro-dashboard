# India Macro Dashboard

AI-synthesized Economic Survey insights + live World Bank indicators, free and public.

## What it shows

| Indicator | Source | Frequency |
|---|---|---|
| GDP Growth (% per year) | World Bank | Annual |
| CPI Inflation (% per year) | World Bank | Annual |
| Current Account Balance (USD) | World Bank | Annual |
| FDI Net Inflows (% of GDP) | World Bank | Annual |
| Exports (% of GDP) | World Bank | Annual |
| Economic Survey 2025-26 takeaways | Ministry of Finance / AI summary | One-time |

## Architecture

```
app/page.tsx (Server Component, ISR 24h)
  ├── Promise.allSettled → fetchIndicator × 5  (lib/worldbank.ts)
  ├── parseSurvey(surveyRaw)                   (lib/survey.ts + Zod)
  ├── Headline stats strip (GDP, CPI, CAD)
  ├── SurveyCard                               (components/SurveyCard.tsx)
  └── IndicatorChart × 5                       (components/IndicatorChart.tsx)
```

- **ISR**: page regenerates every 24h (`export const revalidate = 86400`)
- **Fault-tolerant**: `Promise.allSettled` — one API failure shows "Data unavailable" for that chart, rest still render
- **Survey**: pre-generated JSON (`data/survey-summary-2025-26.json`) via Claude API + pypdf — not called at runtime

## Development

```bash
npm install --legacy-peer-deps
npm run dev       # http://localhost:3000
npm test          # 29 Vitest tests
npm run build     # production build
```

## Testing

29 Vitest + @testing-library/react tests across 5 files:

```
__tests__/worldbank.test.ts       — API parsing, error paths
__tests__/indicators.test.ts      — value formatters
__tests__/survey.test.ts          — Zod schema validation
__tests__/IndicatorChart.test.tsx — render, empty/error states
__tests__/SurveyCard.test.tsx     — expand/collapse, accessibility
```

## Data sources

- **World Bank Open Data**: `api.worldbank.org/v2/country/IN/indicator/{code}`
- **Economic Survey 2025-26**: Ministry of Finance → AI summary via Claude API

## Deploy

```bash
# Vercel (recommended)
vercel deploy

# Or any Node.js host supporting Next.js ISR
npm run build && npm start
```
