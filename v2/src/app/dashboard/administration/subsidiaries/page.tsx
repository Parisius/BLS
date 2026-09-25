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
import { AddSubsidiaryDialog } from "@/components/administration/add-subsidiary-dialog";
import { SubsidiariesTable } from "@/components/administration/subsidiaries-table";
import { getDictionary } from "@/lib/i18n/locale";

export default async function SubsidiariesPage() {
  const { t } = await getDictionary();

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
              <BreadcrumbLink render={<Link href="/dashboard/administration" />}>
                {t.administration.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t.administration.subsidiaries.breadcrumb}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AddSubsidiaryDialog />
      </div>
      <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {t.administration.subsidiaries.pageTitle}
      </h1>
      <SubsidiariesTable />
    </div>
  );
}
