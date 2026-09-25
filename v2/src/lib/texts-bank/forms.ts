import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const title = z.string().min(1, "Le titre est requis");

const fileSchema = z.object({ title, file: z.instanceof(File, { message: "Le fichier est requis" }) });
// Editing keeps the current file unless a new one is picked.
const editFileSchema = z.object({ title, file: z.instanceof(File).optional() });

export type FileFormValues = { title: string; file?: File };

export const useFileForm = (editing: boolean, defaultTitle = "") =>
  useForm<FileFormValues>({
    resolver: zodResolver(editing ? editFileSchema : fileSchema) as never,
    defaultValues: { title: defaultTitle },
  });

// Bug fix vs. the original app: its pattern accepted addresses without a scheme ("example.com"), which the
// cards then opened as a *relative* link inside the app. A scheme is added when missing, and the result must parse.
export const normalizeLink = (value: string) => {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const linkSchema = z.object({
  title,
  link: z
    .string()
    .min(1, "Le lien est requis")
    .refine((value) => {
      try {
        const url = new URL(normalizeLink(value));
        return url.hostname.includes(".");
      } catch {
        return false;
      }
    }, "Le lien doit être une URL valide"),
});

export type LinkFormValues = z.infer<typeof linkSchema>;

export const useLinkForm = (defaultValues?: LinkFormValues) =>
  useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: defaultValues ?? { title: "", link: "" },
  });
