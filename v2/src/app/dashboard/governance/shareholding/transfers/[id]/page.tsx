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
import { TransferDetailView } from "@/components/governance/shareholding/transfer-detail-view";
import { getDictionary } from "@/lib/i18n/locale";

export default async function SharesTransferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { t } = await getDictionary();
  const tb = t.shareholding.breadcrumb;

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
            <BreadcrumbLink render={<Link href="/dashboard/governance" />}>{tb.governance}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/governance/shareholding" />}>{tb.shareholding}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tb.transfer}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TransferDetailView transferId={id} />
    </div>
  );
}
