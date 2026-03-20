import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SurveyCard from "@/components/SurveyCard";
import type { SurveyData } from "@/lib/survey";

const makeSurvey = (count: number): SurveyData => ({
  survey: "Economic Survey 2025-26",
  published: "2026-01-29",
  authored_by: "V. Anantha Nageswaran",
  generated_by: "claude-opus-4",
  pages_extracted: 120,
  takeaways: Array.from({ length: count }, (_, i) => ({
    headline: `Takeaway ${i + 1}`,
    detail: `Detail for takeaway ${i + 1}`,
  })),
});

describe("SurveyCard", () => {
  it("renders the survey year in the heading", () => {
    render(<SurveyCard survey={makeSurvey(5)} />);
    expect(screen.getByText(/Economic Survey 2026/)).toBeInTheDocument();
  });

  it("shows only first 4 takeaways by default when there are more", () => {
    render(<SurveyCard survey={makeSurvey(10)} />);
    expect(screen.getByText("Takeaway 4")).toBeInTheDocument();
    expect(screen.queryByText("Takeaway 5")).not.toBeInTheDocument();
  });

  it("shows expand button with correct count when there are more than 4", () => {
    render(<SurveyCard survey={makeSurvey(10)} />);
    expect(screen.getByText(/\+ 6 more takeaways/)).toBeInTheDocument();
  });

  it("expands to show all takeaways on button click", () => {
    render(<SurveyCard survey={makeSurvey(10)} />);
    fireEvent.click(screen.getByText(/\+ 6 more takeaways/));
    expect(screen.getByText("Takeaway 10")).toBeInTheDocument();
  });

  it("shows 'Show less' button after expanding", () => {
    render(<SurveyCard survey={makeSurvey(10)} />);
    fireEvent.click(screen.getByText(/\+ 6 more takeaways/));
    expect(screen.getByText("Show less")).toBeInTheDocument();
  });

  it("collapses back on 'Show less' click", () => {
    render(<SurveyCard survey={makeSurvey(10)} />);
    fireEvent.click(screen.getByText(/\+ 6 more takeaways/));
    fireEvent.click(screen.getByText("Show less"));
    expect(screen.queryByText("Takeaway 5")).not.toBeInTheDocument();
  });

  it("shows all items without expand button when count <= 4", () => {
    render(<SurveyCard survey={makeSurvey(3)} />);
    expect(screen.getByText("Takeaway 3")).toBeInTheDocument();
    expect(screen.queryByText(/more takeaways/)).not.toBeInTheDocument();
  });

  it("shows AI attribution line", () => {
    render(<SurveyCard survey={makeSurvey(2)} />);
    expect(screen.getByText(/AI-generated summary/)).toBeInTheDocument();
  });
});
