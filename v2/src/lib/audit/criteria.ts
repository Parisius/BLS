"use server";

import { apiClient, unwrap, throwIfError } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";

type CriteriaResponse = components["schemas"]["AuditPerformanceIndicator"];

export interface AuditCriteria {
  id: string;
  title: string;
  type: string;
  module: string;
  maxScore: number;
  description: string;
}

const mapCriteria = (item: CriteriaResponse): AuditCriteria => ({
  id: item.id!,
  title: item.title ?? "",
  type: item.type ?? "",
  module: item.module ?? "",
  maxScore: Number(item.note ?? 0),
  description: item.description ?? "",
});

export async function getAllAuditCriteria(module?: string) {
  const data = unwrap(
    await apiClient.GET("/audit_performance_indicators", { params: { query: module ? { module } : {} } }),
  );
  return data.map(mapCriteria);
}

export async function getOneAuditCriteria(criteriaId: string) {
  return mapCriteria(
    unwrap(await apiClient.GET("/audit_performance_indicators/{criteriaId}", { params: { path: { criteriaId } } })),
  );
}

export interface AuditCriteriaArgs {
  title: string;
  type: string;
  maxScore: number;
  description: string;
}

export async function createAuditCriteria(module: string, args: AuditCriteriaArgs) {
  return mapCriteria(
    unwrap(
      await apiClient.POST("/audit_performance_indicators", {
        body: { title: args.title, type: args.type, module, note: args.maxScore, description: args.description },
      }),
    ),
  );
}

export async function updateAuditCriteria(criteriaId: string, module: string, args: AuditCriteriaArgs) {
  return mapCriteria(
    unwrap(
      await apiClient.PUT("/audit_performance_indicators/{criteriaId}", {
        params: { path: { criteriaId } },
        body: { title: args.title, type: args.type, module, note: args.maxScore, description: args.description },
      }),
    ),
  );
}

export async function deleteAuditCriteria(criteriaId: string) {
  const { error } = await apiClient.DELETE("/audit_performance_indicators/{criteriaId}", {
    params: { path: { criteriaId } },
  });
  throwIfError(error, "Failed to delete the audit criteria");
}
