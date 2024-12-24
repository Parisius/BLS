import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const validationSchema = z.object({
  name: z
    .string({
      required_error: "Le nom est requis",
    })
    .min(1, "Le nom est requis"),
  email: z
    .string({
      required_error: "L'email est requis",
    })
    .email("Adresse email invalide"),
  phone: z
    .string({
      required_error: "Le téléphone est requis",
    })
    .min(1, "Le téléphone est requis"),
});

type FormFields = z.infer<typeof validationSchema>;

interface IncidentAuthorFormOptions {
  noContext?: boolean;
}

export const useIncidentAuthorForm = (
  options: IncidentAuthorFormOptions = {}
) => {
  const formContext = useFormContext<FormFields>();
  const newForm = useForm<FormFields>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  if (options?.noContext) return newForm;
  return formContext ?? newForm;
};
