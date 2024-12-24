"use client";
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
import { Button } from "@/components/ui/button";
import React, { useCallback, useId, useRef } from "react";
import { FormProvider } from "react-hook-form";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useForwardIncidentTaskForm } from "@/lib/account-incident/hooks";
import ForwardIncidentTaskForm from "@/components/account-incident/forms/forward-incident-task-form";
export default function ForwardIncidentTaskDialog({ taskId, ...props }) {
  const formId = useId();
  const form = useForwardIncidentTaskForm();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {}, []);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transfert d&apos;événement</DialogTitle>
            <DialogDescription>
              Transférer l&apos;événement à un collaborateur
            </DialogDescription>
          </DialogHeader>
          <ForwardIncidentTaskForm
            formId={formId}
            taskId={taskId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form={formId}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <EllipsisLoader /> : "Transférer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
