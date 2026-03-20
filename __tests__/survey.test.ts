import { describe, it, expect } from "vitest";
import { parseSurvey } from "@/lib/survey";

const validSurvey = {
  survey: "Economic Survey 2025-26",
  published: "2026-01-29",
  authored_by: "V. Anantha Nageswaran",
  generated_by: "claude-opus-4",
  pages_extracted: 120,
  takeaways: [
    { headline: "GDP growth solid", detail: "India maintained 6.8% real GDP growth." },
  ],
};

describe("parseSurvey", () => {
  it("parses a valid survey object", () => {
    const result = parseSurvey(validSurvey);
    expect(result.survey).toBe("Economic Survey 2025-26");
    expect(result.takeaways).toHaveLength(1);
    expect(result.takeaways[0].headline).toBe("GDP growth solid");
  });

  it("throws on missing required field", () => {
    const { survey: _, ...rest } = validSurvey;
    expect(() => parseSurvey(rest)).toThrow();
  });

  it("throws when takeaways is not an array", () => {
    expect(() => parseSurvey({ ...validSurvey, takeaways: "bad" })).toThrow();
  });

  it("throws when takeaway is missing headline", () => {
    expect(() =>
      parseSurvey({ ...validSurvey, takeaways: [{ detail: "only detail" }] })
    ).toThrow();
  });

  it("throws on non-object input", () => {
    expect(() => parseSurvey(null)).toThrow();
    expect(() => parseSurvey("string")).toThrow();
  });
});
