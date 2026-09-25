import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const INCIDENT_CATEGORIES = [
  "avis-tiers-detenteurs",
  "requisition",
  "saisie-conservatoire",
  "saisie-attribution",
] as const;

const todayLocal = () => new Date().toLocaleDateString("en-CA");

// Bug fix vs. the original app: the received date was only capped at
// "tomorrow"; a date in the future is not a valid reception date.
const incidentSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  category: z.enum(INCIDENT_CATEGORIES, { message: "La catégorie est requise" }),
  dateReceived: z
    .string()
    .min(1, "La date de réception est requise")
    .refine((date) => date <= todayLocal(), { message: "La date de réception est invalide" }),
  isClient: z.boolean(),
  authorId: z.string().min(1, "L'auteur est requis"),
});

export type IncidentFormValues = z.infer<typeof incidentSchema>;

export const useIncidentForm = () =>
  useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: "",
      category: undefined,
      dateReceived: todayLocal(),
      isClient: true,
      authorId: "",
    },
  });

const authorSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.email("Adresse email invalide"),
  phone: z.string().min(1, "Le téléphone est requis"),
});

export type IncidentAuthorFormValues = z.infer<typeof authorSchema>;

export const useIncidentAuthorForm = () =>
  useForm<IncidentAuthorFormValues>({
    resolver: zodResolver(authorSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });
