"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

type LitigationResponse = components["schemas"]["LitigationCase"];

export interface Litigation {
  id: string;
  title: string;
  caseNumber: string;
  reference: string;
  isArchived: boolean;
  jurisdictionLocation: string;
  hasProvisions: boolean;
  nature: { id: string; title: string };
  jurisdiction: { id: string; title: string };
  currentStep?: { id: string; title: string };
  nextStep?: { id: string; title: string };
  parties: { id: string; name: string; category: string; type: string }[];
  users: { id: string; name: string; email?: string }[];
  lawyers: { id: string; name: string; email?: string; phone?: string }[];
  files: { fileUrl: string; filename: string }[];
  estimatedAmount?: number;
  addedAmount?: number;
  remainingAmount?: number;
}

function mapLitigation(item: LitigationResponse): Litigation {
  return {
    id: item.id!,
    title: item.name ?? "",
    caseNumber: item.case_number ?? "",
    reference: item.reference ?? "",
    isArchived: !!item.is_archived,
    jurisdictionLocation: item.jurisdiction_location ?? "",
    hasProvisions: !!item.has_provisions,
    nature: { id: item.nature?.id ?? "", title: item.nature?.name ?? "" },
    jurisdiction: { id: item.jurisdiction?.id ?? "", title: item.jurisdiction?.name ?? "" },
    currentStep: item.current_step?.id ? { id: item.current_step.id, title: item.current_step.title ?? "" } : undefined,
    nextStep: item.next_step?.id ? { id: item.next_step.id, title: item.next_step.title ?? "" } : undefined,
    parties: (item.parties ?? []).map((party) => ({
      id: party.id!,
      name: party.name ?? "",
      category: party.category ?? "",
      type: party.type ?? "",
    })),
    users: (item.users ?? []).map((user) => ({ id: user.id!, name: user.name ?? "", email: user.email })),
    lawyers: (item.lawyers ?? []).map((lawyer) => ({
      id: lawyer.id!,
      name: lawyer.name ?? "",
      email: lawyer.email,
      phone: lawyer.phone,
    })),
    files: (item.documents ?? []).map((file) => ({ fileUrl: file.file_url ?? "", filename: file.filename ?? "" })),
    estimatedAmount: item.estimated_amount,
    addedAmount: item.added_amount,
    remainingAmount: item.remaining_amount,
  };
}

export async function getAllLitigation() {
  return unwrap(await apiClient.GET("/litigation", {})).map(mapLitigation);
}

/** Cases flagged "to be provisioned" that have not been provisioned yet. */
export async function getUnsuppliedLitigation() {
  return unwrap(await apiClient.GET("/litigation", { params: { query: { type: "not_provisioned" } } })).map(mapLitigation);
}

export async function getOneLitigation(litigationId: string) {
  return mapLitigation(
    unwrap(await apiClient.GET("/litigation/{litigationId}", { params: { path: { litigationId } } })),
  );
}

export async function getLitigationProvisionsSummary() {
  const data = unwrap(await apiClient.GET("/litigation/provisions/stats"));
  return {
    totalAddedAmount: data.sum_added_amount ?? 0,
    totalEstimatedAmount: data.sum_estimated_amount ?? 0,
    totalRemainingAmount: data.sum_remaining_amount ?? 0,
  };
}

export interface LitigationArgs {
  title: string;
  caseNumber: string;
  natureId: string;
  jurisdictionId: string;
  jurisdictionLocation: string;
  hasProvisions: boolean;
  parties: { partyId: string; category: string; type: string }[];
  files: { file: File; filename: string }[];
}

function toFormData(args: LitigationArgs) {
  const formData = new FormData();
  formData.append("name", args.title);
  formData.append("case_number", args.caseNumber);
  formData.append("nature_id", args.natureId);
  formData.append("jurisdiction_id", args.jurisdictionId);
  formData.append("jurisdiction_location", args.jurisdictionLocation);
  formData.append("has_provisions", args.hasProvisions ? "1" : "0");
  args.parties.forEach((party, index) => {
    formData.append(`parties[${index}][party_id]`, party.partyId);
    formData.append(`parties[${index}][category]`, party.category);
    formData.append(`parties[${index}][type]`, party.type);
  });
  args.files.forEach((doc, index) => {
    formData.append(`documents[${index}][file]`, doc.file);
    formData.append(`documents[${index}][name]`, doc.filename);
  });
  return formData;
}

/**
 * Backend quirk: `POST /litigation` inserts the case and then fails while building its response (same defect as
 * recoveries and guarantees). On error we look for exactly one case that wasn't there before and has this title.
 */
export async function createLitigation(args: LitigationArgs) {
  const before = new Set((await getAllLitigation()).map((litigation) => litigation.id));

  // Bracket-indexed multipart fields aren't modelled by openapi-fetch's typed body; a real FormData is sent as-is.
  const { data, error } = await apiClient.POST("/litigation", { body: toFormData(args) as never });
  if (data?.data) return mapLitigation(data.data);

  const created = (await getAllLitigation()).filter(
    (litigation) => !before.has(litigation.id) && litigation.title === args.title,
  );
  if (created.length === 1) return created[0];
  throwIfError(error, "Failed to create the litigation");
  throw new Error("Failed to create the litigation");
}

export async function updateLitigation(litigationId: string, args: LitigationArgs) {
  return mapLitigation(
    unwrap(
      await apiClient.POST("/litigation/modify/{litigationId}", {
        params: { path: { litigationId } },
        body: toFormData(args) as never,
      }),
    ),
  );
}

export interface ProvisionsArgs {
  estimatedAmount: number;
  addedAmount: number;
  remainingAmount: number;
}

export async function addLitigationProvisions(litigationId: string, args: ProvisionsArgs) {
  unwrap(
    await apiClient.PUT("/litigation/update-amount/{litigationId}", {
      params: { path: { litigationId } },
      body: {
        estimated_amount: args.estimatedAmount,
        added_amount: args.addedAmount,
        remaining_amount: args.remainingAmount,
      },
    }),
  );
}

export async function archiveLitigation(litigationId: string) {
  const { error } = await apiClient.PUT("/litigation/archive/{litigationId}", {
    params: { path: { litigationId } },
  });
  throwIfError(error, "Failed to archive the litigation");
}

export async function assignCollaborators(litigationId: string, args: { users: string[]; lawyers: string[] }) {
  const { error } = await apiClient.PUT("/litigation/assign-user/{litigationId}", {
    params: { path: { litigationId } },
    body: { users: args.users, lawyers: args.lawyers },
  });
  throwIfError(error, "Failed to assign collaborators to the litigation");
}

export async function printLitigation(litigationId: string) {
  const { data, error, response } = await apiClient.GET("/litigation/generate-pdf/{litigationId}", {
    params: { path: { litigationId } },
    parseAs: "arrayBuffer",
  });
  throwIfError(error, "Failed to print the litigation");
  if (!data) throw new Error("Failed to print the litigation");
  const filename = response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "litigation.pdf";
  return { bytes: Array.from(new Uint8Array(data as ArrayBuffer)), filename };
}
