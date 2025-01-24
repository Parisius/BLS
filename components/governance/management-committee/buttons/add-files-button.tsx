"use client";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fileTypes } from "@/services/api-sdk/types/management-committee";
import { useAddManagementCommitteeFile } from "@/services/api-sdk/models/management-committee";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { useIntl } from "react-intl";

export default function AddFilesButton({
  meetingId,
  className,
}: {
  meetingId: string;
  className?: string;
}) {
  const intl = useIntl();
  const form = useForm();
  const { mutateAsync } = useAddManagementCommitteeFile(meetingId);
  const [fileType, setFileType] = useState("other");

  const handleFileTypeSelection = useCallback((type) => {
    setFileType(type);
  }, []);

  const handleSelectedFile = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (file) {
        await form.handleSubmit(() =>
          mutateAsync(
            { file, fileType },
            {
              onError: () =>
                toast({
                  description: intl.formatMessage({
                    id: "managementCommittee.files.addFileError",
                  }),
                  className: "bg-destructive text-destructive-foreground",
                }),
            }
          )
        )();
      }
    },
    [fileType, form, mutateAsync, intl]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={form.formState.isSubmitting}
          className={cn("ml-auto gap-2", className)}
        >
          {form.formState.isSubmitting ? (
            <EllipsisLoader />
          ) : (
            <>
              <FilePlus />
              {intl.formatMessage({
                id: "managementCommittee.files.addFileButton",
              })}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {fileTypes(intl).map(({ value, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleFileTypeSelection(value)}
          >
            <label
              htmlFor="management-committee-file-input"
              className="block cursor-pointer"
            >
              {label}
            </label>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        className="sr-only"
        id="management-committee-file-input"
        onChange={handleSelectedFile}
      />
    </DropdownMenu>
  );
}
