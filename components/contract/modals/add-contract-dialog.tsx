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
import { useRouter } from "next13-progressbar";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { ContractRoutes } from "@/config/routes";
import AddContractForm from "@/components/contract/forms/add-contract-form";
import { useAddContractForm } from "@/lib/contract/hooks";
import { useIntl } from "react-intl";

export default function AddContractDialog(props) {
  const intl = useIntl();
  const formId = useId();
  const { form } = useAddContractForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleSuccess = useCallback(
    ({ id }) => {
      closeRef.current?.click();
      router.push(ContractRoutes.contractPage(id).index);
    },
    [router]
  );

  const handleError = useCallback(() => {}, []);

  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {intl.formatMessage({ id: "contract.contract.newContractTitle" })}
            </DialogTitle>
            <DialogDescription>
              {intl.formatMessage({
                id: "contract.contract.newContractDescription",
              })}
            </DialogDescription>
          </DialogHeader>
          <AddContractForm
            formId={formId}
            className="-mx-6 -my-3 max-h-[70vh] overflow-y-auto px-6 py-3"
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                {intl.formatMessage({ id: "contract.contract.cancelButton" })}
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
                intl.formatMessage({ id: "contract.contract.initiateButton" })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
