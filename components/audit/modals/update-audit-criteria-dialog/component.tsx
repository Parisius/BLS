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
import React, { useCallback, useEffect, useId, useRef } from "react";
import { FormProvider } from "react-hook-form";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useOneAuditCriteria } from "@/services/api-sdk/models/audit/criteria";
import { useAuditCriteriaForm } from "@/lib/audit/hooks";
import UpdateAuditCriteriaForm from "@/components/audit/forms/update-audit-criteria-form";
import { UpdateAuditCriteriaDialogSuspense } from "./suspense";
export function UpdateAuditCriteriaDialog({ criteriaId, ...props }) {
  const formId = useId();
  const { data, isLoading, isError } = useOneAuditCriteria(criteriaId);
  const form = useAuditCriteriaForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  if (isError) {
    throw new Error("Failed to fetch audit criteria");
  }
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  const handleError = useCallback(() => {}, []);
  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        type: data.type,
        maxScore: data.maxScore,
        description: data.description,
      });
    }
  }, [data, form, isLoading]);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier critère</DialogTitle>
            <DialogDescription>
              Modifier les détails du critère d&apos;évaluation
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateAuditCriteriaDialogSuspense />
          ) : (
            <>
              <UpdateAuditCriteriaForm
                formId={formId}
                criteriaId={criteriaId}
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
                  {form.formState.isSubmitting ? (
                    <EllipsisLoader />
                  ) : (
                    "Modifier"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
