"use client";

import { toast } from "sonner";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserSelect, type UserSelectLabels } from "@/components/shared/user-select";
import { useForwardTaskForm } from "@/lib/shared/forward-task-form";
import type { ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";
import type { ForwardTaskLabels } from "@/components/shared/workflow-tasks/labels";

export function ForwardWorkflowTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  labels: td,
  userSelectLabels,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (args: ForwardWorkflowTaskArgs) => Promise<void>;
  labels: ForwardTaskLabels;
  userSelectLabels: UserSelectLabels;
}) {
  const form = useForwardTaskForm();

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      toast.success(td.success);
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error(td.error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{td.title}</DialogTitle>
          <DialogDescription>{td.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="forward-workflow-task-form" noValidate className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td.subject}</FormLabel>
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
                  <FormLabel>{td.dueDate}</FormLabel>
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
                <FormItem>
                  <FormLabel>{td.receiver}</FormLabel>
                  <FormControl>
                    <UserSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                      className="h-12 w-full"
                      labels={userSelectLabels}
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
                  <FormLabel>{td.observations}</FormLabel>
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
            {td.cancel}
          </DialogClose>
          <Button type="submit" form="forward-workflow-task-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : td.transfer}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
