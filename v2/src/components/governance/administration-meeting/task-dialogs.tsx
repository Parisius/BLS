"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTaskForm, type TaskFormValues } from "@/lib/governance/administration-meeting/forms";
import { useCreateMeetingTask, useUpdateMeetingTask } from "@/lib/governance/administration-meeting/hooks";
import { toDateInputValue } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";
import type { MeetingTask } from "@/lib/governance/administration-meeting/tasks";

function TaskFormFields({
  formId,
  form,
  onSubmit,
}: {
  formId: string;
  form: ReturnType<typeof useTaskForm>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
  const { t } = useDictionary();
  const tg = t.administrationMeeting;

  return (
    <Form {...form}>
      <form id={formId} className="space-y-5" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tg.editTimelineTaskDialog.titleLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} className="h-12 pl-10" />
                  <Tag className="pointer-events-none absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tg.editTimelineTaskDialog.dueDateLabel}</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tg.editTimelineTaskDialog.assigneeLabel}</FormLabel>
              <FormControl>
                <Input {...field} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supervisor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tg.editTimelineTaskDialog.supervisorLabel}</FormLabel>
              <FormControl>
                <Input {...field} className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export function AddTaskDialog({
  meetingId,
  open,
  onOpenChange,
}: {
  meetingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useTaskForm();
  const { mutateAsync } = useCreateMeetingTask(meetingId);
  const { t } = useDictionary();
  const tg = t.administrationMeeting;

  const handleSubmit = form.handleSubmit(async (values: TaskFormValues) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(t.common.create);
        form.reset();
        onOpenChange(false);
      },
      onError: () => toast.error(t.common.loadError),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tg.addTaskDialog.title}</DialogTitle>
          <DialogDescription>{tg.addTaskDialog.description}</DialogDescription>
        </DialogHeader>
        <TaskFormFields formId="add-task-form" form={form} onSubmit={handleSubmit} />
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tg.taskButtons.cancel}
          </DialogClose>
          <Button type="submit" form="add-task-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.taskButtons.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UpdateTaskDialog({
  meetingId,
  task,
  open,
  onOpenChange,
}: {
  meetingId: string;
  task: MeetingTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useTaskForm();
  const { mutateAsync } = useUpdateMeetingTask(meetingId, task?.id ?? "");
  const { t } = useDictionary();
  const tg = t.administrationMeeting;

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        dueDate: toDateInputValue(task.dueDate),
        assignee: task.assignee ?? "",
        supervisor: task.supervisor ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const handleSubmit = form.handleSubmit(async (values: TaskFormValues) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(t.common.create);
        onOpenChange(false);
      },
      onError: () => toast.error(t.common.loadError),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tg.editTimelineTaskDialog.title}</DialogTitle>
          <DialogDescription>{tg.editTimelineTaskDialog.description}</DialogDescription>
        </DialogHeader>
        <TaskFormFields formId="update-task-form" form={form} onSubmit={handleSubmit} />
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>
            {tg.taskButtons.cancel}
          </DialogClose>
          <Button type="submit" form="update-task-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.taskButtons.modify}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
