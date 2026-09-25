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
import { LitigationList } from "@/components/litigation/litigation-list";
import { AddLitigationDialog } from "@/components/litigation/litigation-dialogs";
import { getDictionary } from "@/lib/i18n/locale";

export default async function LitigationListPage() {
  const { t } = await getDictionary();
  const tl = t.litigation;

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
              <BreadcrumbLink render={<Link href="/dashboard/litigation" />}>{tl.breadcrumb.litigation}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tl.breadcrumb.litigationList}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AddLitigationDialog />
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">{tl.title.chooseFile}</h1>
      <LitigationList />
    </div>
  );
}
