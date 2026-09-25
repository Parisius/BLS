"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllAudits,
  getOneAudit,
  createAudit,
  updateAudit,
  forwardAudit,
  completeAudit,
  printAudit,
  type AuditScoreInput,
} from "./audits";
import {
  getAllAuditCriteria,
  getOneAuditCriteria,
  createAuditCriteria,
  updateAuditCriteria,
  deleteAuditCriteria,
  type AuditCriteriaArgs,
} from "./criteria";
import type { ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";

const ROOT = ["audit"];
const AUDITS_KEY = [...ROOT, "audits"];
const oneAuditKey = (auditId: string) => [...AUDITS_KEY, auditId];
const CRITERIA_KEY = [...ROOT, "criteria"];

export const useAllAudits = () => useQuery({ queryKey: AUDITS_KEY, queryFn: getAllAudits });

export const useOneAudit = (auditId: string) =>
  useQuery({ queryKey: oneAuditKey(auditId), queryFn: () => getOneAudit(auditId) });

export const useCreateAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAudit,
    onSettled: () => queryClient.invalidateQueries({ queryKey: AUDITS_KEY }),
  });
};

// Every change to an audit shows on its card (score/status) as well as on its own page.
const invalidateAudit = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: AUDITS_KEY });

export const useUpdateAudit = (auditId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { scores: AuditScoreInput[] }) => updateAudit(auditId, args),
    onSettled: () => invalidateAudit(queryClient),
  });
};

export const useForwardAudit = (auditId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: ForwardWorkflowTaskArgs) => forwardAudit(auditId, args),
    onSettled: () => invalidateAudit(queryClient),
  });
};

export const useCompleteAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeAudit,
    onSettled: () => invalidateAudit(queryClient),
  });
};

export const usePrintAudit = () => useMutation({ mutationFn: printAudit });

export const useAllAuditCriteria = (module?: string) =>
  useQuery({ queryKey: [...CRITERIA_KEY, "list", module ?? "all"], queryFn: () => getAllAuditCriteria(module) });

export const useOneAuditCriteria = (criteriaId: string, enabled = true) =>
  useQuery({ queryKey: [...CRITERIA_KEY, "one", criteriaId], queryFn: () => getOneAuditCriteria(criteriaId), enabled });

export const useCreateAuditCriteria = (module: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: AuditCriteriaArgs) => createAuditCriteria(module, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CRITERIA_KEY }),
  });
};

export const useUpdateAuditCriteria = (criteriaId: string, module: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: AuditCriteriaArgs) => updateAuditCriteria(criteriaId, module, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: CRITERIA_KEY }),
  });
};

export const useDeleteAuditCriteria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAuditCriteria,
    onSettled: () => queryClient.invalidateQueries({ queryKey: CRITERIA_KEY }),
  });
};
