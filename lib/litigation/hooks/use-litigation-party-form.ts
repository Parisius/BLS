import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const validationSchema = z.object({
  title: z
    .string({
      required_error: "Le titre est requis",
    })
    .min(1, "Le titre est requis"),
  phone: z
    .string({
      required_error: "Le téléphone est requis",
    })
    .min(1, "Le téléphone est requis"),
  email: z
    .string({
      required_error: "L'email est requis",
    })
    .email("L'email est invalide"),
  address: z
    .string({
      required_error: "L'adresse est requise",
    })
    .min(1, "L'adresse est requise"),
  type: z.enum(["legal", "individual"], {
    required_error: "Le type est requis",
  }),
});
export const useLitigationPartyForm = (options = {}) => {
  const formContext = useFormContext();
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      title: "",
      phone: "",
      email: "",
      address: "",
      type: "individual",
    },
  });
  if (options?.noContext) return form;
  return formContext ?? form;
};
