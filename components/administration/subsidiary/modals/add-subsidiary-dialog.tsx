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
import { useSubsidiaryForm } from "@/lib/administration/subsidiary/hooks";
import AddSubsidiaryForm from "@/components/administration/subsidiary/forms/add-subsidiary-form";
export default function AddSubsidiaryDialog(props) {
  const formId = useId();
  const form = useSubsidiaryForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle filiale</DialogTitle>
            <DialogDescription>Créer une nouvelle filiale.</DialogDescription>
          </DialogHeader>
          <AddSubsidiaryForm formId={formId} onSuccess={handleSuccess} />
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
              {form.formState.isSubmitting ? <EllipsisLoader /> : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
