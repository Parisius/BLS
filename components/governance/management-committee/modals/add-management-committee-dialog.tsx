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
import { useManagementCommitteeForm } from "@/lib/governance/management-committee/hooks";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { ManagementCommitteeRoutes } from "@/config/routes";
import AddManagementCommitteeForm from "@/components/governance/management-committee/forms/add-management-committee-form";
import { FormattedMessage } from "react-intl";
export default function AddManagementCommitteeDialog(props) {
  const formId = useId();
  const form = useManagementCommitteeForm();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const handleSuccess = useCallback(
    ({ id }) => {
      closeRef.current?.click();
      router.push(ManagementCommitteeRoutes.session(id).index);
    },
    [router]
  );
  return (
    <Dialog>
      <DialogTrigger {...props} />
      <FormProvider {...form}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {" "}
              <FormattedMessage id="managementCommittee.newSessionTitle" />
            </DialogTitle>
            <DialogDescription>
              <FormattedMessage id="managementCommittee.newSessionDescription" />
            </DialogDescription>
          </DialogHeader>
          <AddManagementCommitteeForm
            formId={formId}
            onSuccess={handleSuccess}
          />
          <DialogFooter className="gap-2">
            <DialogClose ref={closeRef} />
            <DialogClose asChild>
              <Button variant="destructive" onClick={() => form.reset()}>
                <FormattedMessage id="managementCommittee.cancel" />
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
                <FormattedMessage id="managementCommittee.scheduleButton" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
