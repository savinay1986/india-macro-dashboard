import { z } from "zod";

export interface SurveyTakeaway {
  headline: string;
  detail: string;
}

export interface SurveyData {
  survey: string;
  published: string;
  authored_by: string;
  generated_by: string;
  pages_extracted: number;
  takeaways: SurveyTakeaway[];
}

const TakeawaySchema = z.object({
  headline: z.string(),
  detail: z.string(),
});

const SurveySchema = z.object({
  survey: z.string(),
  published: z.string(),
  authored_by: z.string(),
  generated_by: z.string(),
  pages_extracted: z.number(),
  takeaways: z.array(TakeawaySchema),
});

/**
 * Load and Zod-validate the pre-generated Economic Survey summary.
 * Throws a ZodError (caught at page level) if the JSON schema drifts.
 */
export function parseSurvey(raw: unknown): SurveyData {
  return SurveySchema.parse(raw);
}
