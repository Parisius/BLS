"use client";
import { Group, NotepadTextDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContractModelCategoriesPageBreadcrumb } from "@/components/contract/breadcrumbs";
import AddContractModelCategoryDialog from "@/components/contract/modals/add-contract-model-category-dialog";
import ContractModelsList from "@/components/contract/ui/contract-models-list";
import { useAllContractModels } from "@/services/api-sdk/models/contract/contract-model";
import AddContractModelDialog from "@/components/contract/modals/add-contract-model-dialog";
import { useIntl } from "react-intl";

export default function ContractModelCategoriesPage({ params }) {
  const { data, isLoading } = useAllContractModels(params.id?.[0]);
  const intl = useIntl();

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <ContractModelCategoriesPageBreadcrumb />
        <div className="flex items-center gap-2">
          <AddContractModelCategoryDialog asChild parentId={params.id?.[0]}>
            <Button className="gap-2">
              <Group />
              <span className="sr-only sm:not-sr-only">
                {intl.formatMessage({
                  id: "contract.contract.categoriesPage.newFolder",
                })}
              </span>
            </Button>
          </AddContractModelCategoryDialog>

          <AddContractModelDialog asChild parentId={data?.id}>
            <Button className="gap-2">
              <NotepadTextDashed />
              <span className="sr-only sm:not-sr-only">
                {intl.formatMessage({
                  id: "contract.contract.categoriesPage.newModel",
                })}
              </span>
            </Button>
          </AddContractModelDialog>
        </div>
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {data?.id
          ? data?.name
          : intl.formatMessage({
              id: "contract.contract.categoriesPage.title",
            })}
      </h1>
      <ContractModelsList models={data?.children ?? []} isLoading={isLoading} />
    </div>
  );
}
