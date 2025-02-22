"use client";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddRecoveryDialog from "@/components/recovery/modals/add-recovery-dialog";
import RecoveriesList from "@/components/recovery/ui/recoveries-list";
import { RecoveriesListPageBreadcrumb } from "@/components/recovery/breadcrumbs";
import { SearchInput, SearchProvider } from "@/providers/search-provider";
import { Portal } from "@/components/ui/portal";
import { FormattedMessage } from "react-intl";

export default function RecoveriesListPage() {
  return (
    <SearchProvider>
      <Portal containerId="search-input-container">
        <SearchInput />
      </Portal>
      <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <RecoveriesListPageBreadcrumb />
          <AddRecoveryDialog asChild>
            <Button className="gap-2">
              <Scale />
              <span className="sr-only sm:not-sr-only">
                <FormattedMessage id="recovery.newRecovery" />
              </span>
            </Button>
          </AddRecoveryDialog>
        </div>
        <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          <FormattedMessage id="recovery.chooseRecovery" />
        </h1>
        <RecoveriesList />
      </div>
    </SearchProvider>
  );
}
