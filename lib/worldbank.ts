/**
 * World Bank API client for India macroeconomic indicators.
 *
 * Response shape:
 *   [{ page, pages, total }, [{ date, value, ... }, ...]]
 *   Index 0 = pagination metadata (ignored)
 *   Index 1 = data array
 */

export interface DataPoint {
  year: string;
  value: number | null;
}

interface WBMeta {
  page: number;
  pages: number;
  per_page: number;
  total: number;
}

interface WBRecord {
  date: string;
  value: number | null;
  indicator: { id: string; value: string };
  country: { id: string; value: string };
}

type WBResponse = [WBMeta, WBRecord[]];

const BASE_URL = "https://api.worldbank.org/v2/country/IN/indicator";

export async function fetchIndicator(code: string): Promise<DataPoint[]> {
  const url = `${BASE_URL}/${code}?format=json&per_page=30&mrv=30`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) {
      console.error(`WB API ${code}: HTTP ${res.status}`);
      return [];
    }
    const json: WBResponse = await res.json();
    if (!Array.isArray(json) || json.length < 2 || !Array.isArray(json[1])) {
      console.error(`WB API ${code}: unexpected response shape`);
      return [];
    }
    return json[1]
      .map((r) => ({ year: r.date, value: r.value }))
      .sort((a, b) => Number(a.year) - Number(b.year));
  } catch (err) {
    console.error(`WB API ${code}: fetch failed`, err);
    return [];
  }
}
