import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const forwardTaskSchema = z.object({
  title: z.string().min(1, "L'objet est requis"),
  dueDate: z.string().min(1, "La date est requise"),
  receiverId: z.string().min(1, "Le destinataire est requis"),
  description: z.string().min(1, "La description est requise"),
});

export type ForwardTaskFormValues = z.infer<typeof forwardTaskSchema>;

export const useForwardTaskForm = () =>
  useForm<ForwardTaskFormValues>({
    resolver: zodResolver(forwardTaskSchema),
    defaultValues: { title: "", dueDate: "", receiverId: "", description: "" },
  });
