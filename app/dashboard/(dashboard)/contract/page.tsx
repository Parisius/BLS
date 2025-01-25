"use client";
import { BookDashed, FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContractRoutes } from "@/config/routes";
import { HomePageBreadcrumb } from "@/components/contract/breadcrumbs";
import CreateContractCard from "@/components/contract/ui/create-contract-card";
import { useIntl } from "react-intl";

export default function ContractPage() {
  const intl = useIntl();

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <HomePageBreadcrumb />
        <div className="flex flex-col justify-end gap-2 sm:flex-row sm:items-center">
          <Button asChild variant="secondary" className="gap-2">
            <Link href={ContractRoutes.contractModels().index}>
              <BookDashed />
              {intl.formatMessage({ id: "contract.contract.viewModelsButton" })}
            </Link>
          </Button>

          <Button asChild className="gap-2">
            <Link href={ContractRoutes.contractsList}>
              <FolderSearch />
              {intl.formatMessage({
                id: "contract.contract.viewContractsButton",
              })}
            </Link>
          </Button>
        </div>
      </div>
      <CreateContractCard />
    </div>
  );
}
