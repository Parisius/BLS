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
import { LitigationDetailView } from "@/components/litigation/litigation-detail-view";
import { getDictionary } from "@/lib/i18n/locale";

export default async function LitigationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { t } = await getDictionary();
  const tl = t.litigation;

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
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
            <BreadcrumbLink render={<Link href="/dashboard/litigation/list" />}>{tl.breadcrumb.litigationList}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tl.breadcrumb.details}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <LitigationDetailView litigationId={id} />
    </div>
  );
}
