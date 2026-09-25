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
import { AddRecoveryDialog } from "@/components/recovery/add-recovery-dialog";
import { RecoveriesList } from "@/components/recovery/recoveries-list";
import { getDictionary } from "@/lib/i18n/locale";

export default async function RecoveryListPage() {
  const { t } = await getDictionary();
  const ta = t.recovery;

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
              <BreadcrumbLink render={<Link href="/dashboard/recovery" />}>
                {ta.breadcrumb.recovery}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{ta.breadcrumb.list}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AddRecoveryDialog />
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">{ta.list.pageTitle}</h1>
      <RecoveriesList />
    </div>
  );
}
