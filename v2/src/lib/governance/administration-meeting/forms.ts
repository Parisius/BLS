import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const meetingSchema = z.object({
  title: z.string().min(1, "L'intitulé est requis"),
  type: z.enum(["first_quarter", "second_quarter", "third_quarter", "fourth_quarter"], {
    message: "Le type est requis",
  }),
  meetingDate: z.string().min(1, "La date est requise"),
});

export type MeetingFormValues = z.infer<typeof meetingSchema>;

export const useMeetingForm = (defaults?: Partial<MeetingFormValues>) =>
  useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: { title: "", type: "first_quarter", meetingDate: "", ...defaults },
  });

const taskSchema = z.object({
  title: z.string().min(1, "L'intitulé est requis"),
  dueDate: z.string().min(1, "La date est requise"),
  assignee: z.string().optional(),
  supervisor: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const useTaskForm = (defaults?: Partial<TaskFormValues>) =>
  useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", dueDate: "", assignee: "", supervisor: "", ...defaults },
  });

const checklistTaskSchema = z.object({
  title: z.string().min(1, "L'intitulé est requis"),
});

export type ChecklistTaskFormValues = z.infer<typeof checklistTaskSchema>;

export const useChecklistTaskForm = (defaults?: Partial<ChecklistTaskFormValues>) =>
  useForm<ChecklistTaskFormValues>({
    resolver: zodResolver(checklistTaskSchema),
    defaultValues: { title: "", ...defaults },
  });

const forwardTaskSchema = z.object({
  title: z.string().min(1, "L'objet est requis"),
  dueDate: z.string().min(1, "La date est requise"),
  receiverId: z.string().min(1, "Le destinataire est requis"),
  description: z.string().min(1, "La description est requise"),
});

export type ForwardTaskFormValues = z.infer<typeof forwardTaskSchema>;

export const useForwardTaskForm = () =>
  useForm<ForwardTaskFormValues>({
    resolver: zodResolver(forwardTaskSchema),
    defaultValues: { title: "", dueDate: "", receiverId: "", description: "" },
  });

const attendantSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  grade: z.string().min(1, "La qualité est requise"),
});

export type AttendantFormValues = z.infer<typeof attendantSchema>;

export const useAttendantForm = (defaults?: Partial<AttendantFormValues>) =>
  useForm<AttendantFormValues>({
    resolver: zodResolver(attendantSchema),
    defaultValues: { name: "", grade: "", ...defaults },
  });

// ---- administrators ----
// Bug fixes vs. the original app: `sharePercentage` had no 0-100 bound, and
// the corporate-only fields (denomination/companyHeadOffice/
// companyNationality) were never actually required when type==="corporate"
// despite the form only showing them in that case — both fixed below via
// .min()/.max() and a superRefine.

const administratorBaseSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  nationality: z.string().min(1, "La nationalité est requise"),
  address: z.string().min(1, "L'adresse est requise"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  birthPlace: z.string().min(1, "Le lieu de naissance est requis"),
  shares: z.number({ message: "Le nombre de parts est requis" }).int().min(0),
  sharePercentage: z
    .number({ message: "Le pourcentage de parts est requis" })
    .min(0, "Le pourcentage doit être compris entre 0 et 100")
    .max(100, "Le pourcentage doit être compris entre 0 et 100"),
  type: z.enum(["individual", "corporate"], { message: "Le type est requis" }),
  quality: z.enum(["shareholder", "non_shareholder"], { message: "La qualité est requise" }),
  role: z.enum(["ca_president", "ca_executive_admin", "ca_non_executive_admin", "ca_independent_admin"], {
    message: "La fonction est requise",
  }),
  denomination: z.string().optional(),
  companyHeadOffice: z.string().optional(),
  companyNationality: z.string().optional(),
});

const withCorporateRefine = <T extends typeof administratorBaseSchema>(schema: T) =>
  schema.superRefine((values, ctx) => {
    if (values.type !== "corporate") return;
    if (!values.denomination) {
      ctx.addIssue({ code: "custom", path: ["denomination"], message: "La dénomination est requise" });
    }
    if (!values.companyHeadOffice) {
      ctx.addIssue({ code: "custom", path: ["companyHeadOffice"], message: "Le siège social est requis" });
    }
    if (!values.companyNationality) {
      ctx.addIssue({ code: "custom", path: ["companyNationality"], message: "La nationalité est requise" });
    }
  });

const addAdministratorSchema = withCorporateRefine(
  administratorBaseSchema.extend({ mandateStartDate: z.string().min(1, "La date est requise") }),
);

export type AddAdministratorFormValues = z.infer<typeof addAdministratorSchema>;

export const useAddAdministratorForm = () =>
  useForm<AddAdministratorFormValues>({
    resolver: zodResolver(addAdministratorSchema),
    defaultValues: {
      name: "",
      nationality: "",
      address: "",
      birthDate: "",
      birthPlace: "",
      shares: 0,
      sharePercentage: 0,
      type: "individual",
      quality: "non_shareholder",
      role: "ca_non_executive_admin",
      denomination: "",
      companyHeadOffice: "",
      companyNationality: "",
      mandateStartDate: "",
    },
  });

const updateAdministratorSchema = withCorporateRefine(administratorBaseSchema);

export type UpdateAdministratorFormValues = z.infer<typeof updateAdministratorSchema>;

export const useUpdateAdministratorForm = (defaults?: Partial<UpdateAdministratorFormValues>) =>
  useForm<UpdateAdministratorFormValues>({
    resolver: zodResolver(updateAdministratorSchema),
    defaultValues: {
      name: "",
      nationality: "",
      address: "",
      birthDate: "",
      birthPlace: "",
      shares: 0,
      sharePercentage: 0,
      type: "individual",
      quality: "non_shareholder",
      role: "ca_non_executive_admin",
      denomination: "",
      companyHeadOffice: "",
      companyNationality: "",
      ...defaults,
    },
  });

const mandateDateSchema = z.object({
  startDate: z.string().min(1, "La date est requise"),
});

export type MandateDateFormValues = z.infer<typeof mandateDateSchema>;

export const useMandateDateForm = (defaults?: Partial<MandateDateFormValues>) =>
  useForm<MandateDateFormValues>({
    resolver: zodResolver(mandateDateSchema),
    defaultValues: { startDate: "", ...defaults },
  });
