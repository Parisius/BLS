"use client";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LitigationListPageBreadcrumb } from "@/components/litigation/breadcrumbs";
import AddLitigationDialog from "@/components/litigation/modals/add-litigation-dialog";
import LitigationList from "@/components/litigation/ui/litigation-list";
import { SearchInput, SearchProvider } from "@/providers/search-provider";
import { Portal } from "@/components/ui/portal";
import { FormattedMessage } from "react-intl";
export default function LitigationListPage() {
  return (
    <SearchProvider>
      <Portal containerId="search-input-container">
        <SearchInput />
      </Portal>
      <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <LitigationListPageBreadcrumb />
          <AddLitigationDialog asChild>
            <Button className="gap-2">
              <Scale />
              <span className="sr-only sm:not-sr-only">
                <FormattedMessage id="litigation.litigation.button.newFile" />
              </span>
            </Button>
          </AddLitigationDialog>
        </div>
        <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          <FormattedMessage id="litigation.litigation.title.chooseFile" />
        </h1>
        <LitigationList />
      </div>
    </SearchProvider>
  );
}
