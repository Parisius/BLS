import React from "react";
import mime from "mime";
import { Button } from "@/components/ui/button";
import { Download, FolderOpen, Trash } from "lucide-react";
import DeleteContractModelButton from "@/components/contract/buttons/delete-contract-model-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { ContractRoutes } from "@/config/routes";
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

export function ContractModelsListComponent({ models, isLoading }) {
  const intl = useIntl();

  if (isLoading) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        {intl.formatMessage({ id: "contract.contract.modelsList.loading" })}
      </p>
    );
  }

  if (models.length === 0) {
    return (
      <p className="text-center text-lg italic text-foreground/75">
        {intl.formatMessage({ id: "contract.contract.modelsList.noItems" })}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-10 md:gap-20">
      {models.map(({ id, name, type, fileUrl }) => (
        <div key={id} className="group flex flex-col items-center">
          <div
            style={{
              backgroundImage:
                type === "folder"
                  ? `url('/global/images/folder-icon.png')`
                  : `url('/global/images/${getIcon(fileUrl)}')`,
            }}
            className="relative h-40 w-28 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat"
          >
            <div className="absolute inset-0 rounded-lg from-black/50 opacity-0 transition group-hover:bg-gradient-to-t group-hover:opacity-100" />
            <div className="absolute bottom-0 right-1 flex translate-y-full items-center gap-2 transition-all group-hover:bottom-1 group-hover:translate-y-0">
              {type === "file" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="bg-accent/50"
                    >
                      <a
                        key={id}
                        href={fileUrl}
                        aria-label={intl.formatMessage({
                          id: "contract.contract.modelsList.download",
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center"
                      >
                        <Download />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {intl.formatMessage({
                      id: "contract.contract.modelsList.download",
                    })}
                  </TooltipContent>
                </Tooltip>
              )}

              {type === "folder" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="bg-accent/50"
                    >
                      <Link
                        key={id}
                        href={ContractRoutes.contractModels(id).index}
                        aria-label={intl.formatMessage({
                          id: "contract.contract.modelsList.open",
                        })}
                      >
                        <FolderOpen />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {intl.formatMessage({
                      id: "contract.contract.modelsList.open",
                    })}
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <DeleteContractModelButton asChild modelId={id}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-accent/50 text-destructive"
                    >
                      <Trash />
                    </Button>
                  </DeleteContractModelButton>
                </TooltipTrigger>
                <TooltipContent>
                  {intl.formatMessage({
                    id: "contract.contract.modelsList.delete",
                  })}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="line-clamp-2 max-w-32 text-center font-medium">
                {name}
              </span>
            </TooltipTrigger>
            <TooltipContent>{name}</TooltipContent>
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
