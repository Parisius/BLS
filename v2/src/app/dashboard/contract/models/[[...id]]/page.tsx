"use client";

import { use } from "react";
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
import { useAllContractModels } from "@/lib/contract/hooks";
import { ContractModelsList, AddContractModelCategoryDialog, AddContractModelDialog } from "@/components/contract/contract-models-ui";
import { useDictionary } from "@/lib/i18n/locale-provider";

export default function ContractModelCategoriesPage({
  params,
}: {
  params: Promise<{ id?: string[] }>;
}) {
  const { id } = use(params);
  const parentId = id?.[0];
  const { data, isLoading } = useAllContractModels(parentId);
  const { t } = useDictionary();
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
              <BreadcrumbPage>{tc.breadcrumb.modelCategories}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <AddContractModelCategoryDialog parentId={parentId} />
          <AddContractModelDialog parentId={data?.id ? String(data.id) : parentId} />
        </div>
      </div>
      <h1 className="relative text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {data?.id ? data.name : tc.categoriesPage.title}
      </h1>
      <ContractModelsList models={data?.children ?? []} isLoading={isLoading} />
    </div>
  );
}
