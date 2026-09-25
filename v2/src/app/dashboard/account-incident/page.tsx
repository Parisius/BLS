import Link from "next/link";
import { Component, FolderSearch } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CreateIncidentCard } from "@/components/account-incident/create-incident-card";
import { getDictionary } from "@/lib/i18n/locale";

export default async function AccountIncidentPage() {
  const { t } = await getDictionary();
  const ta = t.accountIncident;

  return (
    <div className="container flex flex-1 flex-col gap-10 py-5">
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
              <BreadcrumbPage>{ta.breadcrumb.accountIncidents}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button className="gap-2" render={<Link href="/dashboard/account-incident/list" />}>
          <FolderSearch />
          {ta.hub.viewIncidents}
        </Button>
      </div>
      <CreateIncidentCard />
    </div>
  );
}
