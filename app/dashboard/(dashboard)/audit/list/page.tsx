"use client";
import { AuditModulesListPageBreadcrumb } from "@/components/audit/breadcrumbs";
import AuditsList from "@/components/audit/ui/audits-list";
import PlannedAuditList from "@/components/audit/ui/audits-list/content";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { SearchInput, SearchProvider } from "@/providers/search-provider";
import { Calendar, ClipboardList } from "lucide-react";
import { useState } from "react";

export default function ModulesListPage() {
  const [showUpcoming, setShowUpcoming] = useState(false);

  const activeButtonClass =
    "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/50 transform scale-105";
  const inactiveButtonClass = "bg-secondary hover:bg-secondary/80";

  return (
    <SearchProvider>
      <Portal containerId="search-input-container">
        <SearchInput />
      </Portal>
      <div className="container flex flex-1 flex-col gap-10 overflow-y-auto pt-8 md:pt-10 pb-6">
        <div className="flex gap-10 sm:flex-row sm:items-center sm:justify-between">
          <AuditModulesListPageBreadcrumb />
          <div className="flex gap-4">
            <Button
              className={`gap-2 transition-all duration-200 ${
                !showUpcoming ? activeButtonClass : inactiveButtonClass
              }`}
              onClick={() => setShowUpcoming(false)}
            >
              <ClipboardList className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only">Audits</span>
            </Button>
            <Button
              className={`gap-2 transition-all duration-200 ${
                showUpcoming ? activeButtonClass : inactiveButtonClass
              }`}
              onClick={() => setShowUpcoming(true)}
            >
              <Calendar className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only">Audits planifiés</span>
            </Button>
          </div>
        </div>
        {showUpcoming ? <PlannedAuditList /> : <AuditsList />}
      </div>
    </SearchProvider>
  );
}
