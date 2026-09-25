import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const mailSchema = z.object({
  recipient: z.enum(["admin", "personnel"], { message: "Le destinataire du mail est requis" }),
  subject: z.string(),
  content: z.string(),
  addresses: z.array(z.string().email("L'adresse mail est invalide")),
});

// Fixes vs. the original: a mail could be "sent" with no recipient address, no subject and no message;
// all three are required when the action is to transfer by mail.
type MailRuleShape = { actionType: string; mail: z.infer<typeof mailSchema> };

const withMailRules = <T extends z.ZodType<MailRuleShape>>(schema: T) =>
  schema.superRefine((data, ctx) => {
    if (data.actionType !== "transfer_mail") return;
    if (data.mail.addresses.length === 0) {
      ctx.addIssue({ code: "custom", path: ["mail", "addresses"], message: "Au moins une adresse mail est requise" });
    }
    if (!data.mail.subject.trim()) {
      ctx.addIssue({ code: "custom", path: ["mail", "subject"], message: "L'objet du mail est requis" });
    }
    if (!data.mail.content.trim()) {
      ctx.addIssue({ code: "custom", path: ["mail", "content"], message: "Le message du mail est requis" });
    }
  });

const actionType = z.enum(["archive", "transfer_mail"], { message: "L'action est requise" });

const judicialSchema = withMailRules(
  z.object({
    title: z.string().min(1, "Le titre est requis"),
    summary: z.string().min(1, "Le résumé est requis"),
    innovation: z.string().min(1, "L'innovation est requise"),
    eventDate: z.string().min(1, "La date de la décision est requise"),
    jurisdictionId: z.string().min(1, "La juridiction est requise"),
    jurisdictionLocation: z.string().min(1, "Le lieu de la juridiction est requis"),
    actionType,
    mail: mailSchema,
  }),
);

export type JudicialFormValues = {
  title: string;
  summary: string;
  innovation: string;
  eventDate: string;
  jurisdictionId: string;
  jurisdictionLocation: string;
  actionType: "archive" | "transfer_mail";
  mail: z.infer<typeof mailSchema>;
};

const emptyMail = { recipient: "admin" as const, subject: "", content: "", addresses: [] as string[] };
const today = () => new Date().toISOString().slice(0, 10);

export const useJudicialForm = (defaultValues?: JudicialFormValues) =>
  useForm<JudicialFormValues>({
    resolver: zodResolver(judicialSchema) as never,
    defaultValues: defaultValues ?? {
      title: "",
      summary: "",
      innovation: "",
      eventDate: today(),
      jurisdictionId: "",
      jurisdictionLocation: "",
      actionType: "archive",
      mail: emptyMail,
    },
  });

const legislativeSchema = withMailRules(
  z.object({
    type: z.enum(["legislation", "regulation"], { message: "Le type est requis" }),
    title: z.string().min(1, "Le titre est requis"),
    caseNumber: z.string().min(1, "La référence est requise"),
    natureId: z.string().min(1, "La matière est requise"),
    summary: z.string().min(1, "Le résumé est requis"),
    innovation: z.string().min(1, "L'innovation est requise"),
    effectiveDate: z.string().min(1, "La date de prise d'effet est requise"),
    actionType,
    mail: mailSchema,
  }),
);

export type LegislativeFormValues = {
  type: "legislation" | "regulation";
  title: string;
  caseNumber: string;
  natureId: string;
  summary: string;
  innovation: string;
  effectiveDate: string;
  actionType: "archive" | "transfer_mail";
  mail: z.infer<typeof mailSchema>;
};

export const useLegislativeForm = (defaultValues?: LegislativeFormValues) =>
  useForm<LegislativeFormValues>({
    resolver: zodResolver(legislativeSchema) as never,
    defaultValues: defaultValues ?? {
      type: "legislation",
      title: "",
      caseNumber: "",
      natureId: "",
      summary: "",
      innovation: "",
      effectiveDate: today(),
      actionType: "archive",
      mail: emptyMail,
    },
  });

export { emptyMail };
