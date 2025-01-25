"use client";
import React from "react";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useIntl } from "react-intl";

export default function ConfirmAccountIncidentCreationModal({
  formId,
  isSubmitting,
  cancelButtonRef,
  ...props
}) {
  const intl = useIntl();

  return (
    <AlertDialog>
      <Tooltip>
        <AlertDialogTrigger {...props} />
        <TooltipContent>
          {intl.formatMessage({ id: "incident.incident.confirm.tooltip" })}
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {intl.formatMessage({ id: "incident.incident.confirm.title" })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {intl.formatMessage({
              id: "incident.incident.confirm.description",
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelButtonRef} className="sr-only" />
          <AlertDialogCancel type="button">
            {intl.formatMessage({
              id: "incident.incident.confirm.verifyButton",
            })}
          </AlertDialogCancel>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? (
              <EllipsisLoader />
            ) : (
              intl.formatMessage({
                id: "incident.incident.confirm.submitButton",
              })
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
