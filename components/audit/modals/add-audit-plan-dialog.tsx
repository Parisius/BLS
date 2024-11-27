"use client";

import { Button } from "@/components/ui/button";
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
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { toast } from "@/components/ui/use-toast";
import { usePlanAuditForm } from "@/lib/audit/hooks/use-plan-audit-form";
import { planAudit } from "@/services/api-sdk/models/audit/audit";
import { useId, useRef } from "react";
import { FormProvider } from "react-hook-form";
import PlanAuditForm from "../forms/plan-audit-form";

export default function AddAuditPlanDialog(props) {
  const formId = useId();
  const { form } = usePlanAuditForm();
  const closeRef = useRef(null);

  const handleSubmit = async (formData) => {
    const result = await planAudit({
      title: formData.title,
      deadline: formData.deadline,
    });

    if (result.success) {
      toast({
        title: "Succès",
        description: "Audit planifié avec succès !",
        className: "bg-primary text-primary-foreground",
      });

      if (closeRef.current) closeRef.current.click();
    } else {
      toast({
        title: "Échec",
        description:
          result.message || "Une erreur est survenue lors de l'insertion.",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

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
          <PlanAuditForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSubmit={form.handleSubmit(handleSubmit)}
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
