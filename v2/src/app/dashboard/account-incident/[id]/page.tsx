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
import { IncidentDetailView } from "@/components/account-incident/incident-detail-view";
import { getDictionary } from "@/lib/i18n/locale";

export default async function AccountIncidentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { t } = await getDictionary();
  const ta = t.accountIncident;

  return (
    <div className="container flex flex-1 flex-col gap-10 py-5">
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
            <BreadcrumbLink render={<Link href="/dashboard/account-incident/list" />}>
              {ta.breadcrumb.incidentsList}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{ta.details.breadcrumbDetails}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <IncidentDetailView incidentId={id} />
    </div>
  );
}
