"use client";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContractsListPageBreadcrumb } from "@/components/contract/breadcrumbs";
import ContractsList from "@/components/contract/ui/contracts-list";
import AddContractDialog from "@/components/contract/modals/add-contract-dialog";
import { SearchInput, SearchProvider } from "@/providers/search-provider";
import { Portal } from "@/components/ui/portal";
import { useIntl } from "react-intl";

export default function ContractListPage() {
  const intl = useIntl();

  return (
    <SearchProvider>
      <Portal containerId="search-input-container">
        <SearchInput />
      </Portal>
      <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <ContractsListPageBreadcrumb />
          <AddContractDialog asChild>
            <Button className="gap-2">
              <Scale />
              <span className="sr-only sm:not-sr-only">
                {intl.formatMessage({
                  id: "contract.contract.listPage.newContract",
                })}
              </span>
            </Button>
          </AddContractDialog>
        </div>
        <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          {intl.formatMessage({
            id: "contract.contract.listPage.chooseContract",
          })}
        </h1>
        <ContractsList />
      </div>
    </SearchProvider>
  );
}
