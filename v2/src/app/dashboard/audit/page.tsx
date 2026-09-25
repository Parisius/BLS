import Link from "next/link";
import { Component, Newspaper, Scale } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CreateAuditCard } from "@/components/audit/create-audit-card";
import { getDictionary } from "@/lib/i18n/locale";

export default async function AuditPage() {
  const { t } = await getDictionary();
  const ta = t.audit;

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
              <BreadcrumbPage>{ta.breadcrumb.audit}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" className="gap-2" render={<Link href="/dashboard/audit/modules" />}>
            <Scale />
            <span className="sr-only sm:not-sr-only">{ta.home.insertCriteria}</span>
          </Button>
          <Button className="gap-2" render={<Link href="/dashboard/audit/list" />}>
            <Newspaper />
            <span className="sr-only sm:not-sr-only">{ta.home.viewAudits}</span>
          </Button>
        </div>
      </div>
      <CreateAuditCard />
    </div>
  );
}
