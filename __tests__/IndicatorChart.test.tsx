import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import IndicatorChart from "@/components/IndicatorChart";
import { INDICATORS } from "@/lib/indicators";
import type { DataPoint } from "@/lib/worldbank";

// Tremor uses ResizeObserver — stub it
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const gdpIndicator = INDICATORS[0];

const mockData: DataPoint[] = [
  { year: "2020", value: 6.1 },
  { year: "2021", value: 8.9 },
  { year: "2022", value: 7.2 },
];

describe("IndicatorChart", () => {
  it("renders the indicator label", () => {
    render(<IndicatorChart indicator={gdpIndicator} data={mockData} />);
    expect(screen.getByText("GDP Growth")).toBeInTheDocument();
  });

  it("shows data unavailable when error=true", () => {
    render(<IndicatorChart indicator={gdpIndicator} data={mockData} error={true} />);
    expect(screen.getByText(/Data unavailable/i)).toBeInTheDocument();
  });

  it("shows data unavailable when data is empty", () => {
    render(<IndicatorChart indicator={gdpIndicator} data={[]} />);
    expect(screen.getByText(/Data unavailable/i)).toBeInTheDocument();
  });

  it("shows World Bank source attribution", () => {
    render(<IndicatorChart indicator={gdpIndicator} data={mockData} />);
    expect(screen.getByText(/World Bank/i)).toBeInTheDocument();
  });
});
