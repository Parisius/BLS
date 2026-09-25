"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

type RecoveryResponse = components["schemas"]["Recovery"];

export type RecoveryType =
  | "friendly_without_guarantee"
  | "friendly_with_guarantee"
  | "forced_without_guarantee"
  | "forced_with_guarantee";

export interface Recovery {
  id: string;
  title: string;
  reference?: string;
  type: RecoveryType;
  guaranteeId?: string;
  contractId?: string;
  isArchived: boolean;
  currentStep?: { id: string; title: string };
  nextStep?: { id: string; title: string };
  files: { fileUrl: string; filename: string }[];
}

function mapRecovery(item: RecoveryResponse): Recovery {
  const kind = item.type === "forced" ? "forced" : "friendly";
  return {
    id: item.id!,
    title: item.name ?? "",
    reference: item.reference,
    type: `${kind}_${item.has_guarantee ? "with" : "without"}_guarantee`,
    guaranteeId: item.guarantee_id ?? undefined,
    contractId: item.contract_id ?? undefined,
    isArchived: !!item.is_archived,
    currentStep: item.current_step?.id ? { id: item.current_step.id, title: item.current_step.name ?? "" } : undefined,
    nextStep: item.next_step?.id ? { id: item.next_step.id, title: item.next_step.name ?? "" } : undefined,
    files: (item.documents ?? []).map((file) => ({ fileUrl: file.file_url ?? "", filename: file.filename ?? "" })),
  };
}

export async function getAllRecoveries() {
  const data = unwrap(await apiClient.GET("/recovery"));
  return data.map(mapRecovery);
}

export async function getOneRecovery(recoveryId: string) {
  const data = unwrap(await apiClient.GET("/recovery/{recoveryId}", { params: { path: { recoveryId } } }));
  return mapRecovery(data);
}

export interface CreateRecoveryArgs {
  title: string;
  type: RecoveryType;
  guaranteeId?: string;
  contractId?: string;
}

/**
 * Backend quirk: creating a recovery without a guarantee inserts the record but then fails while building
 * its response, so the request errors even though the recovery exists. When that happens we look for exactly
 * one recovery that wasn't there before and has this title, and treat it as the created one.
 */
export async function createRecovery(args: CreateRecoveryArgs) {
  const hasGuarantee = args.type.includes("with_guarantee") && !args.type.includes("without_guarantee");
  const before = new Set((await getAllRecoveries()).map((recovery) => recovery.id));

  const { data, error } = await apiClient.POST("/recovery", {
    body: {
      name: args.title,
      type: args.type.startsWith("forced") ? "forced" : "friendly",
      has_guarantee: hasGuarantee,
      guarantee_id: hasGuarantee ? args.guaranteeId : undefined,
      contract_id: hasGuarantee ? undefined : args.contractId,
    },
  });
  if (data?.data) return mapRecovery(data.data);

  const created = (await getAllRecoveries()).filter((recovery) => !before.has(recovery.id) && recovery.title === args.title);
  if (created.length === 1) return created[0];
  throwIfError(error, "Failed to create the recovery");
  throw new Error("Failed to create the recovery");
}

export async function printRecovery(recoveryId: string) {
  const { data, error, response } = await apiClient.GET("/recovery/generate-pdf/{recoveryId}", {
    params: { path: { recoveryId } },
    parseAs: "arrayBuffer",
  });
  throwIfError(error, "Failed to print the recovery");
  if (!data) throw new Error("Failed to print the recovery");
  const filename = response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "recovery.pdf";
  return { bytes: Array.from(new Uint8Array(data as ArrayBuffer)), filename };
}
