import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PARTY_ENTITY_TYPES } from "./constants";

const documentSchema = z.object({
  file: z.instanceof(File, { message: "Le fichier est requis" }),
  filename: z.string().min(1, "Le nom du fichier est requis"),
});

// The original's party rows only had `required_error`s, so an empty (but present) row slipped past validation
// as an empty string and failed on the backend; every part is required here.
const partySchema = z.object({
  partyId: z.string().min(1, "La partie est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  type: z.string().min(1, "Le type est requis"),
});

const litigationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  caseNumber: z.string().min(1, "Le numéro de dossier est requis"),
  natureId: z.string().min(1, "La nature est requise"),
  jurisdictionId: z.string().min(1, "La juridiction est requise"),
  jurisdictionLocation: z.string().min(1, "Le lieu de la juridiction est requis"),
  hasProvisions: z.boolean(),
  parties: z.array(partySchema).min(1, "Au moins une partie est requise"),
  files: z.array(documentSchema),
});

// The backend refuses a new case without at least one document ("The documents field is required"),
// but editing one doesn't require adding more.
const createLitigationSchema = litigationSchema.extend({
  files: z.array(documentSchema).min(1, "Le document est requis"),
});

export type LitigationFormValues = z.infer<typeof litigationSchema>;

const emptyParty = { partyId: "", category: "", type: "" };

export const useLitigationForm = (defaultValues?: LitigationFormValues) => {
  const form = useForm<LitigationFormValues>({
    resolver: zodResolver(defaultValues ? litigationSchema : createLitigationSchema),
    defaultValues: defaultValues ?? {
      title: "",
      caseNumber: "",
      natureId: "",
      jurisdictionId: "",
      jurisdictionLocation: "",
      hasProvisions: true,
      parties: [emptyParty],
      files: [{ file: undefined as unknown as File, filename: "" }],
    },
  });
  const partiesArray = useFieldArray({ control: form.control, name: "parties" });
  const filesArray = useFieldArray({ control: form.control, name: "files" });
  return { form, partiesArray, filesArray, emptyParty };
};

const partyEntitySchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  phone: z.string().min(1, "Le téléphone est requis"),
  email: z.string().min(1, "L'email est requis").email("L'email est invalide"),
  address: z.string().min(1, "L'adresse est requise"),
  type: z.enum(PARTY_ENTITY_TYPES, { message: "Le type est requis" }),
});

export type PartyFormValues = z.infer<typeof partyEntitySchema>;

export const usePartyForm = () =>
  useForm<PartyFormValues>({
    resolver: zodResolver(partyEntitySchema),
    defaultValues: { title: "", phone: "", email: "", address: "", type: "individual" },
  });

const amount = (message: string) =>
  z.preprocess((value) => (value === "" || value == null ? undefined : Number(value)), z.number({ message }).min(0, "Le montant doit être positif"));

const provisionsSchema = z.object({
  estimatedAmount: amount("Le montant estimé est invalide"),
  addedAmount: amount("Le montant ajouté est invalide"),
  remainingAmount: amount("Le montant restant est invalide"),
});

export type ProvisionsFormValues = z.infer<typeof provisionsSchema>;

export const useProvisionsForm = () =>
  useForm({
    resolver: zodResolver(provisionsSchema),
    defaultValues: { estimatedAmount: 0, addedAmount: 0, remainingAmount: 0 },
  });

const assignSchema = z.object({
  users: z.array(z.object({ userId: z.string().min(1, "Le collaborateur est requis") })),
  lawyers: z.array(z.object({ lawyerId: z.string().min(1, "L'avocat est requis") })),
});

export type AssignFormValues = z.infer<typeof assignSchema>;

export const useAssignForm = (defaultValues?: AssignFormValues) => {
  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: defaultValues ?? { users: [], lawyers: [] },
  });
  const usersArray = useFieldArray({ control: form.control, name: "users" });
  const lawyersArray = useFieldArray({ control: form.control, name: "lawyers" });
  return { form, usersArray, lawyersArray };
};
