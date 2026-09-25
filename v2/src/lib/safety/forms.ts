import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORMALIZATION_TYPES, MOVABLE_SECURITIES, MOVABLE_TYPES, PERSONAL_TYPES } from "./kinds";

const title = z.string().min(1, "Le titre est requis");
const contractId = z.string().min(1, "Le contrat est requis");

export const mortgageSchema = z.object({ title, contractId });
export type MortgageFormValues = z.infer<typeof mortgageSchema>;

export const movableSchema = z
  .object({
    title,
    security: z.enum(MOVABLE_SECURITIES, { message: "Le type de sûreté est requis" }),
    type: z.string().min(1, "Le type de garantie est requis"),
    formalizationType: z.enum(FORMALIZATION_TYPES).optional(),
    contractId,
  })
  .superRefine((values, ctx) => {
    if (values.security && !MOVABLE_TYPES[values.security].includes(values.type)) {
      ctx.addIssue({ code: "custom", path: ["type"], message: "Le type de garantie n'est pas valide" });
    }
    if (values.type !== "vehicle" && !values.formalizationType) {
      ctx.addIssue({ code: "custom", path: ["formalizationType"], message: "Le type de formalisation est requis" });
    }
  });
export type MovableFormValues = z.infer<typeof movableSchema>;

// Bug fix vs. the original app: its `.refine` for the contract/guarantee requirement had no message or path,
// so a missing contract/guarantee blocked submission with no visible error.
export const personalSchema = z
  .object({
    title,
    type: z.enum(PERSONAL_TYPES, { message: "Le type est requis" }),
    contractId: z.string().optional(),
    guaranteeId: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type === "autonomous_counter") {
      if (!values.guaranteeId) ctx.addIssue({ code: "custom", path: ["guaranteeId"], message: "La garantie autonome est requise" });
    } else if (!values.contractId) {
      ctx.addIssue({ code: "custom", path: ["contractId"], message: "Le contrat est requis" });
    }
  });
export type PersonalFormValues = z.infer<typeof personalSchema>;

export const useMortgageForm = () =>
  useForm<MortgageFormValues>({ resolver: zodResolver(mortgageSchema), defaultValues: { title: "", contractId: "" } });

export const useMovableForm = () =>
  useForm<MovableFormValues>({
    resolver: zodResolver(movableSchema),
    defaultValues: { title: "", security: undefined, type: "", formalizationType: undefined, contractId: "" },
  });

export const usePersonalForm = () =>
  useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: { title: "", type: "bonding", contractId: "", guaranteeId: "" },
  });
