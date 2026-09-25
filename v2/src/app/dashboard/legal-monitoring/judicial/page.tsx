import Link from "next/link";
import { Component, Newspaper } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { AddJudicialDialog } from "@/components/legal-monitoring/judicial-form";
import { JudicialItemsList } from "@/components/legal-monitoring/items-lists";
import { getDictionary } from "@/lib/i18n/locale";

export default async function JudicialPage() {
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
              <BreadcrumbLink render={<Link href="/dashboard/legal-monitoring" />}>{tl.breadcrumb.legalMonitoring}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tl.breadcrumb.judicial}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-end gap-2">
          <AddJudicialDialog />
          <Button className="gap-2" render={<Link href="/dashboard/legal-monitoring/legislative" />}>
            <Newspaper />
            <span className="sr-only sm:not-sr-only">{tl.judicialList.viewLegislative}</span>
          </Button>
        </div>
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">{tl.judicialList.pageTitle}</h1>
      <JudicialItemsList />
    </div>
  );
}
