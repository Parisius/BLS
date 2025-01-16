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
import {
  fileTypes,
  getFileTypes,
} from "@/services/api-sdk/types/general-meeting";
import { useAddGeneralMeetingFile } from "@/services/api-sdk/models/general-meeting";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import EllipsisLoader from "@/components/ui/ellipsis-loader";
import { FormattedMessage, useIntl } from "react-intl";
export default function AddFilesButton({
  meetingId,
  className,
}: {
  meetingId: string;
  className?: string;
}) {
  const form = useForm();
  const intl = useIntl();
  const { mutateAsync } = useAddGeneralMeetingFile(meetingId);
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
                  description:
                    "Une erreur est survenue lors de l'ajout du fichier.",
                  className: "bg-destructive text-destructive-foreground",
                }),
            }
          )
        )();
      }
    },
    [fileType, form, mutateAsync]
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
              <FormattedMessage id="generalMeeting.add_session_file" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {getFileTypes(intl).map(({ value, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleFileTypeSelection(value)}
          >
            <label
              htmlFor="general-meeting-file-input"
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
        id="general-meeting-file-input"
        onChange={handleSelectedFile}
      />
    </DropdownMenu>
  );
}
