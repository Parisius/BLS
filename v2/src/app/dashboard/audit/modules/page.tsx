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
import { ModulesList } from "@/components/audit/modules-list";
import { getDictionary } from "@/lib/i18n/locale";

export default async function AuditModulesPage() {
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
              <BreadcrumbLink render={<Link href="/dashboard/audit" />}>{ta.breadcrumb.audit}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{ta.breadcrumb.modules}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button className="gap-2" render={<Link href="/dashboard/audit/list" />}>
          <Newspaper />
          <span className="sr-only sm:not-sr-only">{ta.home.viewAudits}</span>
        </Button>
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">{ta.modulesPage.pageTitle}</h1>
      <ModulesList />
    </div>
  );
}
