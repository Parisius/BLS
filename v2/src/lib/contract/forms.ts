import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const stakeholderGroupSchema = z
  .array(
    z.object({
      stakeholderId: z.string().min(1, "Le partenaire est requis"),
      description: z.string().min(1, "La description est requise"),
    }),
  )
  .min(1, "Le groupe de partenaires est requis");

const documentSchema = z.object({
  file: z.instanceof(File, { message: "Le fichier est requis" }),
  filename: z.string().min(1, "Le nom du fichier est requis"),
});

// ---- add / update contract ----

const addContractSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  categoryType: z.string().optional(),
  categorySubType: z.string().optional(),
  firstStakeholdersGroup: stakeholderGroupSchema,
  secondStakeholdersGroup: stakeholderGroupSchema,
  // The backend rejects contract creation with no attached document, so at
  // least one is required here too (matches the original app's validation).
  files: z.array(documentSchema).min(1, "Le document est requis"),
});

export type AddContractFormValues = z.infer<typeof addContractSchema>;

export const useAddContractForm = () => {
  const form = useForm<AddContractFormValues>({
    resolver: zodResolver(addContractSchema),
    defaultValues: {
      title: "",
      category: "",
      firstStakeholdersGroup: [{ stakeholderId: "", description: "" }],
      secondStakeholdersGroup: [{ stakeholderId: "", description: "" }],
      files: [{ file: undefined as unknown as File, filename: "" }],
    },
  });
  const firstStakeholdersGroup = useFieldArray({ control: form.control, name: "firstStakeholdersGroup" });
  const secondStakeholdersGroup = useFieldArray({ control: form.control, name: "secondStakeholdersGroup" });
  const filesArray = useFieldArray({ control: form.control, name: "files" });
  return { form, firstStakeholdersGroup, secondStakeholdersGroup, filesArray };
};

const updateContractSchema = addContractSchema.omit({ files: true });

export type UpdateContractFormValues = z.infer<typeof updateContractSchema>;

export const useUpdateContractForm = () => {
  const form = useForm<UpdateContractFormValues>({
    resolver: zodResolver(updateContractSchema),
    defaultValues: {
      title: "",
      category: "",
      categoryType: "",
      categorySubType: "",
      firstStakeholdersGroup: [{ stakeholderId: "", description: "" }],
      secondStakeholdersGroup: [{ stakeholderId: "", description: "" }],
    },
  });
  const firstStakeholdersGroup = useFieldArray({ control: form.control, name: "firstStakeholdersGroup" });
  const secondStakeholdersGroup = useFieldArray({ control: form.control, name: "secondStakeholdersGroup" });
  return { form, firstStakeholdersGroup, secondStakeholdersGroup };
};

// ---- stakeholder (individual / corporate) ----
// A single flat schema (rather than z.discriminatedUnion) so react-hook-form
// sees one concrete field set — a discriminated union's Control<A | B> makes
// every field path in a shared <FormField> component ambiguous, since fields
// unique to one branch ("denomination", "capital", ...) aren't valid paths
// on the other. The individual/corporate distinction is still enforced at
// submit time via superRefine.

const digitsMessage = "Ce champ ne doit contenir que des chiffres";

const stakeholderSchema = z
  .object({
    type: z.enum(["individual", "corporate"]),
    name: z.string().min(1, "Le nom est requis"),
    email: z.string().min(1, "L'email est requis").email("Adresse email invalide"),
    phone: z.string().min(1, "Le téléphone est requis"),
    residence: z.string().min(1, "La résidence est requise"),
    zipCode: z.string().min(1, "Le code postal est requis").regex(/^\d+$/, digitsMessage),
    cardId: z.string().min(1, "L'identifiant de la carte est requis").regex(/^\d+$/, digitsMessage),
    denomination: z.string().optional(),
    numberRCCM: z.string().optional(),
    numberIFU: z.string().optional(),
    // Plain z.number(), not z.coerce.number() — the latter's input type is
    // `unknown`, which trips up @hookform/resolvers' generic inference
    // against an explicit form-values type. The <input type="number"> in
    // the form converts to a number itself (field.onChange(e.target.valueAsNumber)).
    capital: z.number().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type !== "corporate") return;
    if (!values.denomination) {
      ctx.addIssue({ code: "custom", path: ["denomination"], message: "La dénomination est requise" });
    }
    if (!values.numberRCCM) {
      ctx.addIssue({ code: "custom", path: ["numberRCCM"], message: "Le numéro RCCM est requis" });
    }
    if (!values.numberIFU) {
      ctx.addIssue({ code: "custom", path: ["numberIFU"], message: "Le numéro IFU est requis" });
    } else if (!/^\d+$/.test(values.numberIFU)) {
      ctx.addIssue({ code: "custom", path: ["numberIFU"], message: digitsMessage });
    }
    if (!values.capital || values.capital < 1) {
      ctx.addIssue({ code: "custom", path: ["capital"], message: "Le capital est requis" });
    }
  });

