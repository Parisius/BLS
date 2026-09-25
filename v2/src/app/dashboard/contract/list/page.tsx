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
import { AddContractDialog } from "@/components/contract/add-contract-dialog";
import { ContractsList } from "@/components/contract/contracts-list";
import { getDictionary } from "@/lib/i18n/locale";

export default async function ContractListPage() {
  const { t } = await getDictionary();
  const tc = t.contract;

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
              <BreadcrumbLink render={<Link href="/dashboard/contract" />}>
                {tc.breadcrumb.contract}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tc.breadcrumb.contractList}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <AddContractDialog />
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {tc.listPage.chooseContract}
      </h1>
      <ContractsList />
    </div>
  );
}
