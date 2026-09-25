import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const todayLocal = () => new Date().toLocaleDateString("en-CA");

const nonNegativeInt = (label: string) =>
  z
    .number({ message: `${label} est requis` })
    .int({ message: `${label} doit être un entier` })
    .min(0, { message: `${label} ne peut pas être négatif` });

// ---- shareholder ----
// Bug fix vs. the original app: `corporateType` was never required for a
// corporate shareholder even though the form shows it in that case.
const shareholderSchema = z
  .object({
    type: z.enum(["individual", "corporate"], { message: "Le type est requis" }),
    corporateType: z.enum(["company", "institution"]).optional(),
    name: z.string().min(1, "Le nom est requis"),
    nationality: z.string().min(1, "La nationalité est requise"),
    address: z.string().min(1, "L'adresse est requise"),
    encumberedShares: nonNegativeInt("Le nombre de parts nanties"),
    unencumberedShares: nonNegativeInt("Le nombre de parts non nanties"),
  })
  .superRefine((values, ctx) => {
    if (values.type === "corporate" && !values.corporateType) {
      ctx.addIssue({ code: "custom", path: ["corporateType"], message: "La catégorie est requise" });
    }
  });

export type ShareholderFormValues = z.infer<typeof shareholderSchema>;

export const useShareholderForm = (defaults?: Partial<ShareholderFormValues>) =>
  useForm<ShareholderFormValues>({
    resolver: zodResolver(shareholderSchema),
    defaultValues: {
      type: "individual",
      corporateType: undefined,
      name: "",
      nationality: "",
      address: "",
      encumberedShares: 0,
      unencumberedShares: 0,
      ...defaults,
    },
  });

// ---- transfer ----
// Bug fixes vs. the original app: "old_tier" (transfer to an existing third
// party) had validation and submit logic but no way to select it in the UI;
// `maxShares` had no default so the form could never be valid before a
// seller was chosen; the date could not be in the future only via the picker.
const transferSchema = z
  .object({
    type: z.enum(["shareholder", "new_tier", "old_tier"]),
    sellerId: z.string().min(1, "Le cédant est requis"),
    beneficiaryId: z.string().optional(),
    thirdPartyName: z.string().optional(),
    shares: z
      .number({ message: "Le nombre d'actions est requis" })
      .int({ message: "Le nombre d'actions doit être un entier" })
      .min(1, { message: "Le nombre d'actions doit être supérieur à 0" }),
    maxShares: z.number(),
    transferDate: z.string().min(1, "La date de transfert est requise"),
  })
  .superRefine((values, ctx) => {
    if (values.type === "new_tier") {
      if (!values.thirdPartyName?.trim()) {
        ctx.addIssue({ code: "custom", path: ["thirdPartyName"], message: "Le nom du bénéficiaire est requis" });
      }
    } else if (!values.beneficiaryId) {
      ctx.addIssue({ code: "custom", path: ["beneficiaryId"], message: "Le bénéficiaire est requis" });
    } else if (values.type === "shareholder" && values.beneficiaryId === values.sellerId) {
      ctx.addIssue({
        code: "custom",
        path: ["beneficiaryId"],
        message: "Le cédant et le bénéficiaire ne peuvent pas être les mêmes",
      });
    }
    if (values.sellerId && values.shares > values.maxShares) {
      ctx.addIssue({
        code: "custom",
        path: ["shares"],
        message: "Le nombre d'actions doit être inférieur ou égal au maximum",
      });
    }
    if (values.transferDate > todayLocal()) {
      ctx.addIssue({ code: "custom", path: ["transferDate"], message: "La date ne peut pas être dans le futur" });
    }
  });

export type TransferFormValues = z.infer<typeof transferSchema>;

export const useTransferSharesForm = () =>
  useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      type: "shareholder",
      sellerId: "",
      beneficiaryId: "",
      thirdPartyName: "",
      shares: 0,
      maxShares: 0,
      transferDate: todayLocal(),
    },
  });

// ---- approve transfer ----
const approveSchema = z
  .object({
    type: z.enum(["individual", "corporate"], { message: "Le type est requis" }),
    corporateType: z.enum(["company", "institution"]).optional(),
    nationality: z.string().min(1, "La nationalité est requise"),
    address: z.string().min(1, "L'adresse est requise"),
  })
  .superRefine((values, ctx) => {
    if (values.type === "corporate" && !values.corporateType) {
      ctx.addIssue({ code: "custom", path: ["corporateType"], message: "La catégorie est requise" });
    }
  });

export type ApproveTransferFormValues = z.infer<typeof approveSchema>;

export const useApproveTransferForm = () =>
  useForm<ApproveTransferFormValues>({
    resolver: zodResolver(approveSchema),
    defaultValues: { type: "individual", corporateType: undefined, nationality: "", address: "" },
  });

// ---- bank capital ----
const bankCapitalSchema = z.object({
  capital: z
    .number({ message: "Le capital est requis" })
    .int({ message: "Le capital doit être un entier" })
    .min(1, { message: "Le capital doit être supérieur à 0" }),
  nominalValue: z
    .number({ message: "La valeur nominale est requise" })
    .int({ message: "La valeur nominale doit être un entier" })
    .min(1, { message: "La valeur nominale doit être supérieure à 0" }),
  date: z
    .string()
    .min(1, "La date est requise")
    .refine((date) => date <= todayLocal(), { message: "La date ne peut pas être dans le futur" }),
});

export type BankCapitalFormValues = z.infer<typeof bankCapitalSchema>;

export const useBankCapitalForm = () =>
  useForm<BankCapitalFormValues>({
    resolver: zodResolver(bankCapitalSchema),
    defaultValues: { capital: 0, nominalValue: 0, date: todayLocal() },
  });

// ---- bank infos ----
const bankInfosSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  headOffice: z.string().min(1, "Le siège social est requis"),
  logo: z.instanceof(File).optional(),
});

export type BankInfosFormValues = z.infer<typeof bankInfosSchema>;

export const useBankInfosForm = (defaults?: Partial<BankInfosFormValues>) =>
  useForm<BankInfosFormValues>({
    resolver: zodResolver(bankInfosSchema),
    defaultValues: { name: "", headOffice: "", ...defaults },
  });
