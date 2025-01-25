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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

export default function ContractFilesModal({
  contractFilesGroups,
  contractTitle,
  ...props
}) {
  const intl = useIntl();

  return (
    <Sheet>
      <SheetTrigger {...props} />
      <SheetContent side="right" className="flex flex-col gap-5">
        <SheetHeader>
          <SheetTitle>
            {intl.formatMessage({ id: "contract.contract.modal.archives" })}
          </SheetTitle>
          <SheetDescription className="line-clamp-1">
            {contractTitle}
          </SheetDescription>
        </SheetHeader>
        {contractFilesGroups.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="flex-1 space-y-5 overflow-auto"
          >
            {contractFilesGroups.map(({ stepName, files }) => (
              <AccordionItem
                key={stepName}
                value={stepName}
                className="border-none"
              >
                <AccordionTrigger className="border px-4">
                  {stepName}
                </AccordionTrigger>
                <AccordionContent className="bg-card py-4">
                  {files.length > 0 ? (
                    <div className="grid grid-cols-3 gap-5">
                      {files.map(({ fileUrl, filename }) => (
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
                            {filename}
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center font-medium italic sm:text-lg">
                      {intl.formatMessage({
                        id: "contract.contract.modal.noFilesStep",
                      })}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex-1 text-center font-medium italic sm:text-lg">
            {intl.formatMessage({
              id: "contract.contract.modal.noFilesFolder",
            })}
          </div>
        )}
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">
              {intl.formatMessage({ id: "contract.contract.modal.close" })}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
