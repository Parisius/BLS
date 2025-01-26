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
import { useOneAccountIncident } from "@/services/api-sdk/models/account-incident";
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

export default function AccountIncidentFilesModal({
  incidentId,
  incidentTitle,
  ...props
}) {
  const { data, isLoading, isError } = useOneAccountIncident(incidentId);
  const intl = useIntl();

  if (isError) {
    throw new Error("An error occurred while fetching the data");
  }
  if (isLoading) {
    return (
      <div>
        {intl.formatMessage({ id: "incident.incident.author.loading" })}
      </div>
    );
  }
  return (
    <Sheet>
      <SheetTrigger {...props} />
      <SheetContent side="right" className="flex flex-col gap-5">
        <SheetHeader>
          <SheetTitle>
            {intl.formatMessage({ id: "incident.modal.archives" })}
          </SheetTitle>
          <SheetDescription className="line-clamp-1">
            {incidentTitle}
          </SheetDescription>
        </SheetHeader>
        {data?.files && data.files.length > 0 ? (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-3 gap-5">
              {data.files.map(({ fileUrl, filename }) => (
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
                  <span className="line-clamp-2 text-center">{filename}</span>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 text-center font-medium italic sm:text-lg">
            {intl.formatMessage({ id: "incident.modal.noFiles" })}
          </div>
        )}
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({ id: "incident.button.close" })}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
