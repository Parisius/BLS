"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransferStatusBadge } from "@/components/governance/shareholding/transfer-status-badge";
import { useAllTransfers } from "@/lib/governance/shareholding/hooks";
import { formatDisplayDate } from "@/lib/shared/date-utils";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function TransfersHistoryDialog({ trigger, children }: { trigger: React.ReactElement; children: React.ReactNode }) {
  const { data, isLoading, isError } = useAllTransfers();
  const { t } = useDictionary();
  const th = t.shareholding.history;

  return (
    <Dialog>
      <DialogTrigger render={trigger} disabled={!data || data.length === 0}>
        {children}
      </DialogTrigger>
      <DialogContent className="flex max-h-screen max-w-xl flex-col">
        <DialogHeader>
          <DialogTitle>{th.title}</DialogTitle>
          <DialogDescription>{th.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 space-y-5 overflow-auto">
          {!data && isLoading && <p className="italic text-muted-foreground">{th.loading}</p>}
          {!data && isError && <p className="italic text-destructive">{th.error}</p>}
          {data?.map(({ id, seller, buyer, shares, transferDate, status, type }) => (
            <Card key={id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>
                    {shares} {shares > 1 ? th.shares : th.share}
                  </CardTitle>
                  <TransferStatusBadge status={status} />
                </div>
                <CardDescription className="space-x-5 text-lg">
                  <span className="text-destructive">{seller.name}</span>
                  <MoveRight className="inline" />
                  <span className="text-secondary">{buyer.name}</span>
                </CardDescription>
                <div className="flex items-center justify-between gap-2">
                  <CardDescription className="italic">
                    {th.transferredOn} {formatDisplayDate(transferDate)}
                  </CardDescription>
                  {type === "tier" && (
                    <Button
                      variant="link"
                      className="gap-2 px-0 italic"
                      render={<Link href={`/dashboard/governance/shareholding/transfers/${id}`} />}
                    >
                      {th.viewDetails} <MoveRight />
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="destructive" />}>{th.close}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
