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
import { useAuditCriteriaForm } from "@/lib/audit/hooks";
import AddAuditCriteriaForm from "@/components/audit/forms/add-audit-criteria-form";
export default function AddAuditCriteriaDialog({ module, ...props }) {
  const formId = useId();
  const form = useAuditCriteriaForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {}, []);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau critère d&apos;audit</DialogTitle>
            <DialogDescription>
              Ajouter un nouveau critère d&apos;audit
            </DialogDescription>
          </DialogHeader>
          <AddAuditCriteriaForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            module={module}
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
              {form.formState.isSubmitting ? <EllipsisLoader /> : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
