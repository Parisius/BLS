import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { scoreSchema } from "@/lib/shared/scores";

const addEvaluationSchema = z.object({
  profileId: z.string().min(1, "Le profil du collaborateur est requis"),
  collaboratorId: z.string().min(1, "Le collaborateur est requis"),
  isArchived: z.boolean(),
  scores: z.array(scoreSchema).min(1, "Aucun critère d'évaluation n'est disponible pour ce profil"),
});

export type AddEvaluationFormValues = z.infer<typeof addEvaluationSchema>;

export const useAddEvaluationForm = () => {
  const form = useForm({
    resolver: zodResolver(addEvaluationSchema),
    defaultValues: { profileId: "", collaboratorId: "", isArchived: false, scores: [] } as unknown as AddEvaluationFormValues,
  });
  const scoresArray = useFieldArray({ control: form.control, name: "scores" });
  return { form, scoresArray };
};

const collaboratorSchema = z.object({
  lastname: z.string().min(1, "Le nom est requis"),
  firstname: z.string().min(1, "Le prénom est requis"),
});

export type CollaboratorFormValues = z.infer<typeof collaboratorSchema>;

export const useCollaboratorForm = (defaultValues?: CollaboratorFormValues) =>
  useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: defaultValues ?? { lastname: "", firstname: "" },
  });

const profileSchema = z.object({ title: z.string().min(1, "Le titre est requis") });

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const useProfileForm = (defaultValues?: ProfileFormValues) =>
  useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema), defaultValues: defaultValues ?? { title: "" } });
