import { useFieldArray, useForm, type UseFieldArrayReturn, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AUDIT_MODULES, CRITERIA_TYPES } from "./constants";

// Bug fix vs. the original app: it required every score to be at least 1, so a criterion could never be
// scored 0, and it never checked a score against the criterion's maximum. Scores are 0..max here.
const scoreSchema = z
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

const addAuditSchema = z.object({
  module: z.enum(AUDIT_MODULES, { message: "Le module est requis" }),
  moduleId: z.string().min(1, "L'élément à auditer est requis"),
  scores: z.array(scoreSchema).min(1, "Aucun critère d'audit n'est disponible pour ce module"),
});

export type AddAuditFormValues = z.infer<typeof addAuditSchema>;

export const useAddAuditForm = () => {
  const form = useForm({
    resolver: zodResolver(addAuditSchema),
    defaultValues: { module: undefined, moduleId: "", scores: [] } as unknown as AddAuditFormValues,
  });
  const scoresArray = useFieldArray({ control: form.control, name: "scores" });
  return { form, scoresArray };
};

const criteriaSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.enum(CRITERIA_TYPES, { message: "Le type est requis" }),
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
