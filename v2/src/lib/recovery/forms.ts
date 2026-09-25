import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const RECOVERY_TYPES = [
  "friendly_without_guarantee",
  "friendly_with_guarantee",
  "forced_without_guarantee",
  "forced_with_guarantee",
] as const;

// Bug fix vs. the original app: the guarantee/contract requirement was
// `!== undefined`, which an emptied select (empty string) satisfied.
const recoverySchema = z
  .object({
    title: z.string().min(1, "Le titre est requis"),
    type: z.enum(RECOVERY_TYPES, { message: "Le type est requis" }),
    guaranteeId: z.string().optional(),
    contractId: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type.endsWith("_with_guarantee") && !values.type.includes("without")) {
      if (!values.guaranteeId) ctx.addIssue({ code: "custom", path: ["guaranteeId"], message: "La garantie est requise" });
    } else if (!values.contractId) {
      ctx.addIssue({ code: "custom", path: ["contractId"], message: "Le contrat est requis" });
    }
  });

export type RecoveryFormValues = z.infer<typeof recoverySchema>;

export const useRecoveryForm = () =>
  useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { title: "", type: "friendly_without_guarantee", guaranteeId: "", contractId: "" },
  });
