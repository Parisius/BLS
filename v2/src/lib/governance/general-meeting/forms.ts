import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const meetingSchema = z.object({
  title: z.string().min(1, "L'intitulé est requis"),
  type: z.enum(["ordinary", "extraordinary", "mixte", "special"], {
    message: "Le type est requis",
  }),
  meetingDate: z.string().min(1, "La date est requise"),
});

export type MeetingFormValues = z.infer<typeof meetingSchema>;

export const useMeetingForm = (defaults?: Partial<MeetingFormValues>) =>
  useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: { title: "", type: "ordinary", meetingDate: "", ...defaults },
  });

const taskSchema = z.object({
  title: z.string().min(1, "L'intitulé est requis"),
  dueDate: z.string().min(1, "La date est requise"),
  assignee: z.string().optional(),
  supervisor: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const useTaskForm = (defaults?: Partial<TaskFormValues>) =>
  useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", dueDate: "", assignee: "", supervisor: "", ...defaults },
  });

const checklistTaskSchema = z.object({
  title: z.string().min(1, "L'intitulé est requis"),
});

export type ChecklistTaskFormValues = z.infer<typeof checklistTaskSchema>;

export const useChecklistTaskForm = (defaults?: Partial<ChecklistTaskFormValues>) =>
  useForm<ChecklistTaskFormValues>({
    resolver: zodResolver(checklistTaskSchema),
    defaultValues: { title: "", ...defaults },
  });

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

const attendantSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  grade: z.string().min(1, "La qualité est requise"),
});

export type AttendantFormValues = z.infer<typeof attendantSchema>;

export const useAttendantForm = (defaults?: Partial<AttendantFormValues>) =>
  useForm<AttendantFormValues>({
    resolver: zodResolver(attendantSchema),
    defaultValues: { name: "", grade: "", ...defaults },
  });
