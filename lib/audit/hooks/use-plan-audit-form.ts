import { zodResolver } from "@hookform/resolvers/zod";
import { useFormContext, useForm } from "react-hook-form";
import { z } from "zod";

const addAuditValidationSchema = z.object({
  title: z
    .string({
      required_error: "Le titre est requis",
    })
    .min(1, "Le titre est requis"),
  deadline: z
    .string({
      required_error: "L'échéance est requise",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "L'échéance doit être une date valide",
    })
    .refine((date) => new Date(date) > new Date(), {
      message: "L'échéance doit être une date future",
    }),
});

export const usePlanAuditForm = () => {
  const formContext = useFormContext();
  const newForm = useForm({
    resolver: zodResolver(addAuditValidationSchema),
    defaultValues: {
      title: "",
      deadline: "",
    },
  });

  const form = formContext ?? newForm;

  return { form };
};
