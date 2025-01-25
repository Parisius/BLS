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
import { useUpdateContractForm } from "@/lib/contract/hooks";
import { useOneContract } from "@/services/api-sdk/models/contract/contract";
import UpdateContractForm from "@/components/contract/forms/update-contract-form";
import { UpdateContractDialogSuspense } from "./suspense";
import { useIntl } from "react-intl";

export function UpdateContractDialogComponent({ contractId, ...props }) {
  const formId = useId();
  const { data, isLoading, isError } = useOneContract(contractId);
  const { form } = useUpdateContractForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const intl = useIntl();

  if (isError) {
    throw new Error("Failed to fetch contract data");
  }

  const handleSuccess = useCallback(() => {
    closeRef.current?.click();
  }, []);

  const handleError = useCallback(() => {}, []);

  useEffect(() => {
    if (data && !form.formState.isDirty) {
      form.reset({
        title: data.title,
        category: data.category.id,
        categoryType: data.categoryType?.id,
        categorySubType: data.categorySubType?.id,
        firstStakeholdersGroup: data.firstStakeholdersGroup,
        secondStakeholdersGroup: data.secondStakeholdersGroup,
      });
    }
  }, [data, form, isLoading]);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({
                id: "contract.contract.updateDialog.title",
              })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "contract.contract.updateDialog.description",
              })}
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <UpdateContractDialogSuspense />
          ) : (
            <>
              <UpdateContractForm
                formId={formId}
                contractId={contractId}
                className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <DialogFooter className="gap-2">
                <DialogClose ref={closeRef} />
                <DialogClose asChild>
                  <Button variant="destructive" onClick={() => form.reset()}>
                    {intl.formatMessage({
                      id: "contract.contract.updateDialog.cancel",
                    })}
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
                    intl.formatMessage({
                      id: "contract.contract.updateDialog.update",
                    })
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
