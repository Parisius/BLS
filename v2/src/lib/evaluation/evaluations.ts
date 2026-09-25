"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import { toBackendDate } from "@/lib/shared/date-utils";
import type { Score, ScoreInput } from "@/lib/shared/scores";
import type { ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";
import type { components } from "@/lib/api/schema";
import { mapCollaborator, type Collaborator } from "./mappers";

type NotationResponse = components["schemas"]["Notation"];
type IndicatorResponse = NonNullable<NotationResponse["original_indicators"]>[number];

export interface EvaluationPerson {
  id: string;
  firstname: string;
  lastname: string;
  email?: string;
}

export interface EvaluationForward {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
  globalScore?: number;
  scores: Score[];
  sender: EvaluationPerson;
  receiver: EvaluationPerson;
}

export interface Evaluation {
  id: string;
  reference: string;
  collaborator: Collaborator;
  originalGlobalScore?: number;
  originalStatus: string;
  currentGlobalScore?: number;
  currentStatus: string;
  createdBy: EvaluationPerson;
  originalScores: Score[];
  currentScores: Score[];
  forwards: EvaluationForward[];
}

const toPerson = (user?: { id?: string; firstname?: string; lastname?: string; email?: string }): EvaluationPerson => ({
  id: user?.id ?? "",
  firstname: user?.firstname ?? "",
  lastname: user?.lastname ?? "",
  email: user?.email,
});

const optionalNumber = (value: unknown) => (value == null || value === "" ? undefined : Number(value));

const mapScores = (indicators?: IndicatorResponse[]): Score[] =>
  (indicators ?? []).map((item) => ({
    score: Number(item.note ?? 0),
    criteria: {
      id: item.performance_indicator?.id ?? "",
      title: item.performance_indicator?.title ?? "",
      type: item.performance_indicator?.type ?? "",
      maxScore: Number(item.performance_indicator?.note ?? 0),
    },
  }));

function mapEvaluation(item: NotationResponse): Evaluation {
  return {
    id: item.id!,
    reference: item.evaluation_reference ?? "",
    collaborator: mapCollaborator(item.collaborator),
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

export async function getAllEvaluations() {
  return unwrap(await apiClient.GET("/notations")).map(mapEvaluation);
}

export async function getOneEvaluation(evaluationId: string) {
  return mapEvaluation(
    unwrap(await apiClient.GET("/notations/{evaluationId}", { params: { path: { evaluationId } } })),
  );
}

const toNotes = (scores: ScoreInput[]) =>
  scores.map((score) => ({ performance_indicator_id: score.criteriaId, note: score.score }));

export async function createEvaluation(args: { collaboratorId: string; isArchived: boolean; scores: ScoreInput[] }) {
  return mapEvaluation(
    unwrap(
      await apiClient.POST("/notations", {
        body: {
          status: args.isArchived ? "archived" : undefined,
          collaborator_id: args.collaboratorId,
          notes: toNotes(args.scores),
        },
      }),
    ),
  );
}

export async function updateEvaluation(evaluationId: string, args: { scores: ScoreInput[] }) {
  unwrap(
    await apiClient.PUT("/notations/{evaluationId}", {
      params: { path: { evaluationId } },
      body: { notes: toNotes(args.scores) },
    }),
  );
}

export async function forwardEvaluation(evaluationId: string, args: ForwardWorkflowTaskArgs) {
  const { error } = await apiClient.POST("/evaluation_create_transfers", {
    body: {
      notation_id: evaluationId,
      forward_title: args.title,
      deadline_transfer: toBackendDate(args.dueDate),
      description: args.description,
      collaborators: [args.receiverId],
    },
  });
  throwIfError(error, "Failed to forward the evaluation");
}

export async function completeEvaluation(args: { transferId: string; scores: ScoreInput[] }) {
  // Typed as multipart in the generated client (contracts upload documents through it); evaluations send JSON.
  const { error } = await apiClient.POST("/complete_transfers", {
    body: { type: "evaluation", transfer_id: args.transferId, notes: toNotes(args.scores) } as never,
  });
  throwIfError(error, "Failed to complete the evaluation");
}

export async function printEvaluation(evaluationId: string) {
  const { data, error, response } = await apiClient.GET("/generate_pdf_fiche_suivi_evaluation", {
    params: { query: { notation_id: evaluationId } },
    parseAs: "arrayBuffer",
  });
  throwIfError(error, "Failed to print the evaluation");
  if (!data) throw new Error("Failed to print the evaluation");
  const filename = response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "evaluation.pdf";
  return { bytes: Array.from(new Uint8Array(data as ArrayBuffer)), filename };
}
