"use client";
import { FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RecoveryRoutes } from "@/config/routes";
import { HomePageBreadcrumb } from "@/components/recovery/breadcrumbs";
import CreateRecoveryCard from "@/components/recovery/ui/create-recovery-card";
import { FormattedMessage } from "react-intl";
export default function RecoveryPage() {
  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-y-auto py-5">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <HomePageBreadcrumb />
        <Button asChild className="gap-2">
          <Link href={RecoveryRoutes.recoveriesList}>
            <FolderSearch />
            <FormattedMessage id="recovery.viewRecoveries" />
          </Link>
        </Button>
      </div>
      <CreateRecoveryCard />
    </div>
  );
}
