import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const individualMemberValidationSchema = z.object({
  type: z.enum(["individual"], {
    required_error: "Le type est requis",
    invalid_type_error: "Type invalide",
  }),
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
  residence: z
    .string({
      required_error: "La résidence est requise",
    })
    .min(1, "La résidence est requise"),
  cardId: z
    .string({
      required_error: "L'identifiant de la carte est requis",
    })
    .min(1, "L'identifiant de la carte est requis")
    .regex(/^\d+$/, "Identifiant de la carte invalide"),
  zipCode: z
    .string({
      required_error: "Le code postal est requis",
    })
    .min(1, "Le code postal est requis")
    .regex(/^\d+$/, "Code postal invalide"),
});
const corporateMemberValidationSchema = z.object({
  type: z.enum(["corporate"], {
    required_error: "Le type est requis",
    invalid_type_error: "Type invalide",
  }),
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
  residence: z
    .string({
      required_error: "La résidence est requise",
    })
    .min(1, "La résidence est requise"),
  zipCode: z
    .string({
      required_error: "Le code postal est requis",
    })
    .min(1, "Le code postal est requis")
    .regex(/^\d+$/, "Code postal invalide"),
  denomination: z
    .string({
      required_error: "La dénomination est requise",
    })
    .min(1, "La dénomination est requise"),
  numberRCCM: z
    .string({
      required_error: "Le numéro RCCM est requis",
    })
    .min(1, "Le numéro RCCM est requis"),
  numberIFU: z
    .string({
      required_error: "Le numéro IFU est requis",
    })
    .min(1, "Le numéro IFU est requis")
    .regex(/^\d+$/, "Numéro IFU invalide"),
  cardId: z
    .string({
      required_error: "L'identifiant de la carte est requis",
    })
    .min(1, "L'identifiant de la carte est requis")
    .regex(/^\d+$/, "Identifiant de la carte invalide"),
  capital: z
    .number({
      required_error: "Le capital est requis",
      coerce: true,
    })
    .min(1, "Le capital est requis"),
});
const validationSchema = z.union([
  individualMemberValidationSchema,
  corporateMemberValidationSchema,
]);

interface StakeholderFormOptions {
  noContext?: boolean;
}
export const useStakeholderForm = (options: StakeholderFormOptions = {}) => {
  const formContext = useFormContext();
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      type: "corporate",
      name: "",
      email: "",
      phone: "",
      residence: "",
      cardId: "",
      zipCode: "",
      denomination: "",
      numberRCCM: "",
      numberIFU: "",
      capital: 0,
    },
  });
  if (options?.noContext) return form;
  return formContext ?? form;
};
