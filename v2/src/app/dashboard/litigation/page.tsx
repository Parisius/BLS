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
import { CreateLitigationCard } from "@/components/litigation/create-litigation-card";
import { ProvisionsSummaryDialog } from "@/components/litigation/provisions-dialogs";
import { UnsuppliedLitigationDialog } from "@/components/litigation/unsupplied-litigation-dialog";
import { getDictionary } from "@/lib/i18n/locale";

export default async function LitigationPage() {
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
              <BreadcrumbPage>{tl.breadcrumb.litigation}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col justify-end gap-2 sm:flex-row sm:items-center">
          <UnsuppliedLitigationDialog />
          <Button className="gap-2" render={<Link href="/dashboard/litigation/list" />}>
            <FolderSearch />
            {tl.viewLitigationsButton}
          </Button>
          <ProvisionsSummaryDialog />
        </div>
      </div>
      <CreateLitigationCard />
    </div>
  );
}
