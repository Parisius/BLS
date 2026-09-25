import { useFieldArray, useForm, type UseFieldArrayReturn, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/** A score given on one criterion, as returned by the audit and evaluation backends. */
export interface Score {
  score: number;
  criteria: { id: string; title: string; type: string; maxScore: number };
}

export interface ScoreInput {
  criteriaId: string;
  score: number;
}

// Bug fix vs. the original app: it required every score to be at least 1, so a criterion could never be
// scored 0, and it never checked a score against the criterion's maximum. Scores are 0..max here.
export const scoreSchema = z
  .object({
    criteriaId: z.string().min(1, "Le critère est requis"),
    score: z.preprocess(
      (value) => (value === "" || value == null ? undefined : Number(value)),
      z.number({ message: "La note doit être un nombre" }).min(0, "La note ne peut pas être négative"),
    ),
    maxScore: z.number(),
  })
  .refine((item) => typeof item.score !== "number" || item.score <= item.maxScore, {
    path: ["score"],
    message: "La note dépasse le maximum",
  });

export type ScoreValues = z.infer<typeof scoreSchema>;

const scoresSchema = z.object({ scores: z.array(scoreSchema) });
export type ScoresFormValues = z.infer<typeof scoresSchema>;

// `score` goes through z.preprocess, so zod's *input* type for it is `unknown`; components only deal with the
// parsed shape, so the hooks hand back forms typed against it.
export const useScoresForm = (defaultValues: ScoresFormValues) => {
  const form = useForm({ resolver: zodResolver(scoresSchema), defaultValues });
  const scoresArray = useFieldArray({ control: form.control, name: "scores" });
  return {
    form: form as unknown as UseFormReturn<ScoresFormValues>,
    scoresArray: scoresArray as unknown as UseFieldArrayReturn<ScoresFormValues, "scores">,
  };
};

const criteriaSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.enum(["quantitative", "qualitative"], { message: "Le type est requis" }),
  maxScore: z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z.number({ message: "La note maximale doit être un nombre" }).min(1, "La note maximale doit être supérieure à 0"),
  ),
  description: z.string().min(1, "La description est requise"),
});

export type CriteriaFormValues = z.infer<typeof criteriaSchema>;

export const useCriteriaForm = (defaultValues?: CriteriaFormValues) =>
  useForm({
    resolver: zodResolver(criteriaSchema),
    defaultValues: defaultValues ?? { title: "", type: "quantitative", maxScore: 10, description: "" },
  });
