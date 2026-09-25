import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  firstname: z.string().min(1, "Les prénoms sont requis"),
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  roleId: z.string().min(1, "Le rôle est requis"),
  subsidiaryId: z.string().min(1, "La filiale est requise"),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const useUserForm = () =>
  useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      lastname: "",
      firstname: "",
      email: "",
      roleId: "",
      subsidiaryId: "",
    },
  });

const roleSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  permissionIds: z
    .array(z.string())
    .min(1, "Les permissions sont requises"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

export const useRoleForm = () =>
  useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { title: "", permissionIds: [] },
  });

const subsidiarySchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  country: z.string().min(1, "Le pays est requis"),
  address: z.string().min(1, "L'adresse est requise"),
});

export type SubsidiaryFormValues = z.infer<typeof subsidiarySchema>;

export const useSubsidiaryForm = () =>
  useForm<SubsidiaryFormValues>({
    resolver: zodResolver(subsidiarySchema),
    defaultValues: { title: "", country: "", address: "" },
  });
