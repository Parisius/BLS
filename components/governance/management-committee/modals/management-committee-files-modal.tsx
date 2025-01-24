"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import React from "react";
import mime from "mime";
import AddFilesButton from "@/components/governance/management-committee/buttons/add-files-button";
import { useOneManagementCommittee } from "@/services/api-sdk/models/management-committee";
import { fileTypes } from "@/services/api-sdk/types/management-committee";
import { useIntl } from "react-intl";

const getIcon = (filename) => {
  const fileType = mime.getType(filename);
  const extension = fileType ? mime.getExtension(fileType) : null;
  switch (extension) {
    case "pdf":
      return "pdf-icon.svg";
    case "doc":
    case "docx":
      return "doc-icon.svg";
    case "xls":
    case "xlsx":
      return "xls-icon.svg";
    case "ppt":
    case "pptx":
      return "ppt-icon.svg";
    case "txt":
      return "txt-icon.svg";
    default:
      return "file-unknown-icon.svg";
  }
};

export default function ManagementCommitteeFilesModal({
  meetingId,
  meetingTitle,
  ...props
}) {
  const intl = useIntl();
  const { data, isLoading, isError } = useOneManagementCommittee(meetingId);

  if (isError) {
    throw new Error(
      intl.formatMessage({ id: "managementCommittee.files.errorFetchingData" })
    );
  }

  if (isLoading) {
    return (
      <div>
        {intl.formatMessage({ id: "managementCommittee.files.loading" })}
      </div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger {...props} />
      <SheetContent side="right" className="flex flex-col gap-5">
        <SheetHeader>
          <SheetTitle>
            {intl.formatMessage({
              id: "managementCommittee.files.archivesTitle",
            })}
          </SheetTitle>
          <SheetDescription className="line-clamp-1">
            {meetingTitle}
          </SheetDescription>
        </SheetHeader>
        <AddFilesButton meetingId={meetingId} />
        {data?.files && data.files.length > 0 ? (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-3 gap-5">
              {data.files.map(({ fileUrl, fileType, filename }) => (
                <a
                  key={fileUrl}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    style={{
                      backgroundImage: `url('/global/images/${getIcon(
                        fileUrl
                      )}')`,
                    }}
                    className="block h-20 bg-contain bg-center bg-no-repeat"
                  />
                  <span className="line-clamp-2 text-center">
                    {fileType === "other"
                      ? filename
                      : fileTypes.find((type) => type.value === fileType)
                          ?.label ?? filename}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 text-center font-medium italic sm:text-lg">
            {intl.formatMessage({
              id: "managementCommittee.files.noFilesMessage",
            })}
          </div>
        )}
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({
                id: "managementCommittee.files.closeButton",
              })}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
