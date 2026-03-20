# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.0.0] - 2026-03-20

### Added
- `lib/worldbank.ts`: Typed World Bank API client (`fetchIndicator`) with ISR cache (`next: { revalidate: 86400 }`), `Promise.allSettled` fault tolerance, and graceful empty-array fallback on any error
- `lib/indicators.ts`: `INDICATORS` config array — 5 indicators (GDP, CPI, Current Account, FDI, Exports) with World Bank codes, semantic Tremor colors, unit labels, and value formatters. Split into serializable `IndicatorMeta` (safe for server→client props) and `IndicatorConfig` (server-side only)
- `lib/survey.ts`: Zod schema for Economic Survey JSON — validates `survey`, `published`, `authored_by`, `generated_by`, `pages_extracted`, and `takeaways[]` at runtime
- `data/survey-summary-2025-26.json`: Pre-generated AI summary of India's Economic Survey 2025-26 (10 takeaways via Claude API + pypdf)
- `components/IndicatorChart.tsx`: Tremor `AreaChart` client component — per-indicator semantic colors, latest-value badge, "Data unavailable" empty/error state, World Bank attribution footer
- `components/SurveyCard.tsx`: Expandable takeaways list — shows first 4, "show all N" expand button, keyboard-accessible (Enter key), AI attribution caption
- `app/page.tsx`: ISR server component — parallel `Promise.allSettled` fetches for all 5 indicators, headline stats strip (GDP / CPI / Current Account), survey card, 3-column indicator chart grid
- `app/layout.tsx`: Inter font via `next/font/google`, `bg-slate-50` body, OG metadata
- `lib/format.ts`: Exported `formatCAD` formatter (extracted from `app/page.tsx` for testability — regression test imports the real function)
- Vitest test suite: 32 tests across 6 files covering all library functions, component states, and error paths
- `.github/workflows/test.yml` CI pipeline running tests on push + PR

### Fixed
- Current Account Balance headline showed `$32B` for negative balances — missing `-` sign and `$` prefix. `formatCAD` now produces `-$32B` / `+$32B` correctly (ISSUE-001)
