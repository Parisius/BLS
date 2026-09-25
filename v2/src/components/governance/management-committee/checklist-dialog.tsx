"use client";

import { toast } from "sonner";
import { ListChecks, ListTodo, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  useAllMeetingTasks,
  useCreateMeetingTask,
  useDeleteMeetingTask,
  useUpdateChecklistTasksStatus,
} from "@/lib/governance/management-committee/hooks";
import { useChecklistTaskForm } from "@/lib/governance/management-committee/forms";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { MeetingTaskType } from "@/lib/governance/management-committee/tasks";

interface ChecklistDialogProps {
  meetingId: string;
  type: Extract<MeetingTaskType, "checklist" | "procedure">;
}

export function ChecklistDialog({ meetingId, type }: ChecklistDialogProps) {
  const { t } = useDictionary();
  const tg = t.managementCommittee;
  const isProcedure = type === "procedure";
  const labels = isProcedure ? tg.proceduresModal : tg.checklistModal;
  const triggerLabel = isProcedure ? tg.currentMeetingView.procedures : tg.currentMeetingView.checklist;

  const { data: tasks, isLoading } = useAllMeetingTasks(meetingId, type);
  const { mutateAsync: createTask } = useCreateMeetingTask(meetingId, type);
  const { mutateAsync: deleteTask } = useDeleteMeetingTask(meetingId, type);
  const { mutateAsync: updateStatuses } = useUpdateChecklistTasksStatus(meetingId, type);
  const form = useChecklistTaskForm();

  const handleAdd = form.handleSubmit(async (values) => {
    await createTask(
      { title: values.title, dueDate: new Date().toISOString().slice(0, 10) },
      { onSuccess: () => form.reset(), onError: () => toast.error(t.common.loadError) },
    );
  });

  const toggleTask = async (taskId: string, completed: boolean) => {
    await updateStatuses([{ id: taskId, status: completed }], { onError: () => toast.error(t.common.loadError) });
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button className="gap-2" />}>
        {isProcedure ? <ListTodo /> : <ListChecks />}
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen max-w-lg flex-col">
        <DialogHeader>
          <DialogTitle>{triggerLabel}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex gap-2" onSubmit={handleAdd}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...field} placeholder={tg.taskTitle} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={form.formState.isSubmitting}>
              <Plus />
            </Button>
          </form>
        </Form>

        <div className="flex-1 space-y-2 overflow-auto">
          {isLoading && <p>{t.common.loading}</p>}
          {tasks?.map((task) => (
            <div key={task.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => toggleTask(task.id, !!checked)}
                />
                <span className={task.completed ? "text-foreground/50 line-through" : ""}>{task.title}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteTask(task.id)}>
                <Trash />
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{labels.close}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
