"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import { KIND_SECURITY, type SafetyKind } from "./kinds";

type GuaranteeResponse = components["schemas"]["Guarantee"];

export type SafetyPhase = "formalization" | "formalized" | "realization" | "realized";

export interface Guarantee {
  id: string;
  title: string;
  reference?: string;
  phase: SafetyPhase;
  contractId?: string;
  hasRecovery: boolean;
  /** Mortgage only. */
  isApproved?: boolean;
  estateSalePrice?: number;
  /** Movable / personal only. */
  type?: string;
  security?: string;
  formalizationType?: string;
  currentStep?: { id: string; title: string };
  nextStep?: { id: string; title: string };
  files: { fileUrl: string; filename: string }[];
}

function mapGuarantee(item: GuaranteeResponse): Guarantee {
  return {
    id: item.id!,
    title: item.name ?? "",
    reference: item.reference,
    phase: (item.phase as SafetyPhase) ?? "formalization",
    contractId: item.contract_id ?? undefined,
    hasRecovery: !!item.has_recovery,
    isApproved: item.is_approved,
    estateSalePrice: item.sell_price_estate != null ? Number(item.sell_price_estate) : undefined,
    type: item.type ?? undefined,
    security: item.security ?? undefined,
    formalizationType: item.formalization_type ?? undefined,
    currentStep: item.current_step?.id ? { id: item.current_step.id, title: item.current_step.title ?? "" } : undefined,
    nextStep: item.next_step?.id ? { id: item.next_step.id, title: item.next_step.title ?? "" } : undefined,
    files: (item.documents ?? []).map((file) => ({ fileUrl: file.file_url ?? "", filename: file.filename ?? "" })),
  };
}

export async function getAllGuarantees(kind: SafetyKind) {
  const data = unwrap(await apiClient.GET("/guarantees", { params: { query: { security: KIND_SECURITY[kind] } } }));
  return data.map(mapGuarantee);
}

export async function getOneGuarantee(guaranteeId: string) {
  const data = unwrap(
    await apiClient.GET("/guarantees/{mortgageId}", { params: { path: { mortgageId: guaranteeId } } }),
  );
  return mapGuarantee(data);
}

export interface CreateGuaranteeArgs {
  title: string;
  contractId?: string;
  /** Movable: "pledge" | "collateral". */
  security?: string;
  /** Movable: stock, vehicle, ...; personal: bonding, autonomous, autonomous_counter. */
  type?: string;
  formalizationType?: string;
  /** Personal counter-guarantee: the autonomous guarantee it counters. */
  autonomousId?: string;
}

/**
 * Backend quirk: `POST /guarantees` inserts the guarantee but then fails while building its response, so the
 * request errors even though the record exists (same defect as recoveries). When that happens we look for
 * exactly one guarantee that wasn't there before and has this title, and treat it as the created one.
 */
export async function createGuarantee(kind: SafetyKind, args: CreateGuaranteeArgs) {
  const before = new Set((await getAllGuarantees(kind)).map((guarantee) => guarantee.id));

  const { data, error } = await apiClient.POST("/guarantees", {
    body: {
      name: args.title,
      contract_id: args.contractId || undefined,
      type: kind === "mortgage" ? "mortgage" : args.type,
      security: kind === "movable-safety" ? args.security : undefined,
      formalization_type: kind === "movable-safety" ? args.formalizationType : undefined,
      autonomous_id: kind === "personal-safety" ? args.autonomousId || undefined : undefined,
    },
  });
  if (data?.data) return mapGuarantee(data.data);

  const created = (await getAllGuarantees(kind)).filter(
    (guarantee) => !before.has(guarantee.id) && guarantee.title === args.title,
  );
  if (created.length === 1) return created[0];
  throwIfError(error, "Failed to create the safety");
  throw new Error("Failed to create the safety");
}

export async function startRealisation(guaranteeId: string) {
  const { error } = await apiClient.POST("/guarantees/realization/{mortgageId}", {
    params: { path: { mortgageId: guaranteeId } },
  });
  throwIfError(error, "Failed to start the realisation phase");
}

export async function printGuarantee(guaranteeId: string) {
  const { data, error, response } = await apiClient.GET("/guarantees/generate-pdf/{mortgageId}", {
    params: { path: { mortgageId: guaranteeId } },
    parseAs: "arrayBuffer",
  });
  throwIfError(error, "Failed to print the safety");
  if (!data) throw new Error("Failed to print the safety");
  const filename = response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "safety.pdf";
  return { bytes: Array.from(new Uint8Array(data as ArrayBuffer)), filename };
}

export interface LinkOption {
  id: string;
  title: string;
}

/** Autonomous guarantees a counter-guarantee can be attached to. */
export async function getAutonomousGuarantees(): Promise<LinkOption[]> {
  const data = unwrap(await apiClient.GET("/guarantees", { params: { query: { type: "autonomous" } } }));
  return data.map((item) => ({ id: item.id!, title: item.name ?? "" }));
}