export type StakeholderFormValues = z.infer<typeof stakeholderSchema>;

export const useStakeholderForm = () =>
  useForm<StakeholderFormValues>({
    resolver: zodResolver(stakeholderSchema),
    defaultValues: {
      type: "corporate",
      name: "",
      email: "",
      phone: "",
      residence: "",
      zipCode: "",
      denomination: "",
      numberRCCM: "",
      numberIFU: "",
      cardId: "",
      capital: 0,
    },
  });

// ---- contract event ----

const contractEventSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  dueDate: z.string().min(1, "La date est requise"),
});

export type ContractEventFormValues = z.infer<typeof contractEventSchema>;

export const useContractEventForm = (defaults?: Partial<ContractEventFormValues>) =>
  useForm<ContractEventFormValues>({
    resolver: zodResolver(contractEventSchema),
    defaultValues: { title: "", dueDate: "", ...defaults },
  });

// ---- forward (contract or event) ----

const forwardSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  dueDate: z.string().min(1, "La date est requise"),
  receiverId: z.string().min(1, "Le destinataire est requis"),
  description: z.string().min(1, "La description est requise"),
});

export type ForwardFormValues = z.infer<typeof forwardSchema>;

export const useForwardForm = () =>
  useForm<ForwardFormValues>({
    resolver: zodResolver(forwardSchema),
    defaultValues: { title: "", dueDate: "", receiverId: "", description: "" },
  });

// ---- complete contract ----

const completeContractSchema = z.object({
  files: z.array(documentSchema),
});

export type CompleteContractFormValues = z.infer<typeof completeContractSchema>;

export const useCompleteContractForm = () => {
  const form = useForm<CompleteContractFormValues>({
    resolver: zodResolver(completeContractSchema),
    defaultValues: { files: [] },
  });
  const filesArray = useFieldArray({ control: form.control, name: "files" });
  return { form, filesArray };
};

// ---- contract dates ----
// Fixed vs. the original app: `useContractDatesForm` built a zod schema but
// never passed it to `zodResolver`, so "required" was never actually
// enforced. Wired properly here.

export type ContractDateType =
  | "signatureDate"
  | "effectiveDate"
  | "expirationDate"
  | "renewalDate";

export const useContractDatesForm = (dateType: ContractDateType, defaultValue?: string) => {
  const schema = z.object({ [dateType]: z.string().min(1, "La date est requise") });
  return useForm({
    resolver: zodResolver(schema),
    defaultValues: { [dateType]: defaultValue ?? "" },
  });
};

// ---- contract models ----

const contractModelSchema = z.object({
  filename: z.string().min(1, "Le titre est requis"),
  file: z.instanceof(File, { message: "Le fichier est requis" }),
});

export type ContractModelFormValues = z.infer<typeof contractModelSchema>;

export const useContractModelForm = () =>
  useForm<ContractModelFormValues>({
    resolver: zodResolver(contractModelSchema),
    defaultValues: { filename: "" },
  });

const contractModelCategorySchema = z.object({
  name: z.string().min(1, "Le titre est requis"),
});

export type ContractModelCategoryFormValues = z.infer<typeof contractModelCategorySchema>;

export const useContractModelCategoryForm = () =>
  useForm<ContractModelCategoryFormValues>({
    resolver: zodResolver(contractModelCategorySchema),
    defaultValues: { name: "" },
  });
