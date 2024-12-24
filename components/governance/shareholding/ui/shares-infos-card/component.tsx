"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, formatAmount, formatNumber } from "@/lib/utils";
import Image from "next/image";
import {
  Banknote,
  CircleDollarSign,
  Landmark,
  Pencil,
  Tag,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareholdersModal from "@/components/governance/shareholding/modals/shareholders-modal";
import { useBankInfos } from "@/services/api-sdk/models/shareholding";
import UpdateBankInfosDialog from "@/components/governance/shareholding/modals/update-bank-infos-dialog";
import AddBankCapitalDialog from "@/components/governance/shareholding/modals/add-bank-capital-dialog";
import { SharesInfosCardSuspense } from "./suspense";
import { FormattedMessage } from "@/components/intl/formatters";
export function SharesInfosCardComponent({ className }) {
  const { data, isLoading } = useBankInfos();
  if (isLoading) {
    return <SharesInfosCardSuspense className={className} />;
  }
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="relative gap-3">
        <Image
          src={data?.logoUrl ?? "/global/images/default-bank-logo.webp"}
          alt="Bank's logo"
          width={150}
          height={100}
          className="self-center"
        />
        <UpdateBankInfosDialog asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-5 top-5 rounded-full text-muted-foreground"
          >
            <Pencil />
          </Button>
        </UpdateBankInfosDialog>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-1 font-semibold">
            <Tag />
            <span>
              <FormattedMessage id="shareholding.name" />
            </span>
          </div>
          <span className="italic text-muted-foreground">
            {data?.name ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-1 font-semibold">
            <Landmark />
            <span>
              <FormattedMessage id="shareholding.head_office" />
            </span>
          </div>
          <span className="italic text-muted-foreground">
            {data?.headOffice ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-1 font-semibold">
            <CircleDollarSign />
            <span>
              <FormattedMessage id="shareholding.capital" />
            </span>
          </div>
          {data?.capital ? (
            <AddBankCapitalDialog asChild>
              <Button variant="link" className="h-auto p-0 italic underline">
                {formatAmount(data.capital)}
              </Button>
            </AddBankCapitalDialog>
          ) : (
            <div className="flex items-center gap-2">
              <AddBankCapitalDialog asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground"
                >
                  <Pencil />
                </Button>
              </AddBankCapitalDialog>
              <span>-</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-1 font-semibold">
            <Banknote />
            <span>
              <FormattedMessage id="shareholding.nominal_value" />
            </span>
          </div>
          {data?.nominalValue ? (
            <AddBankCapitalDialog asChild>
              <Button variant="link" className="h-auto p-0 italic underline">
                {formatAmount(data.nominalValue)}
              </Button>
            </AddBankCapitalDialog>
          ) : (
            <div className="flex items-center gap-2">
              <AddBankCapitalDialog asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground"
                >
                  <Pencil />
                </Button>
              </AddBankCapitalDialog>
              <span>-</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-1 font-semibold">
            <Banknote />
            <span>
              <FormattedMessage id="shareholding.number_of_shares" />
            </span>
          </div>
          {data?.nominalValue && data?.capital ? (
            <AddBankCapitalDialog asChild>
              <Button variant="link" className="h-auto p-0 italic underline">
                {formatNumber(data.capital / data.nominalValue)}
              </Button>
            </AddBankCapitalDialog>
          ) : (
            <div className="flex items-center gap-2">
              <AddBankCapitalDialog asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground"
                >
                  <Pencil />
                </Button>
              </AddBankCapitalDialog>
              <span>-</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-1 font-semibold">
            <Users />
            <span>
              <FormattedMessage id="shareholding.shareholders" />
            </span>
          </div>
          <ShareholdersModal asChild>
            <Button variant="link" className="h-auto p-0 italic underline">
              {formatNumber(data?.shareholdersCount ?? 0)}
            </Button>
          </ShareholdersModal>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-1 font-semibold">
            <User />
            <span>
              <FormattedMessage id="shareholding.majority_shareholder" />
            </span>
          </div>
          <span className="inline-flex italic text-muted-foreground">
            {data?.majorityShareholder ? (
              <>
                <span className="line-clamp-1 max-w-[10rem] break-all">
                  {data.majorityShareholder.name}
                </span>
                <span>
                  ({data.majorityShareholder.sharePercentage ?? "-"}%)
                </span>
              </>
            ) : (
              "-"
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
