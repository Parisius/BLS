"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { UserSelect } from "@/components/governance/general-meeting/selects";
import { useForwardTaskForm } from "@/lib/governance/general-meeting/forms";
import { useForwardMeetingTask } from "@/lib/governance/general-meeting/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function ForwardTaskDialog({
  meetingId,
  taskId,
  open,
  onOpenChange,
}: {
  meetingId: string;
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForwardTaskForm();
  const { mutateAsync } = useForwardMeetingTask(meetingId, taskId);
  const { t } = useDictionary();
  const tg = t.generalMeeting;

  const handleSubmit = form.handleSubmit(async (values) => {
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tg.forwardTaskDialog.title}</DialogTitle>
          <DialogDescription>{tg.forwardTaskDialog.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="forward-task-form" className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.forwardTaskDialog.subjectLabel}</FormLabel>
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
                  <FormLabel>{tg.forwardTaskDialog.dueDateLabel}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiverId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{tg.forwardTaskDialog.receiverLabel}</FormLabel>
                  <FormControl>
                    <UserSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                      className="h-12 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tg.forwardTaskDialog.observationsLabel}</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none" rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {tg.forwardTaskDialog.cancel}
          </DialogClose>
          <Button type="submit" form="forward-task-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : tg.forwardTaskDialog.transfer}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
