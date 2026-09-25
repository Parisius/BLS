import Link from "next/link";
import { Component, FileSearch, ListChecks } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CreateContractCard } from "@/components/contract/create-contract-card";
import { getDictionary } from "@/lib/i18n/locale";

export default async function ContractHomePage() {
  const { t } = await getDictionary();
  const tc = t.contract;

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
            <BreadcrumbPage>{tc.breadcrumb.contract}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90" render={<Link href="/dashboard/contract/models" />}>
          <FileSearch />
          {tc.viewModelsButton}
        </Button>
        <Button className="gap-2" render={<Link href="/dashboard/contract/list" />}>
          <ListChecks />
          {tc.viewContractsButton}
        </Button>
      </div>

      <CreateContractCard />
    </div>
  );
}
