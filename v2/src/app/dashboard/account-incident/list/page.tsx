import Link from "next/link";
import { Component } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AddIncidentDialog } from "@/components/account-incident/add-incident-dialog";
import { IncidentsList } from "@/components/account-incident/incidents-list";
import { getDictionary } from "@/lib/i18n/locale";

export default async function AccountIncidentsListPage() {
  const { t } = await getDictionary();
  const ta = t.accountIncident;

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/dashboard/modules" />}>
                <Component />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/dashboard/account-incident" />}>
                {ta.breadcrumb.accountIncidents}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{ta.breadcrumb.incidentsList}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AddIncidentDialog />
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">{ta.list.pageTitle}</h1>
      <IncidentsList />
    </div>
  );
}
