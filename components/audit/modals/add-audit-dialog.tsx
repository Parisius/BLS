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
import { useAddAuditForm } from "@/lib/audit/hooks";
import AddAuditForm from "@/components/audit/forms/add-audit-form";
import { toast } from "@/components/ui/use-toast";
import { useCreateAudit } from "@/services/api-sdk/models/audit/audit";
import { useRouter } from "next13-progressbar";
import { AuditRoutes } from "@/config/routes/audit";
export default function AddAuditDialog(props) {
  const formId = useId();
  const { form } = useAddAuditForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { mutateAsync } = useCreateAudit();
  const router = useRouter();
  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: ({ id }) => {
          toast({
            description: "Audit inséré avec succès !",
            className: "bg-primary text-primary-foreground",
          });
          router.push(AuditRoutes.auditPage(id).index);
          closeRef.current?.click();
        },
        onError: () => {
          toast({
            description: "Une erreur est survenue lors de l'insertion.",
            className: "bg-destructive text-destructive-foreground",
          });
        },
      });
    },
    [mutateAsync, router]
  );
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Insérer un audit</DialogTitle>
            <DialogDescription>
              Remplir le formulaire ci-dessous pour insérer un audit
            </DialogDescription>
          </DialogHeader>
          <AddAuditForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSubmit={handleSubmit}
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
              {form.formState.isSubmitting ? <EllipsisLoader /> : "Auditer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
