"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllGuarantees,
  getOneGuarantee,
  createGuarantee,
  startRealisation,
  printGuarantee,
  getAutonomousGuarantees,
  type CreateGuaranteeArgs,
} from "./guarantees";
import {
  getAllSafetySteps,
  createSafetyStep,
  updateSafetyStep,
  completeSafetyStep,
  forwardSafetyStep,
  deleteSafetyStep,
  type SafetyStepArgs,
} from "./steps";
import { useAllContracts } from "@/lib/contract/hooks";
import type { SafetyKind } from "./kinds";
import type { ForwardWorkflowTaskArgs } from "@/lib/shared/workflow-task";

const ROOT = ["safety"];
const listKey = (kind: SafetyKind) => [...ROOT, kind, "list"];
const GUARANTEES_KEY = [...ROOT, "guarantee"];
const oneKey = (guaranteeId: string) => [...GUARANTEES_KEY, guaranteeId];
const stepsKey = (guaranteeId: string) => [...ROOT, "steps", guaranteeId];

export const useAllGuarantees = (kind: SafetyKind) =>
  useQuery({ queryKey: listKey(kind), queryFn: () => getAllGuarantees(kind) });

export const useOneGuarantee = (guaranteeId: string) =>
  useQuery({ queryKey: oneKey(guaranteeId), queryFn: () => getOneGuarantee(guaranteeId) });

export const useCreateGuarantee = (kind: SafetyKind) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: CreateGuaranteeArgs) => createGuarantee(kind, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: listKey(kind) }),
  });
};

/** Realisation changes the phase shown on the detail page, the list card and the steps. */
export const useStartRealisation = (guaranteeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => startRealisation(guaranteeId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ROOT });
    },
  });
};

export const usePrintGuarantee = () => useMutation({ mutationFn: printGuarantee });

export const useAutonomousGuarantees = () =>
  useQuery({ queryKey: [...ROOT, "autonomous"], queryFn: getAutonomousGuarantees });

/** Contracts a safety can be attached to (all contracts, like the original). */
export const useSafetyContracts = () => useAllContracts();

export const useAllSafetySteps = (guaranteeId: string) =>
  useQuery({ queryKey: stepsKey(guaranteeId), queryFn: () => getAllSafetySteps(guaranteeId) });

function invalidateGuarantee(queryClient: ReturnType<typeof useQueryClient>, guaranteeId: string) {
  queryClient.invalidateQueries({ queryKey: oneKey(guaranteeId) });
  return queryClient.invalidateQueries({ queryKey: stepsKey(guaranteeId) });
}

export const useCreateSafetyStep = (guaranteeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: SafetyStepArgs) => createSafetyStep(guaranteeId, args),
    onSettled: () => invalidateGuarantee(queryClient, guaranteeId),
  });
};

export const useUpdateSafetyStep = (guaranteeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stepId, args }: { stepId: string; args: SafetyStepArgs }) => updateSafetyStep(stepId, args),
    onSettled: () => invalidateGuarantee(queryClient, guaranteeId),
  });
};

export const useCompleteSafetyStep = (guaranteeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stepId, formData }: { stepId: string; formData: FormData }) => completeSafetyStep(guaranteeId, stepId, formData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...ROOT] });
      return invalidateGuarantee(queryClient, guaranteeId);
    },
  });
};

export const useForwardSafetyStep = (guaranteeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stepId, args }: { stepId: string; args: ForwardWorkflowTaskArgs }) => forwardSafetyStep(stepId, args),
    onSettled: () => queryClient.invalidateQueries({ queryKey: stepsKey(guaranteeId) }),
  });
};

export const useDeleteSafetyStep = (guaranteeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSafetyStep,
    onSettled: () => invalidateGuarantee(queryClient, guaranteeId),
  });
};
