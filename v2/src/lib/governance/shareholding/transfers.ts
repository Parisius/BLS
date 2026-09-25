"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { components } from "@/lib/api/schema";
import type { CorporateType, ShareholderType } from "./shareholders";

type TransferResponse = components["schemas"]["ActionTransfer"];

export type TransferType = "shareholder" | "tier";
export type TransferStatus = "pending" | "rejected" | "cancelled" | "validated" | "approved";

export interface SharesTransfer {
  id: string;
  reference?: string;
  transferNumber?: string;
  type: TransferType;
  status: TransferStatus;
  shares: number;
  transferDate: string;
  seller: { id: string; name: string };
  buyer: { id: string; name: string };
  files: { fileUrl: string; filename: string }[];
  currentTask?: { id: string; title: string; dueDate?: string };
}

function mapTransfer(item: TransferResponse): SharesTransfer {
  return {
    id: item.id!,
    reference: item.reference,
    // `transfer_id` holds the formatted transfer date (backend quirk); the sequence number lives in the reference.
    transferNumber: item.reference?.match(/-(\d+)-/)?.[1] ?? item.reference,
    type: item.type === "tier" ? "tier" : "shareholder",
    status: (item.status as TransferStatus) ?? "pending",
    shares: Number(item.count_actions ?? 0),
    transferDate: item.transfer_date ?? "",
    seller: { id: item.owner?.id ?? "", name: item.owner?.name ?? "" },
    buyer: { id: item.buyer?.id ?? "", name: item.buyer?.name ?? "" },
    files: (item.files ?? []).map((file) => ({ fileUrl: file.file_url ?? "", filename: file.filename ?? "" })),
    currentTask: item.current_task?.id
      ? { id: item.current_task.id, title: item.current_task.title ?? "", dueDate: item.current_task.deadline }
      : undefined,
  };
}

export async function getAllTransfers() {
  const data = unwrap(await apiClient.GET("/action_transfers"));
  return data.map(mapTransfer);
}

export async function getOneTransfer(transferId: string) {
  const data = unwrap(
    await apiClient.GET("/action_transfers/{transferId}", { params: { path: { transferId } } }),
  );
  return mapTransfer(data);
}

export interface TransferSharesArgs {
  type: TransferType;
  shares: number;
  transferDate: string;
  sellerId: string;
  /** Existing shareholder or existing third party id. */
  buyerId?: string;
  /** Name of a brand-new third party (non-shareholder). */
  thirdPartyName?: string;
}

export async function transferShares(args: TransferSharesArgs) {
  const { error } = await apiClient.POST("/action_transfers", {
    body: {
      type: args.type,
      count_actions: args.shares,
      transfer_date: toBackendDate(args.transferDate),
      owner_id: args.sellerId,
      buyer_id: args.buyerId,
      name: args.thirdPartyName,
    },
  });
  throwIfError(error, "Failed to transfer the shares");
}

export interface ApproveTransferArgs {
  nationality: string;
  address: string;
  type: ShareholderType;
  corporateType?: CorporateType;
}

export async function approveTransfer(transferId: string, args: ApproveTransferArgs) {
  const { error } = await apiClient.POST("/approved_action_transfers", {
    body: {
      action_transfer_id: transferId,
      nationality: args.nationality,
      address: args.address,
      type: args.type,
      corporate_type: args.type === "corporate" ? args.corporateType : undefined,
    },
  });
  throwIfError(error, "Failed to approve the transfer");
}
