"use client";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ContractRoutes, ModulesRoutes } from "@/config/routes";
import { Component } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useIntl } from "react-intl";

export function ContractsListPageBreadcrumb() {
  const intl = useIntl();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={ModulesRoutes.modules}>
              <Component />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <BreadcrumbEllipsis aria-label="Toggle menu" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href={ContractRoutes.index}>
                  {intl.formatMessage({
                    id: "contract.contract.breadcrumb.contract",
                  })}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <div className="hidden sm:contents">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={ContractRoutes.index}>
                {intl.formatMessage({
                  id: "contract.contract.breadcrumb.contract",
                })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </div>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {intl.formatMessage({
              id: "contract.contract.breadcrumb.contractList",
            })}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
