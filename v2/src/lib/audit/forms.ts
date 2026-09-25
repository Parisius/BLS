import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { scoreSchema } from "@/lib/shared/scores";
import { AUDIT_MODULES } from "./constants";

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
