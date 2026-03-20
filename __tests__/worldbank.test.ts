import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchIndicator } from "@/lib/worldbank";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchIndicator", () => {
  const okResponse = (body: unknown) => ({
    ok: true,
    status: 200,
    json: async () => body,
  });

  it("parses World Bank response shape correctly", async () => {
    mockFetch.mockResolvedValueOnce(
      okResponse([
        { page: 1, total: 2 },
        [
          { date: "2022", value: 7.2 },
          { date: "2021", value: 8.9 },
        ],
      ])
    );

    const data = await fetchIndicator("NY.GDP.MKTP.KD.ZG");
    expect(data).toHaveLength(2);
    // sorted ascending by year
    expect(data[0]).toEqual({ year: "2021", value: 8.9 });
    expect(data[1]).toEqual({ year: "2022", value: 7.2 });
  });

  it("handles null values in response", async () => {
    mockFetch.mockResolvedValueOnce(
      okResponse([{ page: 1, total: 1 }, [{ date: "2023", value: null }]])
    );

    const data = await fetchIndicator("NY.GDP.MKTP.KD.ZG");
    expect(data).toHaveLength(1);
    expect(data[0].value).toBeNull();
  });

  it("returns empty array on fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const data = await fetchIndicator("NY.GDP.MKTP.KD.ZG");
    expect(data).toEqual([]);
  });

  it("returns empty array on HTTP error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const data = await fetchIndicator("BAD.CODE");
    expect(data).toEqual([]);
  });

  it("returns empty array when data array is missing", async () => {
    mockFetch.mockResolvedValueOnce(okResponse([{ page: 1, total: 0 }]));
    const data = await fetchIndicator("NY.GDP.MKTP.KD.ZG");
    expect(data).toEqual([]);
  });
});
