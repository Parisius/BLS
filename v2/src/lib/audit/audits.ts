"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";
import type { components } from "@/lib/api/schema";

type AuditResponse = components["schemas"]["AuditNotation"];
type IndicatorResponse = NonNullable<AuditResponse["original_indicators"]>[number];

export interface AuditScore {
  score: number;
  criteria: { id: string; title: string; type: string; maxScore: number };
}

export interface AuditPerson {
  id: string;
  firstname: string;
  lastname: string;
  email?: string;
}

export interface AuditForward {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
  globalScore?: number;
  scores: AuditScore[];
  sender: AuditPerson;
  receiver: AuditPerson;
}

export interface Audit {
  id: string;
  reference: string;
  title: string;
  module: string;
  moduleId: string;
  originalGlobalScore?: number;
  originalStatus: string;
  currentGlobalScore?: number;
  currentStatus: string;
  createdBy: AuditPerson;
  originalScores: AuditScore[];
  currentScores: AuditScore[];
  forwards: AuditForward[];
}

const toPerson = (user?: { id?: string; firstname?: string; lastname?: string; email?: string }): AuditPerson => ({
  id: user?.id ?? "",
  firstname: user?.firstname ?? "",
  lastname: user?.lastname ?? "",
  email: user?.email,
});

const optionalNumber = (value: unknown) => (value == null || value === "" ? undefined : Number(value));

const mapScores = (indicators?: IndicatorResponse[]): AuditScore[] =>
  (indicators ?? []).map((item) => ({
    score: Number(item.note ?? 0),
    criteria: {
      id: item.audit_performance_indicator?.id ?? "",
      title: item.audit_performance_indicator?.title ?? "",
      type: item.audit_performance_indicator?.type ?? "",
      maxScore: Number(item.audit_performance_indicator?.note ?? 0),
    },
  }));

function mapAudit(item: AuditResponse): Audit {
  return {
    id: item.id!,
    reference: item.audit_reference ?? "",
    title: item.title ?? "",
    module: item.module ?? "",
    moduleId: item.module_id ?? "",
    originalGlobalScore: optionalNumber(item.original_note),
    originalStatus: item.original_status ?? "",
    currentGlobalScore: optionalNumber(item.last_note),
    currentStatus: item.last_status ?? "",
    createdBy: toPerson(item.creator),
    originalScores: mapScores(item.original_indicators),
    currentScores: mapScores(item.last_indicators),
    forwards: (item.transfers ?? []).map((transfer) => ({
      id: transfer.id ?? "",
      title: transfer.title ?? "",
      dueDate: transfer.deadline ?? "",
      description: transfer.description ?? "",
      completed: !!transfer.status,
      globalScore: optionalNumber(transfer.notation?.note),
      scores: mapScores(transfer.notation?.indicators),
      sender: toPerson(transfer.sender),
      receiver: toPerson(transfer.collaborators?.[0]),
    })),
  };
}

export async function getAllAudits() {
  return unwrap(await apiClient.GET("/audit_notations")).map(mapAudit);
}

export async function getOneAudit(auditId: string) {
  return mapAudit(unwrap(await apiClient.GET("/audit_notations/{auditId}", { params: { path: { auditId } } })));
}

export interface AuditScoreInput {
  criteriaId: string;
  score: number;
}

const toNotes = (scores: AuditScoreInput[]) =>
  scores.map((score) => ({ audit_performance_indicator_id: score.criteriaId, note: score.score }));

export async function createAudit(args: { module: string; moduleId: string; scores: AuditScoreInput[] }) {
  return mapAudit(
    unwrap(
      await apiClient.POST("/audit_notations", {
        body: { module: args.module, module_id: args.moduleId, notes: toNotes(args.scores) },
      }),
    ),
  );
}

export async function updateAudit(auditId: string, args: { scores: AuditScoreInput[] }) {
  unwrap(
    await apiClient.PUT("/audit_notations/{auditId}", {
      params: { path: { auditId } },
      body: { notes: toNotes(args.scores) },
    }),
  );
}

export async function forwardAudit(auditId: string, args: ForwardWorkflowTaskArgs) {
  const { error } = await apiClient.POST("/audit_create_transfers", {
    body: {
      audit_notation_id: auditId,
      forward_title: args.title,
      deadline_transfer: toBackendDate(args.dueDate),
      description: args.description,
      collaborators: [args.receiverId],
    },
  });
  throwIfError(error, "Failed to forward the audit");
}

export async function completeAudit(args: { transferId: string; scores: AuditScoreInput[] }) {
  // The generated type models this endpoint as multipart (contracts upload documents through it); the audit
  // completion sends plain JSON like the original app did.
  const { error } = await apiClient.POST("/complete_transfers", {
    body: { type: "audit", transfer_id: args.transferId, notes: toNotes(args.scores) } as never,
  });
  throwIfError(error, "Failed to complete the audit");
}

export async function printAudit(auditId: string) {
  const { data, error, response } = await apiClient.GET("/generate_pdf_fiche_suivi_audit", {
    params: { query: { audit_notation_id: auditId } },
    parseAs: "arrayBuffer",
  });
  throwIfError(error, "Failed to print the audit");
  if (!data) throw new Error("Failed to print the audit");
  const filename = response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "audit.pdf";
  return { bytes: Array.from(new Uint8Array(data as ArrayBuffer)), filename };
}
