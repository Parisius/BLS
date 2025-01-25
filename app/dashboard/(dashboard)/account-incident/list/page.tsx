"use client";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountIncidentsListPageBreadcrumb } from "@/components/account-incident/breadcrumbs";
import AccountIncidentsList from "@/components/account-incident/ui/account-incidents-list";
import AddAccountIncidentDialog from "@/components/account-incident/modals/add-account-incident-dialog";
import { SearchInput, SearchProvider } from "@/providers/search-provider";
import { Portal } from "@/components/ui/portal";
import { useIntl } from "react-intl";

export default function AccountIncidentsListPage() {
  const intl = useIntl();

  return (
    <SearchProvider>
      <Portal containerId="search-input-container">
        <SearchInput />
      </Portal>
      <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <AccountIncidentsListPageBreadcrumb />
          <AddAccountIncidentDialog asChild>
            <Button className="gap-2">
              <Scale />
              <span className="sr-only sm:not-sr-only">
                {intl.formatMessage({
                  id: "incident.incident.list.newIncidentButton",
                })}
              </span>
            </Button>
          </AddAccountIncidentDialog>
        </div>
        <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
          {intl.formatMessage({ id: "incident.incident.list.pageTitle" })}
        </h1>
        <AccountIncidentsList />
      </div>
    </SearchProvider>
  );
}
