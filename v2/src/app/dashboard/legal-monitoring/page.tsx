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
import { CreateItemCards } from "@/components/legal-monitoring/create-item-cards";
import { getDictionary } from "@/lib/i18n/locale";

export default async function LegalMonitoringPage() {
  const { t } = await getDictionary();
  const tl = t.legalMonitoring;

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
              <BreadcrumbPage>{tl.breadcrumb.legalMonitoring}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-end gap-2">
          <Button className="gap-2" render={<Link href="/dashboard/legal-monitoring/judicial" />}>
            <Scale />
            <span className="sr-only sm:not-sr-only">{tl.home.viewJudicial}</span>
          </Button>
          <Button className="gap-2" render={<Link href="/dashboard/legal-monitoring/legislative" />}>
            <Newspaper />
            <span className="sr-only sm:not-sr-only">{tl.home.viewLegislative}</span>
          </Button>
        </div>
      </div>
      <CreateItemCards />
    </div>
  );
}
