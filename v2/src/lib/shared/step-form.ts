import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const todayLocal = () => new Date().toLocaleDateString("en-CA");
const tomorrowLocal = () => new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString("en-CA");

// The backend rejects a step deadline that isn't in the future ("The deadline is invalid").
const stepSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  dueDate: z
    .string()
    .min(1, "La date est requise")
    .refine((date) => date > todayLocal(), { message: "La date doit être postérieure à aujourd'hui" }),
});

export type StepFormValues = z.infer<typeof stepSchema>;

export const useStepForm = (defaults?: Partial<StepFormValues>) =>
  useForm<StepFormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: { title: "", dueDate: tomorrowLocal(), ...defaults },
  });
