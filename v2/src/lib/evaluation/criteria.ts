"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

type CriteriaResponse = components["schemas"]["PerformanceIndicator"];

export interface EvaluationCriteria {
  id: string;
  title: string;
  type: string;
  profileId: string;
  maxScore: number;
  description: string;
}

const mapCriteria = (item: CriteriaResponse): EvaluationCriteria => ({
  id: item.id!,
  title: item.title ?? "",
  type: item.type ?? "",
  profileId: item.position?.id ?? "",
  maxScore: Number(item.note ?? 0),
  description: item.description ?? "",
});

/** Criteria of a profile, or of the profile a given collaborator has. */
export async function getAllEvaluationCriteria(filter: { profileId?: string; collaboratorId?: string }) {
  const query = filter.profileId
    ? { position_id: filter.profileId }
    : filter.collaboratorId
      ? { collaborator_id: filter.collaboratorId }
      : {};
  return unwrap(await apiClient.GET("/performance_indicators", { params: { query } })).map(mapCriteria);
}

export interface EvaluationCriteriaArgs {
  title: string;
  type: string;
  maxScore: number;
  description: string;
}

export async function createEvaluationCriteria(profileId: string, args: EvaluationCriteriaArgs) {
  return mapCriteria(
    unwrap(
      await apiClient.POST("/performance_indicators", {
        body: {
          title: args.title,
          type: args.type,
          position_id: profileId,
          note: args.maxScore,
          description: args.description,
        },
      }),
    ),
  );
}

export async function updateEvaluationCriteria(criteriaId: string, profileId: string, args: EvaluationCriteriaArgs) {
  unwrap(
    await apiClient.PUT("/performance_indicators/{criteriaId}", {
      params: { path: { criteriaId } },
      body: {
        title: args.title,
        type: args.type,
        position_id: profileId,
        note: args.maxScore,
        description: args.description,
      },
    }),
  );
}

export async function deleteEvaluationCriteria(criteriaId: string) {
  const { error } = await apiClient.DELETE("/performance_indicators/{criteriaId}", {
    params: { path: { criteriaId } },
  });
  throwIfError(error, "Failed to delete the evaluation criteria");
}
